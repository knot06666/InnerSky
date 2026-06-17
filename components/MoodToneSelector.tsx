"use client";

import type { MoodTone } from "@/types/result";

const tones: MoodTone[] = ["อ่อนโยน", "เหงาแต่สวย", "เริ่มใหม่", "ปล่อยวาง", "กอดตัวเอง", "กวน ๆ นิด ๆ แต่ยังฮีลใจ"];

type MoodToneSelectorProps = {
  value: MoodTone;
  onChange: (tone: MoodTone) => void;
};

export default function MoodToneSelector({ value, onChange }: MoodToneSelectorProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-extrabold text-ink">อยากให้ฟ้าแปลด้วยน้ำเสียงแบบไหน</legend>
      <div className="flex flex-wrap gap-2">
        {tones.map((tone) => {
          const checked = value === tone;

          return (
            <label
              key={tone}
              className={`min-h-10 cursor-pointer rounded-full border px-4 py-2 text-center text-[13px] font-bold leading-5 transition sm:text-sm ${
                checked ? "border-[#55788f] bg-[#e4f1f7] text-[#3d657e]" : "border-white/80 bg-white/70 text-softGray"
              }`}
            >
              <input
                checked={checked}
                className="sr-only"
                name="tone"
                onChange={() => onChange(tone)}
                type="radio"
                value={tone}
              />
              {tone}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
