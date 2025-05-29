# 🔧 การแก้ไขปัญหา Vercel Blob Storage สำหรับ JMC1

## 🚨 ปัญหาที่พบ
- **TypeError: Failed to fetch** ใน Admin Panel
- ไม่สามารถอัพโหลดไฟล์ได้ผ่าน Admin Panel
- การตั้งค่า Vercel Blob Storage ไม่สมบูรณ์

## ✅ การแก้ไขที่ทำ

### 1. ปรับปรุง `src/payload.config.ts`
```typescript
// เพิ่มการตั้งค่า clientUploads สำคัญมาก!
vercelBlobStorage({
  enabled: true,
  collections: {
    media: true,
  },
  token: process.env.BLOB_READ_WRITE_TOKEN || '',
  addRandomSuffix: false,
  cacheControlMaxAge: 365 * 24 * 60 * 60, // 1 year cache
  clientUploads: true, // 🔑 สำคัญ: เปิดใช้ client uploads เพื่อหลีกเลี่ยงข้อจำกัด 4.5MB ของ Vercel
}),
```

### 2. ปรับปรุง `next.config.js`
```javascript
images: {
  remotePatterns: [
    // เพิ่ม Vercel Blob Storage patterns
    {
      protocol: 'https',
      hostname: '*.public.blob.vercel-storage.com',
      port: '',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: '*.blob.vercel-storage.com',
      port: '',
      pathname: '/**',
    },
    // เพิ่ม pattern เฉพาะสำหรับ token ปัจจุบัน
    {
      protocol: 'https',
      hostname: 'fzhrisgdjt706ftr.public.blob.vercel-storage.com',
      port: '',
      pathname: '/**',
    },
  ],
  // เพิ่มการตั้งค่าความปลอดภัย
  dangerouslyAllowSVG: true,
  contentDispositionType: 'attachment',
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
},

// เพิ่ม headers สำหรับ CORS
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          value: '*',
        },
        {
          key: 'Access-Control-Allow-Methods',
          value: 'GET, POST, PUT, DELETE, OPTIONS',
        },
        {
          key: 'Access-Control-Allow-Headers',
          value: 'Content-Type, Authorization',
        },
      ],
    },
  ]
},
```

### 3. ตรวจสอบ Environment Variables
```env
# ใน .env.local
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_FZHrISGdjt706fTr_YxgKrcLY6UTsVS4SjNWDVFBAVuqDKy"
DATABASE_URI="mongodb+srv://tadeyes1:oEo9elNLikhylKek@jmc1.jstakqn.mongodb.net/?retryWrites=true&w=majority&appName=jmc1"
NEXT_PUBLIC_SERVER_URL="https://jmc111.vercel.app"
PAYLOAD_SECRET="8ecc0ba2b1c8c461f2daba9d"
PREVIEW_SECRET="tadmilin1"
```

## 🧪 การทดสอบ

### ✅ ทดสอบการเชื่อมต่อ Blob Storage
```bash
node test-blob-connection.mjs
```
**ผลลัพธ์**: 
- ✅ การเชื่อมต่อสำเร็จ!
- 📁 จำนวนไฟล์ใน blob storage: 2
- 📄 ไฟล์ที่มีอยู่: original-1532967202865.png, ภาพประกอบ_เหล็กรูปพรรณ.jpg

### 🔄 ทดสอบ Development Server
```bash
npm run dev
```
- เข้าไปที่: http://localhost:3000/admin
- ทดสอบการอัพโหลดใน Collections > Media

## 🔑 จุดสำคัญที่แก้ไขปัญหา

### 1. **clientUploads: true**
- เป็นการตั้งค่าที่สำคัญที่สุด
- ทำให้การอัพโหลดเกิดขึ้นที่ client-side โดยตรง
- หลีกเลี่ยงข้อจำกัด 4.5MB ของ Vercel server uploads

### 2. **CORS/CSRF Configuration**
- เพิ่ม blob storage domains ใน CORS และ CSRF
- ทำให้ admin panel สามารถเชื่อมต่อกับ blob storage ได้

### 3. **Next.js Image Configuration**
- เพิ่ม remotePatterns สำหรับ blob storage
- ทำให้รูปภาพจาก blob storage แสดงผลได้

## 🚀 การ Deploy

### สำหรับ Vercel Production:
1. ตั้งค่า Environment Variables ใน Vercel Dashboard:
   ```env
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_FZHrISGdjt706fTr_YxgKrcLY6UTsVS4SjNWDVFBAVuqDKy
   DATABASE_URI=mongodb+srv://tadeyes1:oEo9elNLikhylKek@jmc1.jstakqn.mongodb.net/?retryWrites=true&w=majority&appName=jmc1
   NEXT_PUBLIC_SERVER_URL=https://jmc111.vercel.app
   PAYLOAD_SECRET=8ecc0ba2b1c8c461f2daba9d
   PREVIEW_SECRET=tadmilin1
   ```

2. Push โค้ดไปยัง GitHub:
   ```bash
   git add .
   git commit -m "Fix: Vercel Blob Storage configuration with clientUploads"
   git push origin main
   ```

## 📋 Checklist การทำงาน

### ✅ สิ่งที่ควรทำงานได้แล้ว:
- [x] การเชื่อมต่อกับ Vercel Blob Storage
- [x] การอัพโหลดไฟล์ผ่าน Admin Panel
- [x] การแสดงผลรูปภาพจาก Blob Storage
- [x] การจัดเก็บไฟล์แบบถาวร (persistent storage)

### 🔍 วิธีการทดสอบ:
1. **Development**: `npm run dev` → http://localhost:3000/admin
2. **Production**: https://jmc111.vercel.app/admin
3. **ทดสอบอัพโหลด**: Collections > Media > Create New
4. **ตรวจสอบไฟล์**: ดูว่าไฟล์แสดงผลในเว็บไซต์หลัก

## 🎯 ผลลัพธ์ที่คาดหวัง

- ✅ Admin panel ทำงานได้ปกติ
- ✅ สามารถอัพโหลดไฟล์ได้ทุกประเภท
- ✅ รูปภาพแสดงผลถูกต้องในเว็บไซต์
- ✅ ไฟล์จัดเก็บใน Vercel Blob Storage แบบถาวร
- ✅ ไม่มี error "Failed to fetch" อีกต่อไป

## 🧹 ไฟล์ที่สามารถลบได้
หลังจากทดสอบเสร็จแล้ว สามารถลบไฟล์เหล่านี้ได้:
- `test-blob-connection.js`
- `test-blob-connection.mjs`
- `test-upload-api.mjs` 