# API Security Architecture - PayloadCMS

## 📋 สรุประบบความปลอดภัย

### 🎯 เป้าหมาย
1. ✅ คนทั่วไปเข้าถึงเส้นทาง API ไม่ได้
2. ✅ ดู API หรือดัดแปลง API ไม่ได้
3. ✅ ใช้ X-API-Key ในการเข้ารหัส
4. ✅ เฉพาะ Admin ที่มีรหัสเท่านั้นสามารถแก้ไขเนื้อหาได้ที่ Admin Panel
5. ✅ รูปภาพแสดงผลได้ปกติบนหน้าเว็บ (Public Access)

---

## 🔒 ระดับความปลอดภัยของ API แต่ละประเภท

### 1. **Data APIs (Protected with X-API-Key)**
เส้นทาง API เหล่านี้ต้องใช้ `X-API-Key` ในการเข้าถึง:

#### 📦 Products API
- **Endpoint**: `/api/products`
- **Protection**: X-API-Key + Internal Request Check
- **ใช้งานโดย**: หน้าเว็บภายใน (Internal) + External ต้องมี API Key
- **Files**:
  - `src/app/api/products/route.ts`
  - Client components ที่เรียกใช้ส่ง `x-api-key` header

#### 📂 Categories API
- **Endpoint**: `/api/categories`
- **Protection**: X-API-Key + Internal Request Check
- **ใช้งานโดย**: หน้าเว็บภายใน (Internal) + External ต้องมี API Key
- **Files**:
  - `src/app/api/categories/route.ts`
  - Client components ที่เรียกใช้ส่ง `x-api-key` header

#### 📝 Posts API
- **Endpoint**: `/api/posts`
- **Protection**: X-API-Key + Internal Request Check
- **ใช้งานโดย**: หน้าเว็บภายใน (Internal) + External ต้องมี API Key
- **Files**:
  - `src/app/api/posts/route.ts`
  - Client components ที่เรียกใช้ส่ง `x-api-key` header

---

### 2. **Media API (Public Access)**
เส้นทาง API สำหรับรูปภาพ - **ไม่ต้องใช้ API Key**:

#### 🖼️ Media Files API
- **Endpoint**: `/api/media/file/[filename]`
- **Protection**: Public Access (ไม่ต้องมี authentication)
- **เหตุผล**: 
  - Browser ต้องโหลดรูปภาพผ่าน `<img>` tag
  - `<img>` tag ไม่สามารถส่ง custom headers (X-API-Key) ได้
  - ไฟล์รูปภาพไม่ได้เป็นข้อมูลที่ sensitive
- **File**: `src/app/api/media/file/[filename]/route.ts`

**หมายเหตุ**: 
- Admin ยังคงควบคุมการ Upload/Delete/Edit ผ่าน Admin Panel ที่มี session authentication
- Media API เพียงแค่ serve ไฟล์ที่มีอยู่แล้วใน storage

---

### 3. **Admin Panel (Session Authentication)**
ระบบ Admin ใช้ PayloadCMS authentication:

#### 🔐 Admin Authentication
- **Endpoint**: `/admin`
- **Protection**: Session-based authentication (Payload built-in)
- **การทำงาน**:
  - Login ผ่าน `/admin/login`
  - Session token stored ใน cookie
  - ทุก action ใน Admin Panel ตรวจสอบ session
- **สิทธิ์**: เฉพาะ Admin สามารถ:
  - Create/Update/Delete Products, Categories, Posts
  - Upload/Delete Media files
  - จัดการ Users และ Settings

---

## 🔑 การใช้งาน API Keys

### Environment Variables
```env
# สำหรับ Client-side (Frontend)
NEXT_PUBLIC_API_KEY="jmc-api-2024-secure-key-xdata24b"

# สำหรับ Server-side (API Routes)
PRIVATE_API_KEY="jmc-api-2024-secure-key-xdata24b"
```

### การส่ง API Key จาก Client
```typescript
// ตัวอย่างการเรียก API จาก Client Component
const response = await fetch('/api/products', {
  headers: {
    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
  },
})
```

---

## 🛡️ Security Features

### 1. Internal Request Check
API routes ตรวจสอบว่าเป็น request จาก domain เดียวกันหรือไม่:

```typescript
const isInternalRequest =
  referer.includes(host) ||
  referer.includes('localhost:3000') ||
  referer.includes(process.env.NEXT_PUBLIC_SERVER_URL || '')
```

**ประโยชน์**: 
- Internal requests ไม่ต้องส่ง API key
- External requests ต้องมี API key ที่ถูกต้อง

### 2. API Key Validation
```typescript
if (!apiKey && !isInternalRequest) {
  return NextResponse.json(
    { error: 'Unauthorized: External requests require API key' },
    { status: 401 },
  )
}

if (apiKey && apiKey !== process.env.PRIVATE_API_KEY) {
  return NextResponse.json(
    { error: 'Unauthorized: Invalid API key' },
    { status: 401 },
  )
}
```

