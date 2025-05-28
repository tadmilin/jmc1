# การแก้ไขปัญหา Admin Panel และ Vercel Blob Storage

## ปัญหาที่พบ

### 1. TypeError: Failed to fetch
- **สาเหตุ**: Payload CMS admin panel ไม่สามารถเชื่อมต่อกับ API ได้
- **อาการ**: Error ใน browser console เมื่อเข้า `/admin`

### 2. Invalid src prop (Next.js Image)
- **สาเหตุ**: Next.js ไม่อนุญาตให้โหลดรูปภาพจาก Vercel Blob Storage
- **อาการ**: รูปภาพไม่แสดงผล

### 3. ⚠️ Vercel Blob Access Error (ปัญหาใหม่)
- **สาเหตุ**: `Vercel Blob: Access denied, please provide a valid token for this resource`
- **อาการ**: ไม่สามารถอัพโหลดหรือแสดงไฟล์จาก Vercel Blob Storage ได้
- **การแก้ไข**: ปิดการใช้งาน Vercel Blob Storage ชั่วคราวและใช้ local storage

## การแก้ไขที่ทำแล้ว

### ✅ 1. แก้ไข next.config.js
```javascript
images: {
  remotePatterns: [
    // เพิ่ม Vercel Blob Storage
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
  ],
}
```

### ✅ 2. แก้ไข src/collections/Media.ts
```typescript
upload: {
  // เพิ่ม staticDir กลับมาสำหรับ local storage
  staticDir: path.resolve(dirname, '../../public/media'),
  adminThumbnail: 'thumbnail',
  focalPoint: true,
  // ... imageSizes
}
```

### ✅ 3. แก้ไข src/payload.config.ts
```typescript
// ปิดการใช้งาน Vercel Blob Storage ชั่วคราว
// vercelBlobStorage({
//   collections: {
//     media: true,
//   },
//   token: process.env.BLOB_READ_WRITE_TOKEN || '',
// }),

// ปรับ CORS และ CSRF ให้ง่ายขึ้น
cors: process.env.NODE_ENV === 'production' 
  ? ['https://jmc111.vercel.app', 'https://*.vercel.app']
  : ['http://localhost:3000', 'http://127.0.0.1:3000'],
```

### ✅ 4. สร้างโฟลเดอร์ media
```bash
mkdir public/media
```

## ขั้นตอนการทดสอบ

### 1. Development Environment
```bash
# 1. หยุด server ที่รันอยู่
npm run dev:stop  # หรือ Ctrl+C

# 2. ลบ node_modules และ reinstall (ถ้าจำเป็น)
rm -rf .next
npm install

# 3. เริ่ม server ใหม่
npm run dev

# 4. ทดสอบ admin panel
เปิด http://localhost:3000/admin

# 5. ทดสอบการอัพโหลดไฟล์
- เข้า Collections > Media
- คลิก "Create New"
- อัพโหลดไฟล์รูปภาพ
```

### 2. Production Environment (Vercel)
```bash
# สำหรับ production ต้องใช้ Vercel Blob Storage
# ต้องได้ token ที่ถูกต้องจาก Vercel Dashboard

# 1. ตั้งค่า Environment Variables ใน Vercel Dashboard
BLOB_READ_WRITE_TOKEN=your_valid_token_here
DATABASE_URI=your_mongodb_connection_string
PAYLOAD_SECRET=your_secret_key
NEXT_PUBLIC_SERVER_URL=https://jmc111.vercel.app

# 2. เปิดการใช้งาน Vercel Blob Storage ใน payload.config.ts
# 3. Deploy ใหม่
```

## การตรวจสอบปัญหา

### 1. ตรวจสอบ Local Storage
```bash
# ตรวจสอบว่าโฟลเดอร์ media มีอยู่
ls -la public/media

# ตรวจสอบ permissions
chmod 755 public/media
```

### 2. ตรวจสอบ Admin Panel
```bash
# ทดสอบ admin panel
curl http://localhost:3000/admin

# ตรวจสอบ API
curl http://localhost:3000/api/media
```

### 3. ตรวจสอบ Vercel Blob Token
- เข้า Vercel Dashboard > Storage
- สร้าง Blob Storage ใหม่
- Copy token ใหม่
- อัปเดต environment variables

## ปัญหาที่อาจพบเพิ่มเติม

### 1. File Upload Permission Error
**อาการ**: ไม่สามารถอัพโหลดไฟล์ได้
**แก้ไข**: ตรวจสอบ permissions ของโฟลเดอร์ public/media

### 2. Image Display Issues
**อาการ**: รูปภาพไม่แสดงในหน้าเว็บ
**แก้ไข**: ตรวจสอบ path ของรูปภาพและ next.config.js

### 3. Development vs Production Storage
**อาการ**: ทำงานใน development แต่ไม่ทำงานใน production
**แก้ไข**: ใช้ Vercel Blob Storage สำหรับ production

## สถานะปัจจุบัน

### ✅ Development Environment
- **Local Storage**: ใช้งานได้ปกติ
- **Admin Panel**: ทำงานได้
- **File Upload**: ทำงานได้
- **Image Display**: ทำงานได้

### ⚠️ Production Environment
- **Vercel Blob Storage**: ต้องตั้งค่า token ใหม่
- **Admin Panel**: ต้องทดสอบหลัง deploy
- **File Upload**: ต้องใช้ Vercel Blob Storage

## การติดต่อขอความช่วยเหลือ

หากยังมีปัญหา กรุณาแจ้ง:
1. Error message ที่แสดงใน browser console
2. Server logs จาก terminal
3. Environment ที่ใช้ (development/production)
4. ขั้นตอนที่ทำก่อนเกิดปัญหา

## หมายเหตุสำคัญ

- **Development**: ใช้ local storage (`public/media`)
- **Production**: ต้องใช้ Vercel Blob Storage
- **Token**: ต้องได้ token ที่ถูกต้องจาก Vercel Dashboard
- **Migration**: ไฟล์ที่อัพโหลดใน development จะไม่ปรากฏใน production 