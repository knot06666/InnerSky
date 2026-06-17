"use client";

import { useEffect, useState } from "react";

type InAppBrowser = "instagram" | "line" | "facebook" | "tiktok" | "other";

function detectInAppBrowser(): InAppBrowser | null {
  if (typeof navigator === "undefined") return null;

  const userAgent = navigator.userAgent;
  if (/Instagram/i.test(userAgent)) return "instagram";
  if (/Line/i.test(userAgent)) return "line";
  if (/FBAN|FBAV|FB_IAB|FBIOS|FB4A/i.test(userAgent)) return "facebook";
  if (/TikTok/i.test(userAgent)) return "tiktok";
  if (/wv|WebView/i.test(userAgent)) return "other";

  return null;
}

function isAndroid() {
  return typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
}

function getBrowserName(browser: InAppBrowser) {
  return {
    instagram: "Instagram",
    line: "LINE",
    facebook: "Facebook",
    tiktok: "TikTok",
    other: "แอปนี้",
  }[browser];
}

async function copyCurrentUrl() {
  const url = window.location.href;

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return;
  }

  const input = document.createElement("input");
  input.value = url;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  input.remove();
}

export default function OpenInBrowserBanner() {
  const [browser, setBrowser] = useState<InAppBrowser | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setBrowser(detectInAppBrowser());
  }, []);

  if (!browser) return null;

  const browserName = getBrowserName(browser);

  function openExternalBrowser() {
    const currentUrl = window.location.href;

    if (isAndroid() && window.location.protocol === "https:") {
      const url = new URL(currentUrl);
      window.location.href = `intent://${url.host}${url.pathname}${url.search}#Intent;scheme=https;package=com.android.chrome;end`;
      return;
    }

    setFeedback("ถ้าเปิดไม่ออก ให้แตะเมนูมุมขวาบน แล้วเลือก Open in browser หรือเปิดใน Safari/Chrome");
  }

  async function copyLink() {
    try {
      await copyCurrentUrl();
      setFeedback("คัดลอกลิงก์แล้ว นำไปเปิดใน Safari หรือ Chrome ได้เลย");
    } catch {
      setFeedback("คัดลอกอัตโนมัติไม่ได้ ลองกดแชร์ลิงก์จากเมนูของแอปแทนนะ");
    }
  }

  return (
    <section className="mx-auto mt-4 max-w-md rounded-[8px] border border-[#d7e6ee] bg-white/76 p-3 shadow-soft backdrop-blur-xl">
      <p className="text-sm font-extrabold leading-6 text-ink">ตอนนี้เปิดอยู่ใน {browserName} browser</p>
      <p className="mt-1 text-xs font-bold leading-5 text-softGray">
        ถ้าอัปโหลดรูป บันทึกการ์ด หรือแชร์ไม่ลื่น เปิดใน Safari/Chrome จะเสถียรกว่า
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          className="min-h-10 rounded-[8px] bg-[#55788f] px-3 text-sm font-extrabold text-white"
          onClick={openExternalBrowser}
          type="button"
        >
          เปิดใน Browser
        </button>
        <button className="min-h-10 rounded-[8px] bg-white px-3 text-sm font-extrabold text-[#55788f]" onClick={copyLink} type="button">
          คัดลอกลิงก์
        </button>
      </div>

      {feedback ? <p className="mt-2 text-center text-xs font-bold leading-5 text-[#55788f]">{feedback}</p> : null}
    </section>
  );
}
