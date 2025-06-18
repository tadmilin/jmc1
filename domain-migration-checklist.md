# 📋 Domain Migration Checklist

## 🔄 ขั้นตอนการย้ายโดเมนใหม่

### 1. 🌐 Environment Variables ที่ต้องอัปเดต:
```bash
# ใน Vercel Dashboard > Settings > Environment Variables
NEXT_PUBLIC_SERVER_URL="https://your-new-domain.com"
```

### 2. 📁 ไฟล์ที่ต้องแก้ไข:

#### A. `src/middleware.ts` (บรรทัด 17-18):
```typescript
const allowedOrigins = [
  'https://your-new-domain.com',  // เปลี่ยนจาก jmc111.vercel.app
  'https://jmc111-git-main-tadmilins-projects.vercel.app', // เก็บไว้สำหรับ staging
]
```

#### B. `next.config.mjs` (บรรทัด 35):
```javascript
{
  protocol: 'https',
  hostname: 'your-new-domain.com',  // เปลี่ยนจาก jmc111.vercel.app
  port: '',
  pathname: '/api/media/**',
},
```

#### C. `public/robots.txt` (บรรทัด 6, 9-11):
```
Host: https://your-new-domain.com

Sitemap: https://your-new-domain.com/sitemap.xml
Sitemap: https://your-new-domain.com/pages-sitemap.xml
Sitemap: https://your-new-domain.com/posts-sitemap.xml
```

#### D. `src/components/Media/Image/index.tsx` (บรรทัด 62):
```typescript
// อัปเดต URL ใน shouldUseNextImage function
src.includes('your-new-domain.com/api/media/file/') ||
```

### 3. 🔧 Vercel Configuration:
1. เพิ่มโดเมนใหม่ใน Vercel Dashboard
2. ตั้งค่า DNS records
3. ตรวจสอบ SSL certificate
4. อัปเดต environment variables

### 4. ✅ การทดสอบหลังย้ายโดเมน:
- [ ] หน้าแรกโหลดได้ปกติ
- [ ] Admin panel เข้าได้ (`/admin`)
- [ ] API endpoints ทำงาน (`/api/health`)
- [ ] รูปภาพแสดงผลถูกต้อง
- [ ] Quote request form ส่งได้
- [ ] Sitemap generate ถูกต้อง
- [ ] Robots.txt อัปเดตแล้ว

### 5. 🚀 หลังจากย้ายเสร็จ:
- ตั้งค่า 301 redirect จากโดเมนเก่า (ถ้าต้องการ)
- อัปเดต Google Search Console
- แจ้ง Google ให้ re-index
- ตรวจสอบ Analytics tracking

## ⚡ Quick Commands:
```bash
# ตรวจสอบสถานะปัจจุบัน
curl https://your-new-domain.com/api/health

# ตรวจสอบ sitemap
curl https://your-new-domain.com/sitemap.xml

# ตรวจสอบ robots.txt
curl https://your-new-domain.com/robots.txt
```

## 📞 ติดต่อ Support:
หากมีปัญหาในการย้ายโดเมน สามารถตรวจสอบได้ที่:
- Vercel Dashboard Logs
- `/admin/debug` page
- `/api/health` endpoint 