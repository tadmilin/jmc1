# 🔧 การแก้ไขปัญหา Admin Panel และ Vercel Blob Storage

## ปัญหาที่พบ
- หลัง deploy แล้ว admin panel ไม่สามารถอัพโหลดรูปภาพได้
- Error: "Fetching user failed: Failed to fetch"
- Vercel Blob Storage ไม่ทำงานใน production

## สาเหตุหลัก
1. **Environment Variables ไม่ตรงกัน**: Token ใน local และ Vercel ไม่ตรงกัน
2. **CORS/CSRF ไม่ครบ**: ไม่ได้เพิ่ม blob storage domains
3. **การตั้งค่า Vercel Blob Storage ไม่สมบูรณ์**

## การแก้ไขที่ทำ

### 1. ✅ อัพเดท Environment Variables
```bash
# เชื่อมต่อโปรเจคกับ Vercel
vercel link

# ดึง environment variables ล่าสุดจาก Vercel
vercel env pull .env.local
```

### 2. ✅ แก้ไข payload.config.ts
```typescript
export default buildConfig({
  // เพิ่ม blob storage domains ใน CORS
  cors: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://jmc111.vercel.app',
    'https://*.vercel.app',
    'https://vercel.app',
    // เพิ่ม blob storage domains
    'https://*.public.blob.vercel-storage.com',
    'https://*.blob.vercel-storage.com',
  ],

  // เพิ่ม blob storage domains ใน CSRF
  csrf: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://jmc111.vercel.app',
    'https://*.vercel.app',
    'https://vercel.app',
    // เพิ่ม blob storage domains
    'https://*.public.blob.vercel-storage.com',
    'https://*.blob.vercel-storage.com',
  ],

  // ปรับปรุงการตั้งค่า MongoDB
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
    connectOptions: {
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    },
  }),

  plugins: [
    ...plugins,
    // ปรับปรุงการตั้งค่า Vercel Blob Storage
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      enabled: true,
      // เพิ่มการตั้งค่าเพิ่มเติม
      addRandomSuffix: true,
      cacheControlMaxAge: 31536000, // 1 year
    }),
  ],

  // ปรับปรุง serverURL
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 
    (process.env.NODE_ENV === 'production' ? 'https://jmc111.vercel.app' : 'http://localhost:3000'),
})
```

### 3. ✅ แก้ไข Media Collection
```typescript
export const Media: CollectionConfig = {
  slug: 'media',
  // ... other configs
  upload: {
    // ลบ staticDir เพื่อให้ใช้ Vercel Blob Storage
    // staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      // ... image sizes
    ],
  },
}
```

### 4. ✅ แก้ไข next.config.js
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'jmc111.vercel.app',
      port: '',
      pathname: '/api/media/**',
    },
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '3000',
      pathname: '/api/media/**',
    },
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

## Environment Variables ที่จำเป็น

### ใน Vercel Dashboard
```env
PAYLOAD_SECRET=8ecc0ba2b1c8c461f2daba9d
DATABASE_URI=mongodb+srv://tadeyes1:oEo9elNLikhylKek@jmc1.jstakqn.mongodb.net/?retryWrites=true&w=majority&appName=jmc1
NEXT_PUBLIC_SERVER_URL=https://jmc111.vercel.app
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_FZHrISGdjt706fTr_YxgKrcLY6UTsVS4SjNWDVFBAVuqDKy
PREVIEW_SECRET=tadmilin1
```

### ใน .env.local (Development)
```env
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_FZHrISGdjt706fTr_YxgKrcLY6UTsVS4SjNWDVFBAVuqDKy"
DATABASE_URI="mongodb+srv://tadeyes1:oEo9elNLikhylKek@jmc1.jstakqn.mongodb.net/?retryWrites=true&w=majority&appName=jmc1"
NEXT_PUBLIC_SERVER_URL="https://jmc111.vercel.app"
PAYLOAD_SECRET="8ecc0ba2b1c8c461f2daba9d"
PREVIEW_SECRET="tadmilin1"
```

## การทดสอบ

### 1. ทดสอบใน Development
```bash
npm run dev
# เข้าไปที่ http://localhost:3000/admin
# ลองอัพโหลดรูปภาพใน Media collection
```

### 2. ทดสอบใน Production
```bash
# Push ไปยัง GitHub (Vercel จะ auto-deploy)
git add .
git commit -m "Fix: Vercel Blob Storage admin panel upload"
git push origin main
```

## ผลลัพธ์ที่คาดหวัง

### ✅ สิ่งที่ควรทำงานได้
- Admin panel สามารถเข้าได้ปกติ
- อัพโหลดรูปภาพใน Media collection ได้
- รูปภาพแสดงผลใน admin panel
- รูปภาพแสดงผลในหน้าเว็บ frontend
- URL ของรูปภาพจะเป็น Vercel Blob Storage URL

### 🔍 การตรวจสอบ
1. เข้า admin panel: `https://jmc111.vercel.app/admin`
2. ไปที่ Collections > Media
3. คลิก "Create New"
4. อัพโหลดรูปภาพ
5. ตรวจสอบว่ารูปภาพแสดงผลและมี URL ที่ถูกต้อง

## หมายเหตุ
- รูปภาพที่อัพโหลดใหม่จะถูกเก็บใน Vercel Blob Storage
- รูปภาพเก่าที่อยู่ใน local storage จะยังคงทำงานได้ปกติ
- URL ของรูปภาพจะเปลี่ยนจาก `/api/media/file/filename` เป็น Blob Storage URL
- การแก้ไขนี้ทำให้ admin panel ทำงานได้อย่างเสถียรใน production environment 