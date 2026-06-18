# ฟ้าข้างใน

เว็บแอพฮีลใจภาษาไทยแบบ mobile-first สำหรับอัปโหลดรูปท้องฟ้า ก้อนเมฆ หรือวิวธรรมชาติ แล้วให้ Gemini วิเคราะห์ mood ของภาพเป็นข้อความปลอบใจสั้น ๆ พร้อมการ์ดสำหรับแชร์ลง Story

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

ใส่ `GEMINI_API_KEY` ใน `.env` แล้วเปิด `http://localhost:3000`

ถ้า deploy จริง ให้ตั้ง `NEXT_PUBLIC_SITE_URL=https://innersky.vercel.app` หรือ URL ของโดเมนจริง เพื่อให้ลิงก์ที่แชร์มี preview ถูกต้อง

ค่า model ที่แนะนำตอนนี้คือ `GEMINI_MODEL=gemini-3.5-flash` และ `GEMINI_MODEL_FALLBACKS=gemini-2.5-flash,gemini-2.5-flash-lite`

## MVP Flow

- Landing page ภาษาไทย
- Upload รูป jpg, png, webp พร้อม preview
- เลือก mood tone
- Gemini วิเคราะห์ภาพและส่ง JSON
- Result card พร้อมปุ่มบันทึกผลลัพธ์ คัดลอกข้อความ ลองใหม่ และสร้างการ์ด Story
- Story card 1080x1920 พร้อมปุ่ม Download

## Privacy

MVP นี้ไม่มี Login และไม่มี Database รูปที่ผู้ใช้อัปโหลดจะถูกส่งไปวิเคราะห์กับ Gemini ตามคำขอครั้งนั้นเท่านั้น และไม่ได้ถูกเก็บไว้ในระบบของแอป

## Analytics

โปรเจกต์ใส่ Vercel Analytics ไว้แล้ว เปิดใช้งานใน Vercel Dashboard ของโปรเจกต์เพื่อดู page views และ traffic พื้นฐาน

เว็บไซต์นี้สร้างขึ้นเพื่อความบันเทิงและการสำรวจความรู้สึก ไม่ใช่การประเมินทางจิตวิทยาหรือคำแนะนำทางการแพทย์
