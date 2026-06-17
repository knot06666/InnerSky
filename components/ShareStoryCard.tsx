"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { canvasToDataUrl, canvasToPngBlob, drawStoryCard, downloadCanvas } from "@/lib/downloadCard";
import type { SkyResult } from "@/types/result";

type ShareStoryCardProps = {
  imageDataUrl: string;
  result: SkyResult;
};

export default function ShareStoryCard({ imageDataUrl, result }: ShareStoryCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [ready, setReady] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let mounted = true;

    async function draw() {
      if (!canvasRef.current) return;

      setReady(false);
      setPreviewUrl("");
      await drawStoryCard(canvasRef.current, imageDataUrl, result);

      if (mounted) {
        setPreviewUrl(canvasToDataUrl(canvasRef.current));
        setReady(true);
      }
    }

    void draw();

    return () => {
      mounted = false;
    };
  }, [imageDataUrl, result]);

  function showFeedback(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 2800);
  }

  function downloadStory() {
    if (!canvasRef.current) return;

    try {
      downloadCanvas(canvasRef.current);
      showFeedback("เริ่มบันทึกการ์ดแล้ว");
    } catch {
      showFeedback("ถ้าบันทึกไม่ได้ ให้กดเปิดรูปหรือกดค้างที่การ์ดเพื่อเซฟนะ");
    }
  }

  function openStoryImage() {
    if (!canvasRef.current) return;

    const url = previewUrl || canvasToDataUrl(canvasRef.current);
    const opened = window.open(url, "_blank", "noopener,noreferrer");

    if (opened) {
      showFeedback("เปิดรูปแล้ว กดค้างที่ภาพเพื่อบันทึกได้เลย");
    } else {
      showFeedback("เปิดรูปไม่ได้ ลองกดค้างที่การ์ดด้านล่างเพื่อบันทึกแทนนะ");
    }
  }

  async function shareStory() {
    if (!canvasRef.current) return;

    try {
      const blob = await canvasToPngBlob(canvasRef.current);
      const file = new File([blob], "fah-khang-nai-story.png", { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "ฟ้าข้างใน",
          text: result.storyText || result.skyName,
          files: [file],
        });
        showFeedback("เปิดหน้าต่างแชร์แล้ว");
        return;
      }

      if (navigator.share) {
        await navigator.share({
          title: "ฟ้าข้างใน",
          text: result.storyText || result.skyName,
        });
        showFeedback("แชร์ข้อความแล้ว ถ้าจะลง Story ให้บันทึกรูปเพิ่มนะ");
        return;
      }

      showFeedback("เครื่องนี้ยังแชร์ตรงไม่ได้ ลองบันทึกหรือเปิดรูปแทนนะ");
    } catch {
      showFeedback("แชร์ไม่สำเร็จ ลองบันทึกหรือเปิดรูปแทนนะ");
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="mx-auto mt-6 max-w-md rounded-[8px] border border-white/70 bg-white/72 p-4 shadow-soft backdrop-blur-xl"
    >
      <div className="mb-3">
        <p className="text-sm font-black text-ink">การ์ดลง Story</p>
        <p className="mt-1 text-xs leading-5 text-softGray">ขนาด 1080 x 1920 พร้อมพื้นหลังนุ่มและข้อความสำหรับแชร์</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          className="min-h-10 rounded-[8px] bg-[#55788f] px-3 text-sm font-extrabold text-white disabled:opacity-45"
          disabled={!ready}
          onClick={shareStory}
          type="button"
        >
          แชร์
        </button>
        <button
          className="min-h-10 rounded-[8px] bg-white px-3 text-sm font-extrabold text-[#55788f] disabled:opacity-45"
          disabled={!ready}
          onClick={downloadStory}
          type="button"
        >
          บันทึก
        </button>
        <button
          className="min-h-10 rounded-[8px] bg-white px-3 text-sm font-extrabold text-[#55788f] disabled:opacity-45"
          disabled={!ready}
          onClick={openStoryImage}
          type="button"
        >
          เปิดรูป
        </button>
      </div>

      {feedback ? (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-[8px] bg-skyMist px-3 py-2 text-center text-sm font-extrabold text-[#55788f]"
          role="status"
        >
          {feedback}
        </motion.p>
      ) : null}

      <div className="mt-3 overflow-hidden rounded-[8px] bg-skyMist">
        {previewUrl ? (
          <img alt="พรีวิวการ์ด Story" className="aspect-[9/16] w-full select-auto object-cover" draggable={false} src={previewUrl} />
        ) : (
          <div className="flex aspect-[9/16] w-full items-center justify-center text-sm font-bold text-softGray">กำลังสร้างการ์ด...</div>
        )}
      </div>

      <p className="mt-3 text-center text-[11px] font-bold leading-5 text-softGray">
        ถ้าเปิดผ่าน LINE, Instagram หรือ Facebook แล้วบันทึกไม่ได้ ให้กดเปิดรูปหรือกดค้างที่การ์ดเพื่อเซฟ
      </p>

      <canvas aria-hidden="true" className="hidden" height={1920} ref={canvasRef} width={1080} />
    </motion.section>
  );
}
