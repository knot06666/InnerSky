import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
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
        <div style={{ position: "absolute", left: -24, bottom: 28, width: 228, height: 66, borderRadius: "54% 46% 0 0", background: "rgba(85,120,143,0.28)", transform: "rotate(-5deg)" }} />
        <div style={{ position: "absolute", left: -24, bottom: 10, width: 230, height: 70, borderRadius: "52% 48% 0 0", background: "rgba(38,49,58,0.22)", transform: "rotate(4deg)" }} />
        <div
          style={{
            width: 104,
            height: 104,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 28,
            background: "rgba(255,255,255,0.72)",
            color: "#55788f",
            fontFamily: "Arial, sans-serif",
            fontSize: 46,
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
