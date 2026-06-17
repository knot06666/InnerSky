import type { MoodTone, SkyResult } from "@/types/result";

type ImagePart = {
  data: string;
  mimeType: string;
};

const defaultHashtags = ["#ฟ้าข้างใน", "#ฮีลใจ", "#ท้องฟ้า", "#ก้อนเมฆ", "#ใจดีกับตัวเอง"];

export function fallbackSkyResult(tone: MoodTone): SkyResult {
  const toneLine = tone === "กวน ๆ นิด ๆ แต่ยังฮีลใจ" ? "ใจเหนื่อยได้ แต่ยังน่ารักอยู่" : "ใจที่กำลังค่อย ๆ กลับมาหาตัวเอง";

  return {
    isSkyOrNature: true,
    skyName: "ฟ้าที่ค่อย ๆ สว่าง",
    moodSummary: toneLine,
    healingMessage:
      "บางทีวันนี้ใจของคุณอาจต้องการพื้นที่เงียบ ๆ\nไม่ต้องรีบเข้าใจทุกอย่างตอนนี้ก็ได้\nแค่ยังอยู่ตรงนี้ และยังให้ตัวเองหายใจ\nก็นับว่าเก่งมากแล้ว",
    storyText: "ไม่ต้องสว่างทั้งวัน แค่ยังยอมให้แสงเล็ก ๆ เข้ามาก็พอ",
    tinyAction: "วันนี้ลองวางเรื่องใหญ่ไว้ก่อน แล้วพักตาเงียบ ๆ สัก 10 นาที",
    hashtags: defaultHashtags,
    fallback: true,
  };
}

export function parseImageDataUrl(value: string): ImagePart {
  const match = value.match(/^data:(image\/(?:png|jpe?g|webp));base64,(.+)$/i);

  if (!match) {
    throw new Error("รองรับเฉพาะรูป jpg, png หรือ webp เท่านั้น");
  }

  if (match[2].length > 8_500_000) {
    throw new Error("รูปนี้ใหญ่เกินไป ลองเลือกรูปที่เล็กกว่า 6MB นะ");
  }

  return {
    mimeType: match[1].toLowerCase(),
    data: match[2],
  };
}

function getGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  return apiKey;
}

function getGeminiModelCandidates(): string[] {
  const primaryModel = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const fallbackModels = (process.env.GEMINI_MODEL_FALLBACKS ?? "")
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);

  return [...new Set([primaryModel, ...fallbackModels])];
}

function buildPrompt(tone: MoodTone): string {
  return `
ก่อนสร้างผลลัพธ์ ให้ตรวจว่าภาพเป็นท้องฟ้า ก้อนเมฆ แสงธรรมชาติ หรือวิวธรรมชาติหรือไม่
ถ้าไม่ใช่ ให้ส่ง isSkyOrNature: false และ nonSkyMessage เป็นภาษาไทยที่ชวนอัปโหลดรูปใหม่อย่างนุ่มนวล
ถ้าไม่ใช่ภาพในขอบเขต ห้ามสร้าง healingMessage แบบตีความภาพ และอย่าตำหนิผู้ใช้
ถ้าภาพก้ำกึ่งแต่มีทะเล ภูเขา ต้นไม้ พระอาทิตย์ขึ้น พระอาทิตย์ตก แสงธรรมชาติ เมฆ หรือวิวธรรมชาติ ให้อนุญาตให้อ่านได้

คุณคือ “ฟ้าข้างใน” เว็บฮีลใจภาษาไทยที่ช่วยอ่าน mood จากรูปท้องฟ้า ก้อนเมฆ หรือวิวธรรมชาติ

งานของคุณ:
- วิเคราะห์สีของท้องฟ้า แสง เงา ก้อนเมฆ วิว และความรู้สึกโดยรวมของภาพ
- แปล mood ของภาพออกมาเป็นข้อความปลอบใจสั้น ๆ สำหรับผู้ใช้
- ใช้น้ำเสียงตาม tone ที่ผู้ใช้เลือก: ${tone}

กฎสำคัญ:
- ตอบเป็น JSON เท่านั้น ห้ามมี markdown
- ใช้ภาษาไทยเท่านั้น
- น้ำเสียงอบอุ่น ละมุน จริงใจ และปลอดภัย
- ไม่พูดเหมือนหมอดู
- ไม่วินิจฉัยสุขภาพจิต
- ไม่ใช้คำแรง เช่น ซึมเศร้า, สิ้นหวัง, หมดค่า
- ไม่บอกว่าผู้ใช้เป็นอะไรแน่นอน
- ใช้คำว่า “อาจจะ”, “เหมือนว่า”, “บางที”, “วันนี้ใจของคุณดูคล้าย”
- ข้อความต้องสั้น แชร์ง่าย และไม่ดราม่าเกินไป

ส่งกลับ JSON ตาม schema:
{
  "isSkyOrNature": true,
  "nonSkyMessage": "",
  "skyName": "ชื่อฟ้าของวันนี้",
  "moodSummary": "สรุป mood สั้น ๆ",
  "healingMessage": "ข้อความฮีลใจ 3-5 บรรทัด",
  "storyText": "ข้อความสั้นสำหรับลง Story",
  "tinyAction": "สิ่งเล็ก ๆ ที่ควรทำวันนี้",
  "hashtags": ["#ฟ้าข้างใน", "#ฮีลใจ", "#ท้องฟ้า", "#ก้อนเมฆ", "#ใจดีกับตัวเอง"]
}
`.trim();
}

