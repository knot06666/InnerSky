import { NextResponse } from "next/server";
import { analyzeSkyImage, fallbackSkyResult, parseImageDataUrl } from "@/lib/gemini";
import { getClientIp, rateLimit } from "@/lib/rateLimit";
import type { AnalyzeSkyRequest, MoodTone } from "@/types/result";

const tones: MoodTone[] = ["อ่อนโยน", "เหงาแต่สวย", "เริ่มใหม่", "ปล่อยวาง", "กอดตัวเอง", "กวน ๆ นิด ๆ แต่ยังฮีลใจ"];

const limitWindowMs = 10 * 60 * 1000;
const maxAnalyzeRequests = 5;

function errorMessageForGemini(error: unknown) {
  const rawMessage = error instanceof Error ? error.message : String(error);
  const message = rawMessage.toLowerCase();

  if (message.includes("api key") || message.includes("permission") || message.includes("unauthorized") || message.includes("forbidden")) {
    return "ตอนนี้ฟ้ายังเชื่อมต่อ AI ไม่สำเร็จ ลองกลับมาใหม่อีกครั้งหลังจากเราตั้งค่าระบบเรียบร้อยนะ";
  }

  if (message.includes("quota") || message.includes("rate") || message.includes("429") || message.includes("resource_exhausted")) {
    return "วันนี้ฟ้ามีคนมาคุยเยอะนิดนึง ลองใหม่อีกครั้งในอีกไม่กี่นาทีนะ";
  }

  if (message.includes("safety") || message.includes("blocked")) {
    return "ฟ้าอ่านภาพนี้ได้ไม่เต็มที่ ลองเลือกรูปท้องฟ้าหรือวิวธรรมชาติอีกภาพนะ";
  }

  return "ฟ้าแปลภาพนี้ไม่สำเร็จ เลยส่งข้อความสำรองที่ยังอ่อนโยนกับใจคุณให้แทนนะ";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<AnalyzeSkyRequest>;

    if (!body.image) {
      return NextResponse.json({ error: "กรุณาอัปโหลดรูปท้องฟ้าก่อนนะ" }, { status: 400 });
    }

    const tone = tones.includes(body.tone as MoodTone) ? (body.tone as MoodTone) : "อ่อนโยน";
    const image = parseImageDataUrl(body.image);
    const clientIp = getClientIp(request);
    const limit = rateLimit(`analyze:${clientIp}`, {
      limit: maxAnalyzeRequests,
      windowMs: limitWindowMs,
    });

    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: "ฟ้าขอพักแป๊บนึงนะ ลองใหม่อีกครั้งในอีกไม่กี่นาที",
          retryAfterSeconds: limit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(limit.retryAfterSeconds),
            "X-RateLimit-Limit": String(maxAnalyzeRequests),
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }

    try {
      const result = await analyzeSkyImage(image, tone);
      return NextResponse.json(result, {
        headers: {
          "X-RateLimit-Limit": String(maxAnalyzeRequests),
          "X-RateLimit-Remaining": String(limit.remaining),
        },
      });
    } catch (error) {
      console.error("[analyze] Gemini failed", error);
      return NextResponse.json({
        ...fallbackSkyResult(tone),
        fallbackMessage: errorMessageForGemini(error),
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "วิเคราะห์รูปนี้ไม่สำเร็จ";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
