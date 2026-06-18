import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #cfe5f2 0%, #fffaf2 58%, #dfe9ef 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 102, left: 72, width: 260, height: 70, borderRadius: 999, background: "rgba(255,255,255,0.72)", filter: "blur(8px)" }} />
        <div style={{ position: "absolute", top: 144, right: 52, width: 220, height: 60, borderRadius: 999, background: "rgba(255,255,255,0.56)", filter: "blur(9px)" }} />
        <div style={{ position: "absolute", left: -60, bottom: 82, width: 640, height: 160, borderRadius: "54% 46% 0 0", background: "rgba(85,120,143,0.26)", transform: "rotate(-5deg)" }} />
        <div style={{ position: "absolute", left: -70, bottom: 44, width: 650, height: 170, borderRadius: "52% 48% 0 0", background: "rgba(38,49,58,0.22)", transform: "rotate(4deg)" }} />
        <div
          style={{
            width: 292,
            height: 292,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 72,
            background: "rgba(255,255,255,0.72)",
            boxShadow: "0 28px 80px rgba(64,88,105,0.2)",
            color: "#55788f",
            fontFamily: "Arial, sans-serif",
            fontSize: 116,
            fontWeight: 800,
          }}
        >
          ฟ
        </div>
      </div>
    ),
    size,
  );
}
