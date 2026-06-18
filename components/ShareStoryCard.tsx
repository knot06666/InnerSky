"use client";

import { motion } from "framer-motion";
import { track } from "@vercel/analytics";
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
  const [isCaptureModeOpen, setIsCaptureModeOpen] = useState(false);
  const [isInstagram, setIsInstagram] = useState(false);

  useEffect(() => {
    setIsInstagram(isInstagramInAppBrowser());
  }, []);

  useEffect(() => {
    if (!isCaptureModeOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isCaptureModeOpen]);

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
        track("story_card_rendered", { instagram: isInstagramInAppBrowser() });
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

  function openCaptureMode() {
    if (!previewUrl) return;
    track("story_capture_opened", { instagram: isInstagram });
    setIsCaptureModeOpen(true);
    showFeedback(isInstagram ? "เปิดโหมดแคปแล้ว แคปหน้าจอนี้เพื่อนำไปลง Story ได้เลย" : "เปิดการ์ดเต็มจอแล้ว");
  }

  async function downloadStory() {
    if (!canvasRef.current) return;
    track("story_download_clicked", { instagram: isInstagram });

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
      track("story_download_started");
    } catch {
      openCaptureMode();
      showFeedback("บันทึกตรงไม่ได้ เปิดการ์ดเต็มจอให้แคปแทนนะ");
      track("story_download_fallback");
    }
  }

  async function shareStory() {
    if (!canvasRef.current) return;
    track("story_share_clicked", { instagram: isInstagram });

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
        track("story_share_success", { mode: "file" });
        return;
      }

      if (navigator.share) {
        await navigator.share({
          title: "ฟ้าข้างใน",
          text: result.storyText || result.skyName,
        });
        showFeedback(isInstagram ? "ถ้าจะลง Story ให้ใช้แคป Story แทนนะ" : "แชร์ข้อความแล้ว ถ้าจะลง Story ให้บันทึกรูปเพิ่มนะ");
        track("story_share_success", { mode: "text" });
        return;
      }

      openCaptureMode();
      showFeedback("เครื่องนี้ยังแชร์ตรงไม่ได้ เปิดโหมดแคปให้แทนนะ");
      track("story_share_fallback", { reason: "unsupported" });
    } catch {
      openCaptureMode();
      showFeedback("แชร์ไม่สำเร็จ เปิดโหมดแคปให้แทนนะ");
      track("story_share_error");
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
        <p className="mt-1 text-xs leading-5 text-softGray">
          {isInstagram ? "Instagram ไม่อนุญาตให้เว็บบันทึกรูปตรง ๆ ใช้โหมดแคป Story จะเสถียรที่สุด" : "ขนาด 1080 x 1920 พร้อมพื้นหลังนุ่มและข้อความสำหรับแชร์"}
        </p>
      </div>

      <div className={isInstagram ? "grid grid-cols-2 gap-2" : "grid grid-cols-3 gap-2"}>
        <button
          className="min-h-10 rounded-[8px] bg-[#55788f] px-3 text-sm font-extrabold text-white disabled:opacity-45"
          disabled={!ready}
          onClick={shareStory}
          type="button"
        >
          แชร์
        </button>

        {isInstagram ? (
          <button
            className="min-h-10 rounded-[8px] bg-[#d7a96f] px-3 text-sm font-extrabold text-white disabled:opacity-45"
            disabled={!ready}
            onClick={openCaptureMode}
            type="button"
          >
            แคป Story
          </button>
        ) : (
          <>
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
              onClick={openCaptureMode}
              type="button"
            >
              ดูเต็มจอ
            </button>
          </>
        )}
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

      <button
        className="mt-3 block w-full overflow-hidden rounded-[8px] bg-skyMist text-left"
        disabled={!previewUrl}
        onClick={openCaptureMode}
        type="button"
      >
        {previewUrl ? (
          <img alt="พรีวิวการ์ด Story" className="aspect-[9/16] w-full object-cover" draggable={false} src={previewUrl} />
        ) : (
          <span className="flex aspect-[9/16] w-full items-center justify-center text-sm font-bold text-softGray">กำลังสร้างการ์ด...</span>
        )}
      </button>

      <p className="mt-3 text-center text-[11px] font-bold leading-5 text-softGray">
        {isInstagram ? "แตะ แคป Story แล้วถ่ายหน้าจอจากโหมดเต็มจอ จะได้รูปพร้อมลง Story ทันที" : "ถ้าบันทึกไม่ได้ ให้แตะการ์ดเพื่อดูเต็มจอ แล้วแคปหน้าจอแทนได้"}
      </p>

      {isCaptureModeOpen && previewUrl ? (
        <div className={isInstagram ? "fixed inset-0 z-50 bg-black" : "fixed inset-0 z-50 grid bg-[#162026]/94 px-4 py-5"}>
          {isInstagram ? (
            <>
              <img alt="การ์ด Story สำหรับแคปหน้าจอ" className="h-[100dvh] w-screen object-contain" src={previewUrl} />
              <button
                className="absolute right-3 top-[max(12px,env(safe-area-inset-top))] rounded-full bg-black/62 px-4 py-2 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(0,0,0,0.24)] backdrop-blur-md"
                onClick={() => {
                  track("story_capture_closed", { instagram: true });
                  setIsCaptureModeOpen(false);
                }}
                type="button"
              >
                ปิด
              </button>
              <p className="pointer-events-none absolute inset-x-4 bottom-[max(12px,env(safe-area-inset-bottom))] rounded-full bg-black/46 px-3 py-2 text-center text-[11px] font-bold leading-5 text-white/82 backdrop-blur-md">
                แคปหน้าจอนี้ แล้วกดปิดเพื่อกลับไปที่เว็บ
              </p>
            </>
          ) : (
            <div className="mx-auto flex h-full w-full max-w-md flex-col">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-extrabold text-white">แคปหน้าจอหรือกดบันทึกจาก browser ได้เลย</p>
                <button
                  className="min-h-10 rounded-[8px] bg-white/14 px-4 text-sm font-extrabold text-white"
                  onClick={() => {
                    track("story_capture_closed", { instagram: false });
                    setIsCaptureModeOpen(false);
                  }}
                  type="button"
                >
                  ปิด
                </button>
              </div>
              <div className="min-h-0 flex-1 place-content-center">
                <img
                  alt="การ์ด Story ขนาดเต็ม"
                  className="mx-auto max-h-full w-auto max-w-full rounded-[8px] object-contain shadow-[0_20px_70px_rgba(0,0,0,0.32)]"
                  src={previewUrl}
                />
              </div>
            </div>
          )}
        </div>
      ) : null}

      <canvas aria-hidden="true" className="hidden" height={1920} ref={canvasRef} width={1080} />
    </motion.section>
  );
}
