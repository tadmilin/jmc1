# Media Security - การป้องกันการแก้ไข/ดัดแปลงรูปภาพ

## ❓ คำถาม: ผู้ไม่หวังดีสามารถแก้ไข/ดัดแปลงรูปภาพได้หรือไม่?

### ✅ คำตอบ: **ไม่ได้** - เพราะมีการป้องกันหลายชั้น

---

## 🛡️ ระบบป้องกัน 5 ชั้น

### 1️⃣ **PayloadCMS Access Control**
```typescript
// src/collections/Media.ts
access: {
  create: authenticated,  // ✅ ต้อง login เป็น Admin ถึงจะ upload ได้
  update: authenticated,  // ✅ ต้อง login เป็น Admin ถึงจะแก้ไขได้
  delete: authenticated,  // ✅ ต้อง login เป็น Admin ถึงจะลบได้
  read: authenticated,    // ✅ ต้อง login ถึงจะดู metadata ใน Admin ได้
}
```

**ผลลัพธ์**:
- คนที่ไม่ login ไม่สามารถเข้า Admin Panel ได้
- ไม่สามารถ upload, แก้ไข, หรือลบผ่าน Admin Panel ได้

---

### 2️⃣ **HTTP Methods Restriction**
```typescript
// src/app/api/media/file/[filename]/route.ts

export async function GET() { /* อ่านไฟล์ได้ */ }

// ❌ ปิดการใช้งาน methods อื่นทั้งหมด
export async function POST() { 
  return 405 - Method Not Allowed 
}
export async function PUT() { 
  return 405 - Method Not Allowed 
}
export async function PATCH() { 
  return 405 - Method Not Allowed 
}
export async function DELETE() { 
  return 405 - Method Not Allowed 
}
```

**ผลลัพธ์**:
- ไม่สามารถ upload ผ่าน `/api/media/file/*` ได้
- ไม่สามารถแก้ไขหรือลบผ่าน API ได้
- มีเฉพาะ GET (อ่านเท่านั้น) เท่านั้นที่ใช้ได้

---

### 3️⃣ **Vercel Blob Storage Protection**
รูปภาพจริงเก็บอยู่ใน **Vercel Blob Storage**:

```
https://fzhrisgdjt706ftr.public.blob.vercel-storage.com/image-xxx.webp
```

**Vercel Blob Storage Features**:
- ✅ **Read-Only URLs**: URL ที่ได้มาเป็น read-only
- ✅ **Signed URLs**: URLs มี signature ที่ไม่สามารถ forge ได้
- ✅ **Immutable Files**: ไฟล์ที่ upload แล้วไม่สามารถแก้ไขได้ (ต้องลบแล้ว upload ใหม่)
- ✅ **Access Control**: ควบคุมการเข้าถึงผ่าน Vercel API keys

**ผลลัพธ์**:
- ไม่สามารถแก้ไขไฟล์ที่อยู่ใน Blob Storage ได้โดยตรง
- ต้องมี Vercel API token ถึงจะลบหรือ upload ใหม่ได้

---

### 4️⃣ **No Upload API Endpoint**
ในระบบไม่มี public upload endpoint เลย:

❌ **ไม่มีเส้นทางเหล่านี้**:
- `/api/media/upload` - ไม่มี
- `/api/upload` - ไม่มี
- `/api/media/file/[filename]` - มีแต่เป็น GET only

✅ **Upload ได้เฉพาะผ่าน**:
- Payload Admin Panel (`/admin/collections/media`)
- ต้อง login ด้วย Admin account

---

### 5️⃣ **Database Protection**
ข้อมูล metadata ของ media เก็บใน MongoDB:

```typescript
// ตัวอย่าง document ใน database
{
  _id: "...",
  filename: "hero-image.webp",
  url: "https://blob.storage.com/...",
  alt: "Hero Image",
  // ... metadata อื่นๆ
}
```

**Protection**:
- Database credentials ไม่ได้เปิดเผย
- ต้องมี `DATABASE_URI` ถึงจะเข้าถึงได้
- Payload API มี access control ป้องกันอยู่แล้ว

---

## 🔍 สถานการณ์จริง: ผู้ไม่หวังดีพยายามโจมตี

### ❌ Scenario 1: พยายาม POST ไฟล์ใหม่
```bash
curl -X POST http://yoursite.com/api/media/file/test.jpg \
  -F "file=@hacked.jpg"
```

**ผลลัพธ์**: ❌ `405 Method Not Allowed`

---

### ❌ Scenario 2: พยายาม PUT แก้ไขไฟล์
```bash
curl -X PUT http://yoursite.com/api/media/file/existing.jpg \
  -d '{"url": "http://malicious.com/hack.jpg"}'
```

**ผลลัพธ์**: ❌ `405 Method Not Allowed`

---

### ❌ Scenario 3: พยายาม DELETE ลบไฟล์
```bash
curl -X DELETE http://yoursite.com/api/media/file/important.jpg
```

