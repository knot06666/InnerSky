"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { canvasToDataUrl, canvasToPngBlob, drawStoryCard } from "@/lib/downloadCard";
import type { SkyResult } from "@/types/result";

type ShareStoryCardProps = {
  imageDataUrl: string;
  result: SkyResult;
};

function isInstagramInAppBrowser() {
  if (typeof navigator === "undefined") return false;
  return /Instagram/i.test(navigator.userAgent);
}

export default function ShareStoryCard({ imageDataUrl, result }: ShareStoryCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [ready, setReady] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSaveViewOpen, setIsSaveViewOpen] = useState(false);
  const [isInstagram, setIsInstagram] = useState(false);

  useEffect(() => {
    setIsInstagram(isInstagramInAppBrowser());
  }, []);

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
    window.setTimeout(() => setFeedback(""), 3600);
  }

  async function downloadStory() {
    if (!canvasRef.current) return;

    if (isInstagram) {
      setIsSaveViewOpen(true);
      showFeedback("Instagram อาจไม่อนุญาตให้ดาวน์โหลดตรง ๆ เปิดการ์ดเต็มจอให้เซฟหรือแคปแทนนะ");
      return;
    }

    try {
      const blob = await canvasToPngBlob(canvasRef.current);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "fah-khang-nai-story.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 15000);
      showFeedback("เริ่มบันทึกการ์ดแล้ว");
    } catch {
      setIsSaveViewOpen(true);
      showFeedback("บันทึกตรงไม่ได้ เปิดการ์ดเต็มจอให้กดค้างหรือแคปแทนนะ");
    }
  }

  function openSaveView() {
    if (!previewUrl) return;
    setIsSaveViewOpen(true);
    showFeedback("เปิดการ์ดเต็มจอแล้ว กดค้างที่ภาพหรือแคปหน้าจอได้เลย");
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
        showFeedback("แชร์ข้อความแล้ว ถ้าจะลง Story ให้เปิดรูปเต็มจอเพื่อเซฟภาพนะ");
        return;
      }

      setIsSaveViewOpen(true);
      showFeedback("เครื่องนี้ยังแชร์ตรงไม่ได้ เปิดการ์ดเต็มจอให้เซฟแทนนะ");
    } catch {
      setIsSaveViewOpen(true);
      showFeedback("แชร์ไม่สำเร็จ เปิดการ์ดเต็มจอให้เซฟหรือแคปแทนนะ");
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
          onClick={openSaveView}
          type="button"
        >
          ดูเต็มจอ
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

      {isInstagram ? (
        <p className="mt-3 rounded-[8px] bg-white/66 px-3 py-2 text-center text-[11px] font-bold leading-5 text-softGray">
          Instagram browser มักบล็อกการดาวน์โหลด ให้ใช้ปุ่มดูเต็มจอแล้วกดค้างที่ภาพ หรือแคปหน้าจอเพื่อลง Story
        </p>
      ) : null}

      <button
        className="mt-3 block w-full overflow-hidden rounded-[8px] bg-skyMist text-left"
        disabled={!previewUrl}
        onClick={openSaveView}
        type="button"
      >
        {previewUrl ? (
          <img alt="พรีวิวการ์ด Story" className="aspect-[9/16] w-full select-auto object-cover" draggable={false} src={previewUrl} />
        ) : (
          <span className="flex aspect-[9/16] w-full items-center justify-center text-sm font-bold text-softGray">กำลังสร้างการ์ด...</span>
        )}
      </button>

      <p className="mt-3 text-center text-[11px] font-bold leading-5 text-softGray">
        ถ้าบันทึกไม่ได้ ให้แตะการ์ดเพื่อดูเต็มจอ แล้วกดค้างที่ภาพหรือแคปหน้าจอ
      </p>

      {isSaveViewOpen && previewUrl ? (
        <div className="fixed inset-0 z-50 grid bg-[#162026]/94 px-4 py-5">
          <div className="mx-auto flex h-full w-full max-w-md flex-col">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-extrabold text-white">กดค้างที่ภาพเพื่อบันทึก หรือแคปหน้าจอ</p>
              <button
                className="min-h-10 rounded-[8px] bg-white/14 px-4 text-sm font-extrabold text-white"
                onClick={() => setIsSaveViewOpen(false)}
                type="button"
              >
                ปิด
              </button>
            </div>
            <div className="min-h-0 flex-1 place-content-center">
              <img
                alt="การ์ด Story ขนาดเต็ม"
                className="mx-auto max-h-full w-auto max-w-full select-auto rounded-[8px] object-contain shadow-[0_20px_70px_rgba(0,0,0,0.32)]"
                src={previewUrl}
              />
            </div>
            <p className="mt-3 text-center text-xs font-bold leading-5 text-white/72">
              ใน Instagram ถ้ากดค้างแล้วไม่มีเมนูบันทึก วิธีที่เสถียรที่สุดคือแคปหน้าจอจากหน้านี้
            </p>
          </div>
        </div>
      ) : null}

      <canvas aria-hidden="true" className="hidden" height={1920} ref={canvasRef} width={1080} />
    </motion.section>
  );
}
