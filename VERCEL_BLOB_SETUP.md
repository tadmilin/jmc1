# การตั้งค่า Vercel Blob Storage สำหรับ JMC1

## ขั้นตอนการตั้งค่า

### 1. สร้าง Vercel Blob Storage Token

1. เข้าไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. เลือกโปรเจค JMC1
3. ไปที่ Settings > Storage
4. สร้าง Blob Store ใหม่หรือใช้ที่มีอยู่
5. คัดลอก token ที่ได้

### 2. ตั้งค่า Environment Variables

เพิ่มตัวแปรต่อไปนี้ในไฟล์ `.env.local` (สำหรับ development) และ Vercel Dashboard (สำหรับ production):

```bash
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
```

### 3. การตั้งค่าที่ได้ทำไปแล้ว

#### ✅ next.config.js
- เพิ่ม hostname สำหรับ Vercel Blob Storage ใน `images.remotePatterns`
- รองรับ `*.public.blob.vercel-storage.com` และ `*.blob.vercel-storage.com`

#### ✅ payload.config.ts
- ติดตั้ง `@payloadcms/storage-vercel-blob` plugin
- กำหนดให้ collection `media` ใช้ Vercel Blob Storage

#### ✅ src/collections/Media.ts
- ลบการตั้งค่า `staticDir` เพื่อให้ใช้ Blob Storage แทน local storage

#### ✅ src/heros/HighImpact/index.tsx
- แทนที่ `Image` component ด้วย `Media` component เพื่อรองรับ Blob Storage URLs

## การทดสอบ

1. รีสตาร์ท development server
2. ลองอัพโหลดรูปภาพใหม่ผ่าน admin panel
3. ตรวจสอบว่ารูปภาพแสดงผลถูกต้องในหน้าเว็บ

## การ Deploy

1. ตั้งค่า `BLOB_READ_WRITE_TOKEN` ใน Vercel Dashboard
2. Deploy โปรเจค
3. ตรวจสอบการทำงานของ admin panel และการแสดงรูปภาพ

## หมายเหตุ

- รูปภาพที่อัพโหลดใหม่จะถูกเก็บใน Vercel Blob Storage
- รูปภาพเก่าที่อยู่ใน local storage จะยังคงทำงานได้ปกติ
- URL ของรูปภาพจะเปลี่ยนจาก `/api/media/file/filename` เป็น Blob Storage URL 