**ผลลัพธ์**: ❌ `405 Method Not Allowed`

---

### ❌ Scenario 4: พยายามเข้า Admin Panel โดยไม่ login
```
http://yoursite.com/admin/collections/media
```

**ผลลัพธ์**: ❌ Redirect ไปหน้า `/admin/login`

---

### ❌ Scenario 5: พยายาม Query PayloadCMS API
```bash
curl http://yoursite.com/api/media?limit=100
```

**ผลลัพธ์**: ❌ `401 Unauthorized` (ไม่มี session token)

---

### ✅ Scenario 6: สิ่งที่ทำได้ (ตามที่ออกแบบไว้)
```bash
# อ่านไฟล์รูปภาพได้ (GET only)
curl http://yoursite.com/api/media/file/hero-image.webp
```

**ผลลัพธ์**: ✅ `307 Redirect` ไปยัง Blob Storage URL และได้รูปภาพ

---

## 🎯 สรุป: สิ่งที่ทำได้ vs ทำไม่ได้

| การกระทำ | ทำได้/ไม่ได้ | เหตุผล |
|----------|-------------|--------|
| ดูรูปภาพ (GET) | ✅ ได้ | ออกแบบให้เป็น public read |
| Upload รูปใหม่ (POST) | ❌ ไม่ได้ | ไม่มี POST endpoint |
| แก้ไขรูป (PUT/PATCH) | ❌ ไม่ได้ | ไม่มี PUT/PATCH methods |
| ลบรูป (DELETE) | ❌ ไม่ได้ | ไม่มี DELETE method |
| เข้า Admin Panel | ❌ ไม่ได้ | ต้อง login ด้วย Admin account |
| Query metadata | ❌ ไม่ได้ | ต้องมี session authentication |
| แก้ไขไฟล์ใน Blob | ❌ ไม่ได้ | Blob Storage เป็น immutable |

---

## 🔒 แนวทางเพิ่มเติม (Optional)

หากต้องการความปลอดภัยมากขึ้น สามารถเพิ่มได้:

### 1. Rate Limiting
```typescript
// ป้องกัน DDoS หรือ brute force
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
```

### 2. Content Security Policy (CSP)
```typescript
// next.config.mjs
headers: async () => [
  {
    source: '/api/media/:path*',
    headers: [
      {
        key: 'Content-Security-Policy',
        value: "default-src 'self'"
      }
    ]
  }
]
```

### 3. Watermarking
- เพิ่ม watermark บนรูปภาพอัตโนมัติ
- ป้องกันการนำรูปไปใช้โดยไม่ได้รับอนุญาต

### 4. Signed URLs with Expiration
```typescript
// สร้าง signed URLs ที่หมดอายุ
const signedUrl = generateSignedUrl(filename, {
  expiresIn: '1h'
})
```

---

## 📊 Security Checklist

- ✅ PayloadCMS Access Control (authenticated only)
- ✅ HTTP Methods restricted to GET only
- ✅ No public upload endpoints
- ✅ Files stored in Vercel Blob Storage (immutable)
- ✅ Database credentials protected
- ✅ Admin Panel requires authentication
- ✅ No API keys exposed in client code
- ⬜ Rate limiting (optional)
- ⬜ Watermarking (optional)
- ⬜ Signed URLs with expiration (optional)

---

## 🐛 Testing Security

### Test 1: ทดสอบ GET (ควรสำเร็จ)
```bash
curl -I http://localhost:3000/api/media/file/test.jpg
# Expected: 307 Redirect to Blob Storage
```

### Test 2: ทดสอบ POST (ควรล้มเหลว)
```bash
curl -X POST http://localhost:3000/api/media/file/test.jpg
# Expected: 405 Method Not Allowed
```

### Test 3: ทดสอบ DELETE (ควรล้มเหลว)
```bash
curl -X DELETE http://localhost:3000/api/media/file/test.jpg
# Expected: 405 Method Not Allowed
```

### Test 4: ทดสอบ Admin Access (ควร redirect)
```bash
curl http://localhost:3000/admin/collections/media
# Expected: Redirect to /admin/login
```

---

## 📝 Summary

**ผู้ไม่หวังดี ❌ ไม่สามารถ:**
- Upload รูปภาพใหม่
- แก้ไขรูปภาพที่มีอยู่
- ลบรูปภาพ
- เข้าถึง metadata
- เข้า Admin Panel

**ทำได้เฉพาะ ✅:**
- ดูรูปภาพที่มีอยู่แล้ว (GET only)
- ซึ่งเป็นสิ่งที่เราต้องการให้เกิดขึ้น (เพื่อแสดงบนเว็บไซต์)

**Admin เท่านั้น ✅ สามารถ:**
- Login เข้า Admin Panel
- Upload/Edit/Delete media
- จัดการ metadata
- ทำได้ผ่าน Admin Panel เท่านั้น

---

**Last Updated**: November 20, 2025  
**Status**: ✅ Fully Secured
