"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const messages = [
  "กำลังฟังเสียงของท้องฟ้า...",
  "กำลังแปลสีของเมฆเป็นความรู้สึก...",
  "กำลังมองหาแสงเล็ก ๆ ในภาพนี้...",
];

function CloudShape({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-24 w-44 ${className}`}>
      <span className="absolute bottom-4 left-2 h-12 w-28 rounded-full bg-white shadow-[0_18px_45px_rgba(85,120,143,0.14)]" />
      <span className="absolute bottom-5 left-14 h-16 w-20 rounded-full bg-white" />
      <span className="absolute bottom-5 right-5 h-12 w-20 rounded-full bg-white" />
      <span className="absolute bottom-3 left-7 h-10 w-32 rounded-full bg-white/95" />
      <span className="absolute bottom-1 left-9 h-5 w-28 rounded-full bg-[#dcecf4]/70 blur-md" />
    </div>
  );
}

export default function LoadingSky() {
  const message = useMemo(() => messages[Math.floor(Math.random() * messages.length)], []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto mt-5 max-w-md overflow-hidden rounded-[8px] border border-white/70 bg-white/70 px-5 py-7 text-center shadow-soft backdrop-blur-xl"
    >
      <div className="relative mx-auto mb-5 h-40 overflow-hidden rounded-[8px] bg-gradient-to-b from-[#d7edf8] via-[#f8fbfc] to-[#fff7ed]">
        <motion.div
          animate={{ x: ["-18%", "8%", "-18%"], y: [2, -8, 2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-6 top-10 scale-75 opacity-80"
        >
          <CloudShape />
        </motion.div>

        <motion.div
          animate={{ x: ["12%", "-10%", "12%"], y: [0, 7, 0] }}
          transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-2 top-7 scale-[0.58] opacity-55"
        >
          <CloudShape />
        </motion.div>

        <motion.div
          animate={{ y: [0, -9, 0], scale: [1, 1.025, 1] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-x-0 bottom-7 mx-auto grid w-fit place-items-center"
        >
          <CloudShape className="scale-110" />
          <span className="absolute bottom-8 h-3 w-24 animate-pulse rounded-full bg-[#8fb2c5]/18 blur-md" />
        </motion.div>

        <motion.span
          animate={{ opacity: [0.28, 0.8, 0.28], scale: [1, 1.08, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-7 h-10 w-10 -translate-x-1/2 rounded-full bg-white/70 blur-sm"
        />
      </div>

      <p className="text-[15px] font-extrabold leading-7 text-[#55788f]">{message}</p>
      <p className="mt-2 text-sm leading-6 text-softGray">รอสักครู่ ฟ้ากำลังค่อย ๆ พูดเบา ๆ</p>
    </motion.section>
  );
}
