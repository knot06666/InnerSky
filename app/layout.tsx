import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-thai",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://innersky.vercel.app";
const title = "ฟ้าข้างใน";
const description = "อัปโหลดรูปท้องฟ้า ก้อนเมฆ หรือวิวธรรมชาติ แล้วให้ฟ้าข้างในช่วยแปลเป็นคำปลอบใจเบา ๆ สำหรับวันนี้";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: title,
  authors: [{ name: "knotji" }],
  creator: "knotji",
  keywords: ["ฟ้าข้างใน", "ฮีลใจ", "ท้องฟ้า", "ก้อนเมฆ", "AI", "Gemini"],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: title,
    locale: "th_TH",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "ฟ้าข้างใน เว็บฮีลใจจากรูปท้องฟ้า",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e8f2f7",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={notoSansThai.variable}>
      <body>{children}</body>
    </html>
  );
}
