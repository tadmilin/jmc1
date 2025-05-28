# 🚀 Deployment Checklist - JMC Construction Materials

## ⚠️ สิ่งที่ต้องทำก่อน Deploy

### 1. 🔑 Vercel Blob Storage Token
- [ ] ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] เลือกโปรเจค JMC
- [ ] ไปที่ Storage → Blob
- [ ] สร้าง Token ใหม่ (หรือใช้ token ที่มีอยู่)
- [ ] Copy token ที่ได้

### 2. 📝 Environment Variables (Vercel Dashboard)
ตั้งค่า Environment Variables ใน Vercel Dashboard:

```env
PAYLOAD_SECRET=8ecc0ba2b1c8c461f2daba9d
DATABASE_URI=mongodb+srv://tadeyes1:oEo9elNLikhylKek@jmc1.jstakqn.mongodb.net/?retryWrites=true&w=majority&appName=jmc1
PREVIEW_SECRET=tadmilin1
NEXT_PUBLIC_SERVER_URL=https://jmc111.vercel.app
BLOB_READ_WRITE_TOKEN=your_new_token_here
```

### 3. 🔧 แก้ไขไฟล์ Code

#### A. เปิดการใช้งาน Vercel Blob Storage
แก้ไข `src/payload.config.ts`:

```typescript
// เปลี่ยนจาก comment เป็น active
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

// ใน plugins section:
plugins: [
  ...plugins,
  vercelBlobStorage({
    collections: {
      media: true,
    },
    token: process.env.BLOB_READ_WRITE_TOKEN || '',
  }),
],
```

#### B. ปิดการใช้งาน Local Storage
แก้ไข `src/collections/Media.ts`:

```typescript
export const Media: CollectionConfig = {
  slug: 'media',
  // ... other configs
  upload: {
    // ลบหรือ comment บรรทัดนี้
    // staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    // ... rest of config
  },
}
```

## 🎯 ผลลัพธ์หลัง Deploy

### ✅ สิ่งที่จะทำงานได้ปกติ
- ✅ UI Layout (Logo, Header, Footer)
- ✅ Database Connection (MongoDB Atlas)
- ✅ Admin Panel Login
- ✅ CRUD Operations
- ✅ Responsive Design

### ⚠️ สิ่งที่จะเปลี่ยนแปลง
- 🔄 File Storage: จาก Local → Vercel Blob Storage
- 🔄 File URLs: จาก `/media/` → Blob Storage URLs
- 🔄 Upload Location: ไฟล์จะถูกเก็บใน Cloud

### 🚨 สิ่งที่ต้องระวัง
- ❌ ไฟล์ที่อัพโหลดใน Development จะไม่ปรากฏใน Production
- ❌ ต้องอัพโหลดไฟล์ใหม่ทั้งหมดใน Production Admin Panel
- ❌ หาก Token ไม่ถูกต้อง จะไม่สามารถอัพโหลดไฟล์ได้

## 🔄 ขั้นตอนการ Deploy

### 1. เตรียมความพร้อม
```bash
# ตรวจสอบว่าไฟล์ทั้งหมดถูกต้อง
npm run build
npm run type-check
```

### 2. Push to GitHub
```bash
git add .
git commit -m "feat: enable Vercel Blob Storage for production"
git push origin main
```

### 3. ตรวจสอบ Vercel Dashboard
- Environment Variables ครบถ้วน
- Build สำเร็จ
- Deployment สำเร็จ

### 4. ทดสอบ Production
- เข้า https://jmc111.vercel.app/admin
- ทดสอบ Login
- ทดสอบอัพโหลดไฟล์
- ตรวจสอบการแสดงผลรูปภาพ

## 📚 เอกสารที่เกี่ยวข้อง
- `VERCEL_BLOB_SETUP.md` - คู่มือตั้งค่า Vercel Blob Storage
- `PROJECT_STATUS_SUMMARY.md` - สรุปสถานะโปรเจค
- `ADMIN_PANEL_TROUBLESHOOTING.md` - คู่มือแก้ไขปัญหา

---
**หมายเหตุ**: ต้องทำตามขั้นตอนทั้งหมดเพื่อป้องกันปัญหาการอัพโหลดไฟล์ใน Production 