function responseSchema(Type: any) {
  return {
    type: Type.OBJECT,
    properties: {
      isSkyOrNature: { type: Type.BOOLEAN },
      nonSkyMessage: { type: Type.STRING, nullable: true },
      skyName: { type: Type.STRING },
      moodSummary: { type: Type.STRING },
      healingMessage: { type: Type.STRING },
      storyText: { type: Type.STRING },
      tinyAction: { type: Type.STRING },
      hashtags: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
    required: ["isSkyOrNature"],
  };
}

function cleanJson(text: string): SkyResult {
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Gemini response was not valid JSON");
  }

  const parsed = JSON.parse(cleaned.slice(start, end + 1)) as Partial<SkyResult>;

  if (parsed.isSkyOrNature === false) {
    return {
      isSkyOrNature: false,
      nonSkyMessage:
        parsed.nonSkyMessage ||
        "ภาพนี้อาจไม่ใช่ท้องฟ้า ก้อนเมฆ แสงธรรมชาติ หรือวิวธรรมชาติที่ฟ้าข้างในอ่านได้ ลองอัปโหลดรูปฟ้า เมฆ แสงเย็น ๆ หรือวิวธรรมชาติอีกครั้งนะ",
      skyName: "",
      moodSummary: "",
      healingMessage: "",
      storyText: "",
      tinyAction: "",
      hashtags: defaultHashtags,
    };
  }

  return {
    isSkyOrNature: true,
    skyName: parsed.skyName || "ฟ้าที่กำลังพัก",
    moodSummary: parsed.moodSummary || "เหมือนว่าใจของคุณกำลังต้องการความเบา",
    healingMessage:
      parsed.healingMessage ||
      "วันนี้ไม่ต้องรีบเป็นคำตอบของทุกอย่าง\nแค่ค่อย ๆ อยู่กับตัวเองอย่างใจดี\nก็พอแล้วสำหรับตอนนี้",
    storyText: parsed.storyText || "แค่ยังยอมให้แสงเข้ามา ก็เก่งมากแล้ว",
    tinyAction: parsed.tinyAction || "ลองพักโดยไม่ต้องรู้สึกผิดสัก 10 นาที",
    hashtags: Array.isArray(parsed.hashtags) && parsed.hashtags.length > 0 ? parsed.hashtags.slice(0, 5) : defaultHashtags,
  };
}

export async function analyzeSkyImage(image: ImagePart, tone: MoodTone): Promise<SkyResult> {
  const { GoogleGenAI, Type } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
  const errors: string[] = [];

  for (const model of getGeminiModelCandidates()) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: "user",
            parts: [
              { text: buildPrompt(tone) },
              {
                inlineData: {
                  mimeType: image.mimeType,
                  data: image.data,
                },
              },
            ],
          },
        ],
        config: {
          temperature: 0.78,
          responseMimeType: "application/json",
          responseSchema: responseSchema(Type),
        },
      });

      if (!response.text) {
        throw new Error("Gemini returned an empty response");
      }

      return cleanJson(response.text);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown Gemini error";
      errors.push(`${model}: ${message}`);
    }
  }

  throw new Error(`Gemini analysis failed. Tried models: ${errors.join(" | ")}`);
}
