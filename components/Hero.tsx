"use client";

import { motion } from "framer-motion";

type HeroProps = {
  onStart: () => void;
};

export default function Hero({ onStart }: HeroProps) {
  return (
    <section className="mx-auto max-w-[430px] pb-2 pt-5 text-center lg:max-w-2xl lg:pt-8">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-sm font-bold text-softGray"
      >
        ฟ้าข้างใน
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.65 }}
        className="mt-2 text-balance text-[32px] font-extrabold leading-[1.18] text-ink sm:text-[42px] lg:text-[46px]"
      >
        วันนี้ท้องฟ้าที่คุณถ่าย
        <span className="block text-[#55788f]">อาจกำลังบอกอะไรบางอย่างกับใจคุณ</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.65 }}
        className="mx-auto mt-3 max-w-[360px] text-pretty text-[15px] leading-7 text-softGray sm:text-base"
      >
        อัปโหลดรูปท้องฟ้า แล้วให้ฟ้าข้างในช่วยแปลมันออกมาเป็นคำปลอบใจเบา ๆ
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24, duration: 0.65 }}
        type="button"
        onClick={onStart}
        className="mt-5 min-h-11 rounded-[8px] bg-[#55788f] px-5 text-sm font-extrabold text-white shadow-[0_16px_35px_rgba(85,120,143,0.26)] transition hover:bg-[#46697f]"
      >
        อัปโหลดท้องฟ้าของวันนี้
      </motion.button>

      <p className="mx-auto mt-4 max-w-[360px] text-xs leading-6 text-softGray/80">
        เว็บไซต์นี้สร้างขึ้นเพื่อความบันเทิงและการสำรวจความรู้สึก ไม่ใช่การประเมินทางจิตวิทยาหรือคำแนะนำทางการแพทย์
      </p>
    </section>
  );
}
