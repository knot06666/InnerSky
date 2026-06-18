"use client";

import { track } from "@vercel/analytics";
import { useState } from "react";
import MoodToneSelector from "@/components/MoodToneSelector";
import { compressImageForAnalysis } from "@/lib/compressImage";
import type { MoodTone } from "@/types/result";

const maxOriginalFileSize = 14 * 1024 * 1024;

type ImageUploaderProps = {
  canAnalyze: boolean;
  error: string;
  imageDataUrl: string;
  tone: MoodTone;
  onAnalyze: () => void;
  onError: (message: string) => void;
  onImageChange: (dataUrl: string) => void;
  onToneChange: (tone: MoodTone) => void;
};

export default function ImageUploader({
  canAnalyze,
  error,
  imageDataUrl,
  tone,
  onAnalyze,
  onError,
  onImageChange,
  onToneChange,
}: ImageUploaderProps) {
  const [isCompressing, setIsCompressing] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    track("upload_selected", {
      file_type: file.type || "unknown",
      file_size_mb: Number((file.size / 1024 / 1024).toFixed(2)),
    });

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      track("upload_rejected", { reason: "unsupported_type", file_type: file.type || "unknown" });
      onImageChange("");
      onError("รองรับเฉพาะรูป jpg, png หรือ webp เท่านั้น");
      return;
    }

    if (file.size > maxOriginalFileSize) {
      track("upload_rejected", { reason: "file_too_large", file_size_mb: Number((file.size / 1024 / 1024).toFixed(2)) });
      onImageChange("");
      onError("รูปนี้ใหญ่เกินไป ลองเลือกรูปที่เล็กกว่า 14MB นะ");
      return;
    }

    try {
      setIsCompressing(true);
      onError("");
      const dataUrl = await compressImageForAnalysis(file);
      onImageChange(dataUrl);
      onError("");
      track("upload_ready", {
        file_type: file.type,
        original_size_mb: Number((file.size / 1024 / 1024).toFixed(2)),
      });
    } catch {
      track("upload_error", { reason: "compression_failed" });
      onImageChange("");
      onError("อ่านรูปไม่สำเร็จ ลองเลือกรูปใหม่อีกครั้งนะ");
    } finally {
      setIsCompressing(false);
    }
  }

  return (
    <div className="grid gap-3">
      <label className="relative grid min-h-[210px] cursor-pointer place-items-center overflow-hidden rounded-[8px] border border-dashed border-[#8fb2c5]/70 bg-gradient-to-br from-white/80 to-skyMist/90 sm:min-h-[250px]">
        <input accept="image/png,image/jpeg,image/webp" className="sr-only" disabled={isCompressing} onChange={handleFileChange} type="file" />
        {imageDataUrl ? (
          <img alt="รูปท้องฟ้าที่อัปโหลด" className="h-[210px] w-full object-cover sm:h-[250px]" src={imageDataUrl} />
        ) : (
          <span className="grid justify-items-center gap-2 px-6 text-center text-[#55788f]">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-3xl font-light shadow-[0_16px_40px_rgba(85,120,143,0.16)]">
              +
            </span>
            <span className="text-[14px] font-extrabold leading-6">แตะเพื่อเลือกรูปท้องฟ้า / เมฆ / วิวธรรมชาติ</span>
            <span className="text-[11px] font-bold leading-5 text-softGray">jpg, png, webp ไม่เกิน 14MB ระบบจะย่อรูปให้อัตโนมัติ</span>
          </span>
        )}

        {isCompressing ? (
          <span className="absolute inset-0 grid place-items-center bg-white/78 px-8 text-center backdrop-blur-sm">
            <span className="grid justify-items-center gap-3">
              <span className="h-10 w-10 animate-spin rounded-full border-4 border-skyPale border-t-[#55788f]" />
              <span className="text-sm font-extrabold text-[#55788f]">กำลังย่อรูปให้เบาลง…</span>
              <span className="text-xs font-bold leading-5 text-softGray">รอสักครู่ รูปจากมือถืออาจใช้เวลานิดหนึ่ง</span>
            </span>
          </span>
        ) : null}
      </label>

      <MoodToneSelector onChange={onToneChange} value={tone} />

      {error ? <p className="rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-sm leading-6 text-red-700">{error}</p> : null}

      <button
        className="min-h-11 rounded-[8px] bg-[#55788f] px-4 text-sm font-extrabold text-white shadow-[0_16px_35px_rgba(85,120,143,0.24)] transition enabled:hover:bg-[#46697f] disabled:cursor-not-allowed disabled:opacity-45"
        disabled={!canAnalyze || isCompressing}
        onClick={onAnalyze}
        type="button"
      >
        {isCompressing ? "กำลังเตรียมรูป…" : "ให้ฟ้าแปลใจ"}
      </button>

      <p className="rounded-[8px] bg-white/58 px-3 py-2 text-center text-[11px] font-bold leading-5 text-softGray">
        รูปของคุณจะถูกใช้เพื่อวิเคราะห์ครั้งนี้เท่านั้น ฟ้าข้างในไม่มีระบบบัญชีและไม่เก็บรูปไว้ในฐานข้อมูล
      </p>
    </div>
  );
}
