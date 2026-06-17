"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import ImageUploader from "@/components/ImageUploader";
import LoadingSky from "@/components/LoadingSky";
import ResultCard from "@/components/ResultCard";
import ShareStoryCard from "@/components/ShareStoryCard";
import type { MoodTone, SkyResult } from "@/types/result";

type ViewState = "idle" | "loading" | "result";

const demoSkySvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="#b8d7ea"/>
      <stop offset="0.58" stop-color="#f7ece0"/>
      <stop offset="1" stop-color="#d6c2ae"/>
    </linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="18"/></filter>
  </defs>
  <rect width="1200" height="900" fill="url(#sky)"/>
  <g fill="#ffffff" opacity="0.72" filter="url(#blur)">
    <ellipse cx="320" cy="250" rx="170" ry="54"/>
    <ellipse cx="470" cy="250" rx="210" ry="68"/>
    <ellipse cx="760" cy="315" rx="230" ry="72"/>
    <ellipse cx="900" cy="300" rx="150" ry="48"/>
  </g>
  <path d="M0 650 C210 570 350 690 560 615 C770 540 910 610 1200 515 L1200 900 L0 900 Z" fill="#496a70" opacity="0.32"/>
  <path d="M0 735 C260 650 430 770 650 700 C850 636 990 710 1200 640 L1200 900 L0 900 Z" fill="#2f555d" opacity="0.34"/>
</svg>
`;

const demoResult: SkyResult = {
  isSkyOrNature: true,
  skyName: "ฟ้าหลังฝน",
  moodSummary: "ใจที่ยังเหนื่อยอยู่บ้าง แต่เริ่มยอมให้แสงกลับเข้ามา",
  healingMessage:
    "วันนี้คุณอาจไม่ได้สดใสขึ้นทันที\nแต่ก็ไม่ได้มืดเท่าเมื่อวานแล้ว\nบางครั้งการกลับมาสว่าง\nไม่จำเป็นต้องรีบ\nแค่ยังยอมเปิดรับแสงเล็ก ๆ ก็พอ",
  storyText: "ไม่ได้สดใสขึ้นทันที แค่ยังยอมให้แสงกลับเข้ามาอีกครั้ง",
  tinyAction: "วันนี้ลองพักโดยไม่ต้องรู้สึกผิดสัก 10 นาที",
  hashtags: ["#ฟ้าข้างใน", "#ฮีลใจ", "#ท้องฟ้า", "#ก้อนเมฆ", "#ใจดีกับตัวเอง"],
};

export default function HomePage() {
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [tone, setTone] = useState<MoodTone>("อ่อนโยน");
  const [result, setResult] = useState<SkyResult | null>(null);
  const [viewState, setViewState] = useState<ViewState>("idle");
  const [error, setError] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const uploaderRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  const canAnalyze = useMemo(() => Boolean(imageDataUrl) && viewState !== "loading", [imageDataUrl, viewState]);

  useEffect(() => {
    setIsDemoMode(new URLSearchParams(window.location.search).get("demo") === "1");
  }, []);

  async function analyzeSky() {
    if (!imageDataUrl) {
      setError("กรุณาอัปโหลดรูปท้องฟ้าก่อนนะ");
      return;
    }

    setError("");
    setViewState("loading");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageDataUrl, tone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "วิเคราะห์รูปนี้ไม่สำเร็จ");
      }

      setResult(data as SkyResult);
      setViewState("result");
      window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "เกิดข้อผิดพลาด ลองใหม่อีกครั้งนะ");
      setViewState("idle");
    }
  }

  function loadDemoResult() {
    setImageDataUrl(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(demoSkySvg)}`);
    setTone("อ่อนโยน");
    setResult(demoResult);
    setError("");
    setViewState("result");
    window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  }

  function resetFlow() {
    setImageDataUrl("");
    setResult(null);
    setError("");
    setViewState("idle");
    window.setTimeout(() => uploaderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }

  function scrollToStory() {
    storyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-6xl overflow-hidden px-4 pb-14 pt-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-8 top-20 h-24 w-48 rounded-full bg-white/55 blur-2xl" />
      <div className="pointer-events-none absolute right-[-48px] top-64 h-32 w-64 rounded-full bg-skyPale/60 blur-3xl" />

      <Hero onStart={() => uploaderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })} />

      {isDemoMode ? (
        <section className="mx-auto mb-4 max-w-md rounded-[8px] border border-[#d7e6ee] bg-white/70 p-3 text-center shadow-soft backdrop-blur-xl">
          <p className="text-xs font-bold leading-5 text-softGray">Demo mode สำหรับเช็ก layout โดยไม่เรียก Gemini</p>
          <button
            className="mt-2 min-h-10 rounded-[8px] bg-[#55788f] px-4 text-sm font-extrabold text-white"
            onClick={loadDemoResult}
            type="button"
          >
            แสดงผลลัพธ์ตัวอย่าง
          </button>
        </section>
      ) : null}

      <motion.section
        ref={uploaderRef}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="mx-auto mt-5 max-w-md rounded-[8px] border border-white/70 bg-white/70 p-3 shadow-soft backdrop-blur-xl sm:p-4"
      >
        <ImageUploader
          canAnalyze={canAnalyze}
          error={error}
          imageDataUrl={imageDataUrl}
          onAnalyze={analyzeSky}
          onError={setError}
          onImageChange={setImageDataUrl}
          onToneChange={setTone}
          tone={tone}
        />
      </motion.section>

      {viewState === "loading" ? <LoadingSky /> : null}

      <div ref={resultRef}>
        {result && viewState === "result" ? (
          <ResultCard imageDataUrl={imageDataUrl} onCreateStory={scrollToStory} onReset={resetFlow} result={result} />
        ) : null}
      </div>

      <div ref={storyRef}>
        {result && result.isSkyOrNature && viewState === "result" ? <ShareStoryCard imageDataUrl={imageDataUrl} result={result} /> : null}
      </div>

      <footer className="mx-auto mt-10 max-w-md text-center text-xs font-bold tracking-[0.18em] text-softGray/70">
        MADE BY knotji
      </footer>
    </main>
  );
}