### 3. PayloadCMS Access Control
ใช้ Access Control ของ PayloadCMS:

```typescript
// src/access/authenticated.ts
export const authenticated = ({ req: { user } }) => {
  return !!user
}

// src/access/publicRead.ts
export const publicRead = ({ req: { user } }) => {
  if (user) return true
  return {
    _status: { equals: 'published' }
  }
}
```

---

## 📊 Flow Diagrams

### User ทั่วไปเข้าถึงหน้าเว็บ
```
User → Browse Website → Next.js Frontend
                            ↓
                    Fetch Data (with API Key)
                            ↓
                    /api/products (Protected)
                    /api/categories (Protected)
                    /api/media/file/* (Public)
                            ↓
                    Display Content
```

### External Developer พยายามเรียก API
```
External Request → /api/products (no API Key)
                            ↓
                    Check X-API-Key
                            ↓
                    ❌ 401 Unauthorized
```

### Admin แก้ไขเนื้อหา
```
Admin → Login (/admin/login)
            ↓
    Session Token (Cookie)
            ↓
    Access Admin Panel (/admin)
            ↓
    Edit Products/Categories/Media
            ↓
    Payload Auth Check
            ↓
    ✅ Authorized
```

---

## 🧪 การทดสอบ

### ทดสอบ Media API (Public)
```bash
# ควรได้รูปภาพ (200 OK)
curl http://localhost:3000/api/media/file/your-image.jpg
```

### ทดสอบ Products API (Protected)
```bash
# ไม่มี API Key - ควรได้ 401
curl http://localhost:3000/api/products

# มี API Key - ควรได้ข้อมูล
curl http://localhost:3000/api/products \
  -H "x-api-key: jmc-api-2024-secure-key-xdata24b"
```

### ทดสอบ Admin Panel
```bash
# เข้า Admin ได้ แต่จะ redirect ไปหน้า login
open http://localhost:3000/admin
```

---

## 🚀 Deployment Checklist

### Environment Variables (Vercel/Production)
```env
# Required
NEXT_PUBLIC_API_KEY=your-secure-key-here
PRIVATE_API_KEY=your-secure-key-here
PAYLOAD_SECRET=your-payload-secret-here
DATABASE_URI=your-mongodb-uri
BLOB_STORAGE_URL=your-blob-storage-url

# Optional
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com
```

### Security Recommendations
1. ✅ ใช้ API Key ที่แข็งแรง (min 32 characters)
2. ✅ เปลี่ยน API Key เป็นระยะๆ
3. ✅ ไม่เผย API Key ใน public repositories
4. ✅ ใช้ HTTPS ใน production
5. ✅ Enable Rate Limiting (ถ้าจำเป็น)
6. ✅ Monitor API usage logs

---

## 📝 Summary

| API Endpoint | Protection | Access | Use Case |
|--------------|-----------|---------|----------|
| `/api/products` | X-API-Key | Internal + Valid Key | Get products data |
| `/api/categories` | X-API-Key | Internal + Valid Key | Get categories data |
| `/api/posts` | X-API-Key | Internal + Valid Key | Get posts data |
| `/api/media/file/*` | None (Public) | Everyone | Serve images |
| `/admin` | Session Auth | Admin Only | Manage content |

---

## 🐛 Troubleshooting

### รูปภาพไม่แสดง
- ✅ **แก้ไขแล้ว**: `/api/media/file/*` เป็น public access
- ตรวจสอบ: Network tab ใน Browser DevTools
- ตรวจสอบ: URL ของรูปภาพถูกต้องหรือไม่

### API ส่ง 401 Unauthorized
- ตรวจสอบ: `NEXT_PUBLIC_API_KEY` ใน `.env.local`
- ตรวจสอบ: Client component ส่ง `x-api-key` header หรือไม่
- ตรวจสอบ: API Key ตรงกับ `PRIVATE_API_KEY` หรือไม่

### Admin Login ไม่ได้
- ตรวจสอบ: `PAYLOAD_SECRET` ใน `.env.local`
- ตรวจสอบ: Database connection
- ตรวจสอบ: User account มีอยู่ใน database หรือไม่

---

## 📚 Related Files

### API Routes
- `src/app/api/products/route.ts`
- `src/app/api/categories/route.ts`
- `src/app/api/posts/route.ts`
- `src/app/api/media/file/[filename]/route.ts`

### Access Control
- `src/access/authenticated.ts`
- `src/access/authenticatedOrPublished.ts`
- `src/access/publicRead.ts`

### Components
- `src/components/Media/Image/index.tsx`
- `src/app/(frontend)/products/page.client.tsx`
- `src/app/(frontend)/categories/page.client.tsx`

### Configuration
- `.env.local` (local development)
- `.env.example` (template)
- `src/payload.config.ts` (PayloadCMS config)

---

**Last Updated**: November 20, 2025
**Status**: ✅ Fully Implemented & Working
