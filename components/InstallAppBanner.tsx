"use client";

import { track } from "@vercel/analytics";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandalone() {
  return window.matchMedia?.("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function isIosSafari() {
  const userAgent = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(userAgent) && /Safari/.test(userAgent) && !/CriOS|FxiOS|Instagram|FBAN|FBAV|Line/i.test(userAgent);
}

export default function InstallAppBanner() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (isStandalone() || localStorage.getItem("innersky-install-banner-dismissed") === "1") {
      setHidden(true);
      return;
    }

    setShowIosHint(isIosSafari());
    if (isIosSafari()) {
      track("pwa_ios_hint_shown");
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
      track("pwa_install_prompt_available");
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  if (hidden || (!promptEvent && !showIosHint)) return null;

  async function installApp() {
    if (!promptEvent) return;
    track("pwa_install_clicked");
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice.catch(() => undefined);
    if (choice?.outcome) {
      track("pwa_install_choice", { outcome: choice.outcome });
    }
    setPromptEvent(null);
    localStorage.setItem("innersky-install-banner-dismissed", "1");
    setHidden(true);
  }

  function dismiss() {
    track("pwa_install_dismissed", { ios_hint: showIosHint });
    localStorage.setItem("innersky-install-banner-dismissed", "1");
    setHidden(true);
  }

  return (
    <section className="mx-auto mt-4 max-w-md rounded-[8px] border border-[#d7e6ee] bg-white/78 p-3 shadow-soft backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold leading-6 text-ink">เก็บฟ้าข้างในไว้บนหน้าจอ</p>
          <p className="mt-1 text-xs font-bold leading-5 text-softGray">
            {showIosHint ? "บน iPhone ให้กด Share แล้วเลือก Add to Home Screen" : "ติดตั้งเป็นเว็บแอป เปิดได้เหมือนแอปบนมือถือ"}
          </p>
        </div>
        <button className="rounded-full px-2 text-sm font-extrabold text-softGray" onClick={dismiss} type="button">
          ปิด
        </button>
      </div>

      {promptEvent ? (
        <button className="mt-3 min-h-10 w-full rounded-[8px] bg-[#55788f] px-3 text-sm font-extrabold text-white" onClick={installApp} type="button">
          ติดตั้งเว็บแอป
        </button>
      ) : null}
    </section>
  );
}
