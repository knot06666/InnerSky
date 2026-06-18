import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const promptRegular = readFile(join(process.cwd(), "app/opengraph-fonts/Prompt-Regular.ttf"));
const promptBold = readFile(join(process.cwd(), "app/opengraph-fonts/Prompt-Bold.ttf"));

export default async function Image() {
  const [promptRegularData, promptBoldData] = await Promise.all([promptRegular, promptBold]);

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
          fontFamily: "Prompt",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 82,
            left: 150,
            width: 360,
            height: 88,
            borderRadius: 999,
            background: "rgba(255,255,255,0.74)",
            filter: "blur(8px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 118,
            right: 142,
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
            background: "rgba(255,255,255,0.66)",
            boxShadow: "0 30px 90px rgba(64,88,105,0.16)",
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 800, color: "#55788f" }}>ฟ้าข้างใน</div>
          <div style={{ marginTop: 22, fontSize: 70, fontWeight: 800, color: "#26313a" }}>วันนี้ท้องฟ้าที่คุณถ่าย</div>
          <div style={{ marginTop: 12, fontSize: 48, fontWeight: 800, color: "#55788f" }}>อาจกำลังบอกอะไรบางอย่างกับใจคุณ</div>
          <div style={{ marginTop: 34, fontSize: 28, fontWeight: 600, color: "#50616c" }}>
            อัปโหลดรูปท้องฟ้า แล้วรับคำปลอบใจเบา ๆ
          </div>
          <div style={{ marginTop: 38, fontSize: 22, fontWeight: 700, color: "rgba(38,49,58,0.55)", letterSpacing: 4 }}>
            MADE BY knotji
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Prompt",
          data: promptRegularData,
          style: "normal",
          weight: 400,
        },
        {
          name: "Prompt",
          data: promptBoldData,
          style: "normal",
          weight: 800,
        },
      ],
    },
  );
}
