# 🚀 คู่มือการ Deploy เว็บไซต์ JMC Construction Materials

## 📋 ข้อมูลโปรเจค
- **ชื่อโปรเจค**: JMC Construction Materials
- **เทคโนโลยี**: Next.js 14, Payload CMS, MongoDB Atlas, TypeScript
- **Database**: MongoDB Atlas (Persistent ✅)
- **File Storage**: Vercel Blob Storage (Persistent ✅)

## 🔧 การเตรียมพร้อม Deploy

### 1. ✅ Database Connection
- ใช้ MongoDB Atlas (cloud database)
- เข้าถึงได้จากทุกที่
- ไม่ต้องแก้ไขอะไร

### 2. ✅ File Storage
- ใช้ Vercel Blob Storage สำหรับไฟล์ที่อัปโหลด
- ไฟล์จะไม่หายหลัง redeploy
- รองรับรูปภาพและเอกสาร

## 🌐 ขั้นตอนการ Deploy บน Vercel

### 1. Push โปรเจคขึ้น GitHub
```bash
git add .
git commit -m "Ready for deployment with persistent storage"
git push origin main
```

### 2. สมัครและเชื่อมต่อ Vercel
1. ไปที่ [vercel.com](https://vercel.com)
2. Sign up ด้วย GitHub account
3. คลิก "Import Project"
4. เลือก repository `JMC1`

### 3. ตั้งค่า Environment Variables ใน Vercel
ใน Vercel Dashboard → Settings → Environment Variables:

```env
PAYLOAD_SECRET=8ecc0ba2b1c8c461f2daba9d
DATABASE_URI=mongodb+srv://tadeyes1:oEo9elNLikhylKek@jmc1.jstakqn.mongodb.net/?retryWrites=true&w=majority&appName=jmc1
PREVIEW_SECRET=tadmilin1
NEXT_PUBLIC_SERVER_URL=https://your-domain.vercel.app
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxx
```

### 4. รับ Vercel Blob Token
1. ใน Vercel Dashboard → Storage → Create Database
2. เลือก "Blob"
3. Copy `BLOB_READ_WRITE_TOKEN`
4. เพิ่มใน Environment Variables

### 5. Deploy
1. คลิก "Deploy"
2. รอ build เสร็จ (ประมาณ 2-3 นาที)
3. เว็บไซต์พร้อมใช้งาน!

## 🔐 ความปลอดภัย

### ✅ ข้อมูลที่ปลอดภัย:
- ไฟล์ `.env` ไม่ขึ้น GitHub
- Database credentials ปลอดภัย
- File storage มี access control

### ⚠️ ข้อควรระวัง:
- อย่าแชร์ Environment Variables
- เปลี่ยน PAYLOAD_SECRET ในการใช้งานจริง
- ตั้งค่า CORS ให้เหมาะสม

## 📱 Features ที่พร้อมใช้งาน

### 🏠 Frontend:
- หน้าแรกแสดงสินค้าและหมวดหมู่
- ระบบค้นหาสินค้า
- Mobile responsive
- SEO optimized

### 🛠️ Admin Panel:
- จัดการสินค้า (Products)
- จัดการหมวดหมู่ (Categories)
- จัดการสื่อ (Media)
- ระบบขอใบเสนอราคา (Quote Requests)
- จัดการหน้าเว็บ (Pages)
- จัดการบทความ (Posts)

### 📋 Quote Request System:
- ฟอร์มขอใบเสนอราคา
- อัปโหลดไฟล์ประกอบ (รูปภาพ, PDF, Word)
- ระบบแจ้งเตือนทาง email
- ติดตามสถานะใน admin

## 🔧 การแก้ไขปัญหา

### ปัญหา Build Error:
```bash
# ลบ cache และ reinstall
rm -rf .next node_modules
npm install
npm run build
```

### ปัญหา Database Connection:
- ตรวจสอบ `DATABASE_URI` ใน Environment Variables
- ตรวจสอบ IP Whitelist ใน MongoDB Atlas

### ปัญหา File Upload:
- ตรวจสอบ `BLOB_READ_WRITE_TOKEN`
- ตรวจสอบ file size limits (12MB)

## 📞 การติดต่อ
- **Admin URL**: `https://your-domain.vercel.app/admin`
- **Default Admin**: สร้างผ่าน admin panel
- **Support**: ติดต่อผู้พัฒนา

## 🎯 Next Steps หลัง Deploy
1. สร้าง admin user แรก
2. เพิ่มข้อมูลสินค้าและหมวดหมู่
3. ตั้งค่า SEO และ metadata
4. ทดสอบระบบขอใบเสนอราคา
5. เชื่อมต่อ domain name (ถ้ามี)

---
**🎉 ยินดีด้วย! เว็บไซต์ JMC Construction Materials พร้อมใช้งานแล้ว** 