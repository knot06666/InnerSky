"use client";

import { track } from "@vercel/analytics";
import { useEffect, useState } from "react";
import { analyticsEvents } from "@/lib/analyticsEvents";
import { copyCurrentUrl, detectInAppBrowser, getInAppBrowserName, isAndroid, type InAppBrowser } from "@/lib/browser";

export default function OpenInBrowserBanner() {
  const [browser, setBrowser] = useState<InAppBrowser | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const detectedBrowser = detectInAppBrowser();
    setBrowser(detectedBrowser);
    if (detectedBrowser) {
      track(analyticsEvents.inAppBrowserDetected, { browser: detectedBrowser });
    }
  }, []);

  if (!browser) return null;

  const browserName = getInAppBrowserName(browser);

  function openExternalBrowser() {
    track(analyticsEvents.openExternalBrowserClicked, { browser });
    const currentUrl = window.location.href;

    if (isAndroid() && window.location.protocol === "https:") {
      const url = new URL(currentUrl);
      window.location.href = `intent://${url.host}${url.pathname}${url.search}#Intent;scheme=https;package=com.android.chrome;end`;
      return;
    }

    setFeedback("ถ้าเปิดไม่ออก ให้แตะเมนูมุมขวาบน แล้วเลือก Open in browser หรือเปิดใน Safari/Chrome");
  }

  async function copyLink() {
    track(analyticsEvents.inAppCopyLinkClicked, { browser });
    try {
      await copyCurrentUrl();
      setFeedback("คัดลอกลิงก์แล้ว นำไปเปิดใน Safari หรือ Chrome ได้เลย");
      track(analyticsEvents.inAppCopyLinkSuccess, { browser });
    } catch {
      setFeedback("คัดลอกอัตโนมัติไม่ได้ ลองกดแชร์ลิงก์จากเมนูของแอปแทนนะ");
      track(analyticsEvents.inAppCopyLinkError, { browser });
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
