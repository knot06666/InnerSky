"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const messages = [
  "กำลังฟังเสียงของท้องฟ้า…",
  "กำลังแปลสีของเมฆเป็นความรู้สึก…",
  "กำลังมองหาแสงเล็ก ๆ ในภาพนี้…",
];

export default function LoadingSky() {
  const message = useMemo(() => messages[Math.floor(Math.random() * messages.length)], []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto mt-5 grid max-w-md place-items-center rounded-[8px] border border-white/70 bg-white/70 px-5 py-8 text-center shadow-soft backdrop-blur-xl"
    >
      <motion.div
        animate={{ y: [0, -10, 0], opacity: [0.72, 1, 0.72] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        className="mb-5 h-12 w-28 rounded-full bg-gradient-to-r from-white to-skyPale shadow-[0_16px_40px_rgba(105,119,130,0.15)]"
      />
      <p className="font-extrabold text-[#55788f]">{message}</p>
      <p className="mt-2 text-sm leading-6 text-softGray">รอสักครู่ ฟ้ากำลังค่อย ๆ พูดเบา ๆ</p>
    </motion.section>
  );
}
