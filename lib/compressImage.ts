const maxOutputBase64Length = 8_500_000;
const maxOriginalFileSize = 14 * 1024 * 1024;
const maxDimension = 1800;
const jpegQuality = 0.84;

export async function compressImageForAnalysis(file: File): Promise<string> {
  if (file.size > maxOriginalFileSize) {
    throw new Error("รูปนี้ใหญ่เกินไป ลองเลือกรูปที่เล็กกว่า 14MB นะ");
  }

  const sourceDataUrl = await readFile(file);
  const image = await loadImage(sourceDataUrl);
  const { width, height } = getResizedSize(image.width, image.height);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("บีบอัดรูปไม่สำเร็จ ลองเลือกรูปใหม่อีกครั้งนะ");
  }

  ctx.fillStyle = "#f7fbfd";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  const compressedDataUrl = canvas.toDataURL("image/jpeg", jpegQuality);

  if (compressedDataUrl.length > maxOutputBase64Length) {
    const smaller = await recompress(image, 1400, 0.78);
    if (smaller.length <= maxOutputBase64Length) {
      return smaller;
    }

    throw new Error("รูปนี้ยังใหญ่เกินไปหลังบีบอัด ลองเลือกรูปที่เล็กลงอีกนิดนะ");
  }

  return compressedDataUrl;
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("อ่านรูปไม่สำเร็จ ลองเลือกรูปใหม่อีกครั้งนะ"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("เปิดรูปนี้ไม่ได้ ลองเลือกรูปใหม่อีกครั้งนะ"));
    image.src = src;
  });
}

function getResizedSize(width: number, height: number, limit = maxDimension) {
  const scale = Math.min(1, limit / Math.max(width, height));

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

async function recompress(image: HTMLImageElement, limit: number, quality: number) {
  const { width, height } = getResizedSize(image.width, image.height, limit);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("บีบอัดรูปไม่สำเร็จ ลองเลือกรูปใหม่อีกครั้งนะ");
  }

  ctx.fillStyle = "#f7fbfd";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", quality);
}
