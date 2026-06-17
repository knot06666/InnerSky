import type { SkyResult } from "@/types/result";

const storyFont = '"Noto Sans Thai", "LINE Seed Sans TH", Arial, sans-serif';

export function downloadTextFile(text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "fah-khang-nai-result.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadCanvas(canvas: HTMLCanvasElement) {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "fah-khang-nai-story.png";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function canvasToDataUrl(canvas: HTMLCanvasElement) {
  return canvas.toDataURL("image/png");
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Cannot create story image"));
        return;
      }

      resolve(blob);
    }, "image/png");
  });
}

export async function drawStoryCard(canvas: HTMLCanvasElement, imageDataUrl: string, result: SkyResult) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const image = await loadImage(imageDataUrl);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCoverImage(ctx, image, 0, 0, canvas.width, canvas.height);
  ctx.filter = "blur(34px)";
  drawCoverImage(ctx, image, -100, -100, canvas.width + 200, canvas.height + 200);
  ctx.filter = "none";

  const wash = ctx.createLinearGradient(0, 0, 0, canvas.height);
  wash.addColorStop(0, "rgba(255,250,242,0.58)");
  wash.addColorStop(0.42, "rgba(232,242,247,0.82)");
  wash.addColorStop(1, "rgba(45,63,70,0.58)");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  roundedRect(ctx, 86, 120, 908, 720, 44);
  ctx.save();
  ctx.clip();
  drawCoverImage(ctx, image, 86, 120, 908, 720);
  ctx.restore();

  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  roundedRect(ctx, 86, 875, 908, 560, 44);
  ctx.fill();

  ctx.fillStyle = "#55788f";
  ctx.font = `700 36px ${storyFont}`;
  ctx.fillText("ฟ้าข้างใน", 140, 962);

  ctx.fillStyle = "#26313a";
  ctx.font = `800 66px ${storyFont}`;
  wrapText(ctx, result.skyName, 140, 1068, 800, 76, 2);

  ctx.fillStyle = "#50616c";
  ctx.font = `500 39px ${storyFont}`;
  wrapText(ctx, result.storyText || result.healingMessage, 140, 1232, 800, 58, 3);

  ctx.fillStyle = "#55788f";
  ctx.font = `700 30px ${storyFont}`;
  wrapText(ctx, result.hashtags.slice(0, 3).join(" "), 140, 1382, 800, 42, 2);

  ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
  roundedRect(ctx, 86, 1500, 908, 84, 42);
  ctx.fill();

  ctx.fillStyle = "#26313a";
  ctx.font = `700 29px ${storyFont}`;
  ctx.fillText("วันนี้ท้องฟ้าอาจกำลังพูดกับใจคุณ", 140, 1553);

  ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
  roundedRect(ctx, 86, 1622, 908, 58, 29);
  ctx.fill();

  ctx.fillStyle = "rgba(38, 49, 58, 0.62)";
  ctx.font = `700 25px ${storyFont}`;
  ctx.fillText("MADE BY knotji", 140, 1660);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function drawCoverImage(ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number) {
  const scale = Math.max(width / image.width, height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const dx = x + (width - drawWidth) / 2;
  const dy = y + (height - drawHeight) / 2;
  ctx.drawImage(image, dx, dy, drawWidth, drawHeight);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const lines = String(text).split("\n").flatMap((part) => wrapLine(ctx, part, maxWidth));
  lines.slice(0, maxLines).forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
}

function wrapLine(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}
