export type InAppBrowser = "instagram" | "line" | "facebook" | "tiktok" | "other";

export function detectInAppBrowser(): InAppBrowser | null {
  if (typeof navigator === "undefined") return null;

  const userAgent = navigator.userAgent;
  if (/Instagram/i.test(userAgent)) return "instagram";
  if (/Line/i.test(userAgent)) return "line";
  if (/FBAN|FBAV|FB_IAB|FBIOS|FB4A/i.test(userAgent)) return "facebook";
  if (/TikTok/i.test(userAgent)) return "tiktok";
  if (/wv|WebView/i.test(userAgent)) return "other";

  return null;
}

export function isInstagramInAppBrowser() {
  return detectInAppBrowser() === "instagram";
}

export function isAndroid() {
  return typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
}

export function isStandalone() {
  if (typeof window === "undefined") return false;

  return window.matchMedia?.("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function isIosSafari() {
  if (typeof navigator === "undefined") return false;

  const userAgent = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(userAgent) && /Safari/.test(userAgent) && !/CriOS|FxiOS|Instagram|FBAN|FBAV|Line/i.test(userAgent);
}

export function getInAppBrowserName(browser: InAppBrowser) {
  return {
    instagram: "Instagram",
    line: "LINE",
    facebook: "Facebook",
    tiktok: "TikTok",
    other: "แอปนี้",
  }[browser];
}

export async function copyCurrentUrl() {
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
