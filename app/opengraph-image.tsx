import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #cfe5f2 0%, #fffaf2 55%, #dfe9ef 100%)",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 86,
            left: 154,
            width: 360,
            height: 86,
            borderRadius: 999,
            background: "rgba(255,255,255,0.72)",
            filter: "blur(8px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 112,
            right: 150,
            width: 430,
            height: 104,
            borderRadius: 999,
            background: "rgba(255,255,255,0.58)",
            filter: "blur(10px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -80,
            bottom: -100,
            width: 1360,
            height: 280,
            borderRadius: "52% 48% 0 0",
            background: "rgba(85,120,143,0.22)",
            transform: "rotate(-4deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -80,
            bottom: -152,
            width: 1360,
            height: 300,
            borderRadius: "54% 46% 0 0",
            background: "rgba(38,49,58,0.22)",
            transform: "rotate(3deg)",
          }}
        />
        <div
          style={{
            width: 960,
            height: 430,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 36,
            background: "rgba(255,255,255,0.64)",
            boxShadow: "0 30px 90px rgba(64,88,105,0.16)",
          }}
        >
          <div style={{ fontSize: 42, fontWeight: 800, color: "#55788f", letterSpacing: 2 }}>INNER SKY</div>
          <div style={{ marginTop: 28, fontSize: 76, fontWeight: 800, color: "#26313a" }}>Fah Khang Nai</div>
          <div style={{ marginTop: 24, fontSize: 34, fontWeight: 700, color: "#50616c" }}>A soft Thai sky reading for your heart</div>
          <div style={{ marginTop: 44, fontSize: 24, fontWeight: 700, color: "rgba(38,49,58,0.55)", letterSpacing: 5 }}>MADE BY knotji</div>
        </div>
      </div>
    ),
    size,
  );
}
