"use client";

import { motion } from "framer-motion";
import { track } from "@vercel/analytics";
import { useState } from "react";
import { downloadTextFile } from "@/lib/downloadCard";
import type { SkyResult } from "@/types/result";

type ResultCardProps = {
  imageDataUrl: string;
  result: SkyResult;
  onCreateStory: () => void;
  onReset: () => void;
};

export default function ResultCard({ imageDataUrl, result, onCreateStory, onReset }: ResultCardProps) {
  const [feedback, setFeedback] = useState("");
  const [manualCopyText, setManualCopyText] = useState("");

  function showFeedback(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 2200);
  }

  if (!result.isSkyOrNature) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="mx-auto mt-6 max-w-md overflow-hidden rounded-[8px] border border-white/70 bg-white/78 shadow-soft backdrop-blur-xl"
      >
        <div className="relative h-64 overflow-hidden bg-skyMist">
          <img alt="รูปที่อัปโหลด" className="h-full w-full object-cover opacity-75" src={imageDataUrl} />
          <div className="absolute inset-0 bg-gradient-to-t from-white/85 to-white/15" />
        </div>

        <div className="p-5 sm:p-7">
          <p className="w-fit rounded-full bg-skyMist px-3 py-1 text-xs font-extrabold text-[#55788f]">ฟ้าข้างในยังอ่านภาพนี้ไม่ได้</p>
          <h2 className="mt-4 text-2xl font-extrabold leading-tight text-ink">ลองเลือกรูปฟ้าอีกใบดูนะ</h2>
          <p className="mt-4 text-[16px] leading-8 text-ink/80">
            {result.nonSkyMessage ||
              "ภาพนี้อาจไม่ใช่ท้องฟ้า ก้อนเมฆ แสงธรรมชาติ หรือวิวธรรมชาติที่ฟ้าข้างในอ่านได้ ลองอัปโหลดรูปฟ้า เมฆ แสงเย็น ๆ หรือวิวธรรมชาติอีกครั้งนะ"}
          </p>
          <button className="mt-5 min-h-11 w-full rounded-[8px] bg-[#55788f] px-3 text-sm font-extrabold text-white" onClick={resetResult} type="button">
            อัปโหลดรูปใหม่
          </button>
        </div>
      </motion.section>
    );
  }

  const text = `${result.skyName}\n\n${result.moodSummary}\n\n${result.healingMessage}\n\n${result.tinyAction}\n\n${result.hashtags.join(" ")}`;

  async function copyText() {
    track("result_copy_clicked");
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard is not available");
      }

      await navigator.clipboard.writeText(text);
      setManualCopyText("");
      showFeedback("คัดลอกข้อความแล้ว");
      track("result_copy_success", { method: "clipboard" });
    } catch {
      setManualCopyText(text);
      showFeedback("คัดลอกอัตโนมัติไม่ได้ กดค้างที่ข้อความด้านล่างเพื่อคัดลอกนะ");
      track("result_copy_fallback");
    }
  }

  function saveText() {
    track("result_save_clicked");
    downloadTextFile(text);
    showFeedback("บันทึกผลลัพธ์แล้ว");
  }

  function createStory() {
    track("story_create_clicked");
    onCreateStory();
  }

  function resetResult() {
    track("result_reset_clicked");
    onReset();
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="mx-auto mt-6 max-w-md overflow-hidden rounded-[8px] border border-white/70 bg-white/78 shadow-soft backdrop-blur-xl lg:max-w-3xl"
    >
      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative h-72 overflow-hidden bg-skyMist lg:h-auto">
          <img alt="รูปท้องฟ้าที่ใช้วิเคราะห์" className="h-full w-full object-cover" src={imageDataUrl} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/20 to-transparent" />
        </div>

        <div className="p-5 sm:p-7">
          <p className="w-fit rounded-full bg-skyMist px-3 py-1 text-xs font-extrabold text-[#55788f]">ผลลัพธ์จากฟ้าข้างใน</p>
          {result.fallback ? (
            <p className="mt-3 text-xs leading-5 text-softGray">
              {result.fallbackMessage || "ตอนนี้ AI ตอบไม่ได้เต็มที่ เลยใช้ข้อความสำรองที่ยังอ่อนโยนกับใจคุณอยู่"}
            </p>
          ) : null}

          <h2 className="mt-4 text-[28px] font-extrabold leading-tight text-ink sm:text-3xl">{result.skyName}</h2>
          <p className="mt-3 text-[15px] font-bold leading-7 text-[#55788f] sm:text-base">{result.moodSummary}</p>
          <p className="story-card-text mt-5 text-[16px] leading-8 text-ink/86 sm:text-[17px]">{result.healingMessage}</p>

          <div className="mt-5 rounded-[8px] border border-[#d7e6ee] bg-[#f6fbfd] p-4">
            <p className="text-xs font-extrabold text-softGray">สิ่งเล็ก ๆ สำหรับวันนี้</p>
            <p className="mt-2 text-sm font-bold leading-6 text-ink">{result.tinyAction}</p>
          </div>

          <p className="mt-4 text-sm font-bold leading-7 text-softGray">{result.hashtags.join(" ")}</p>

          {feedback ? (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-[8px] bg-skyMist px-3 py-2 text-center text-sm font-extrabold text-[#55788f]"
              role="status"
            >
              {feedback}
            </motion.p>
          ) : null}

          {manualCopyText ? (
            <textarea
              className="mt-3 h-28 w-full resize-none rounded-[8px] border border-[#d7e6ee] bg-white/80 p-3 text-sm font-bold leading-6 text-ink outline-none"
              readOnly
              value={manualCopyText}
              onFocus={(event) => event.currentTarget.select()}
            />
          ) : null}

          <div className="mt-5 grid gap-2">
            <button
              className="min-h-12 rounded-[8px] bg-[#d7a96f] px-4 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(215,169,111,0.24)]"
              onClick={createStory}
              type="button"
            >
              สร้างการ์ดลง Story
            </button>

            <div className="grid grid-cols-3 gap-2">
              <button className="min-h-10 rounded-[8px] bg-white px-2 text-xs font-extrabold text-[#55788f] sm:text-sm" onClick={saveText} type="button">
                บันทึกผล
              </button>
              <button className="min-h-10 rounded-[8px] bg-white px-2 text-xs font-extrabold text-[#55788f] sm:text-sm" onClick={copyText} type="button">
                คัดลอก
              </button>
              <button className="min-h-10 rounded-[8px] bg-white px-2 text-xs font-extrabold text-[#55788f] sm:text-sm" onClick={resetResult} type="button">
                ลองใหม่
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
