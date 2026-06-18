"use client";

import { motion } from "framer-motion";
import { track } from "@vercel/analytics";
import { useEffect, useRef, useState } from "react";
import { detectInAppBrowser, isInstagramInAppBrowser, type InAppBrowser } from "@/lib/browser";
import { analyticsEvents } from "@/lib/analyticsEvents";
import { canvasToDataUrl, canvasToPngBlob, createDownloadFileName, drawStoryCard } from "@/lib/downloadCard";
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
  const [isInstagram, setIsInstagram] = useState(false);
  const [inAppBrowser, setInAppBrowser] = useState<InAppBrowser | null>(null);
  const [showFullscreen, setShowFullscreen] = useState(false);

  useEffect(() => {
    setIsInstagram(isInstagramInAppBrowser());
    setInAppBrowser(detectInAppBrowser());
  }, []);

  useEffect(() => {
    if (showFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showFullscreen]);

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
        track(analyticsEvents.storyCardRendered, { instagram: isInstagramInAppBrowser() });
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
    track(analyticsEvents.storyCaptureOpened, { instagram: isInstagram, mode: "fullscreen" });
    setShowFullscreen(true);
  }

  async function downloadStory() {
    if (!canvasRef.current) return;
    track(analyticsEvents.storyDownloadClicked, { instagram: isInstagram });

    try {
      const blob = await canvasToPngBlob(canvasRef.current);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = createDownloadFileName("story", "png");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 15000);
      showFeedback("เริ่มบันทึกการ์ดแล้ว");
      track(analyticsEvents.storyDownloadStarted);
    } catch {
      openCaptureMode();
      showFeedback("บันทึกตรงไม่ได้ แคปจากพรีวิวการ์ดแทนนะ");
      track(analyticsEvents.storyDownloadFallback);
    }
  }

  async function shareStory() {
    if (!canvasRef.current) return;
    track(analyticsEvents.storyShareClicked, { instagram: isInstagram });

    try {
      const blob = await canvasToPngBlob(canvasRef.current);
      const file = new File([blob], createDownloadFileName("story", "png"), { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "ฟ้าข้างใน",
          text: result.storyText || result.skyName,
          files: [file],
        });
        showFeedback("เปิดหน้าต่างแชร์แล้ว");
        track(analyticsEvents.storyShareSuccess, { mode: "file" });
        return;
      }

      if (navigator.share) {
        await navigator.share({
          title: "ฟ้าข้างใน",
          text: result.storyText || result.skyName,
        });
        showFeedback(isInstagram ? "ถ้าจะลง Story ให้ใช้แคป Story แทนนะ" : "แชร์ข้อความแล้ว ถ้าจะลง Story ให้บันทึกรูปเพิ่มนะ");
        track(analyticsEvents.storyShareSuccess, { mode: "text" });
        return;
      }

      openCaptureMode();
      showFeedback("เครื่องนี้ยังแชร์ตรงไม่ได้ แคปจากพรีวิวการ์ดแทนนะ");
      track(analyticsEvents.storyShareFallback, { reason: "unsupported" });
    } catch {
      openCaptureMode();
      showFeedback("แชร์ไม่สำเร็จ แคปจากพรีวิวการ์ดแทนนะ");
      track(analyticsEvents.storyShareError);
    }
  }

  return (
    <>
      {showFullscreen && previewUrl ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/96">
          <div className="flex flex-shrink-0 items-center justify-between px-4 pb-2 pt-4">
            <p className="text-sm font-bold text-white/80">
              {isInstagram ? "แคปหน้าจอจากรูปนี้ได้เลย" : "กดค้างที่รูปเพื่อบันทึก"}
            </p>
            <button
              className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-extrabold text-white"
              onClick={() => setShowFullscreen(false)}
              type="button"
            >
              ปิด
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center overflow-hidden px-4 pb-4">
            <img
              alt="การ์ด Story เพื่อบันทึก"
              className="max-h-full w-auto rounded-lg object-contain shadow-xl"
              draggable={false}
              src={previewUrl}
            />
          </div>
        </div>
      ) : null}

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto mt-6 max-w-md rounded-[8px] border border-white/70 bg-white/72 p-4 shadow-soft backdrop-blur-xl"
      >
        <div className="mb-3">
          <p className="text-sm font-black text-ink">การ์ดลง Story</p>
          <p className="mt-1 text-xs leading-5 text-softGray">
            {isInstagram
              ? "Instagram ไม่อนุญาตให้เว็บบันทึกรูปตรง ๆ แคปจากพรีวิวการ์ดจะเสถียรที่สุด"
              : inAppBrowser
                ? "เปิดอยู่ใน In-app browser กดปุ่ม ดูการ์ด แล้วกดค้างที่รูปเพื่อบันทึก"
                : "ขนาด 1080 x 1920 พร้อมพื้นหลังนุ่มและข้อความสำหรับแชร์"}
          </p>
        </div>

        <div className={inAppBrowser ? "grid grid-cols-2 gap-2" : "grid grid-cols-3 gap-2"}>
          <button
            className="min-h-10 rounded-[8px] bg-[#55788f] px-3 text-sm font-extrabold text-white disabled:opacity-45"
            disabled={!ready}
            onClick={shareStory}
            type="button"
          >
            แชร์
          </button>

          {inAppBrowser ? (
            <button
              className="min-h-10 rounded-[8px] bg-[#d7a96f] px-3 text-sm font-extrabold text-white disabled:opacity-45"
              disabled={!ready}
              onClick={openCaptureMode}
              type="button"
            >
              {isInstagram ? "แคป Story" : "ดูการ์ด"}
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
                ดูการ์ด
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
          {isInstagram
            ? "แตะ แคป Story แล้วถ่ายหน้าจอจากพรีวิวการ์ดนี้ จะได้รูปพร้อมลง Story ทันที"
            : inAppBrowser
              ? "แตะ ดูการ์ด แล้วกดค้างที่รูปเพื่อบันทึกลงคลังรูปได้เลย"
              : "ถ้าบันทึกไม่ได้ ให้แตะการ์ดเพื่อดูพรีวิว แล้วแคปหน้าจอแทนได้"}
        </p>

        <canvas aria-hidden="true" className="hidden" height={1920} ref={canvasRef} width={1080} />
      </motion.section>
    </>
  );
}
