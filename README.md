# ฟ้าข้างใน

เว็บแอพฮีลใจภาษาไทยแบบ mobile-first สำหรับอัปโหลดรูปท้องฟ้า ก้อนเมฆ หรือวิวธรรมชาติ แล้วให้ Gemini วิเคราะห์ mood ของภาพเป็นข้อความปลอบใจสั้น ๆ พร้อมการ์ดสำหรับแชร์ลง Story

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

ใส่ `GEMINI_API_KEY` ใน `.env` แล้วเปิด `http://localhost:3000`

## MVP Flow

- Landing page ภาษาไทย
- Upload รูป jpg, png, webp พร้อม preview
- เลือก mood tone
- Gemini วิเคราะห์ภาพและส่ง JSON
- Result card พร้อมปุ่มบันทึกผลลัพธ์ คัดลอกข้อความ ลองใหม่ และสร้างการ์ด Story
- Story card 1080x1920 พร้อมปุ่ม Download

เว็บไซต์นี้สร้างขึ้นเพื่อความบันเทิงและการสำรวจความรู้สึก ไม่ใช่การประเมินทางจิตวิทยาหรือคำแนะนำทางการแพทย์
