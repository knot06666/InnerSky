import { NextResponse } from "next/server";
import { analyzeSkyImage, fallbackSkyResult, parseImageDataUrl } from "@/lib/gemini";
import type { AnalyzeSkyRequest, MoodTone } from "@/types/result";

const tones: MoodTone[] = ["อ่อนโยน", "เหงาแต่สวย", "เริ่มใหม่", "ปล่อยวาง", "กอดตัวเอง", "กวน ๆ นิด ๆ แต่ยังฮีลใจ"];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<AnalyzeSkyRequest>;

    if (!body.image) {
      return NextResponse.json({ error: "กรุณาอัปโหลดรูปท้องฟ้าก่อนนะ" }, { status: 400 });
    }

    const tone = tones.includes(body.tone as MoodTone) ? (body.tone as MoodTone) : "อ่อนโยน";
    const image = parseImageDataUrl(body.image);

    try {
      const result = await analyzeSkyImage(image, tone);
      return NextResponse.json(result);
    } catch {
      return NextResponse.json(fallbackSkyResult(tone));
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "วิเคราะห์รูปนี้ไม่สำเร็จ";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
