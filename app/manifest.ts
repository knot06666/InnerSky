import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ฟ้าข้างใน",
    short_name: "ฟ้าข้างใน",
    description: "อัปโหลดรูปท้องฟ้า แล้วรับคำปลอบใจเบา ๆ จากฟ้าข้างใน",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fffaf2",
    theme_color: "#e8f2f7",
    orientation: "portrait",
    categories: ["lifestyle", "photo", "wellness"],
    lang: "th",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
