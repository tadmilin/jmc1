# ContentGridBlock

## ภาพรวม

ContentGridBlock เป็น component สำหรับแสดงเนื้อหาในรูปแบบ grid layout โดยสามารถดึงข้อมูลจาก 3 แหล่งหลัก:

1. **เนื้อหาที่กำหนดเอง** - สร้างและจัดการเนื้อหาเองผ่าน admin dashboard
2. **บทความล่าสุด** - ดึงข้อมูลจาก Posts collection ของ Payload CMS
3. **ผลิตภัณฑ์** - ดึงข้อมูลจาก Products collection ของ Payload CMS

## คุณสมบัติหลัก

### การตั้งค่าเนื้อหา
- ✅ หัวข้อหลักและคำอธิบายแบบ rich text
- ✅ เลือกประเภทเนื้อหา (custom/posts/products)
- ✅ กรองบทความตามหมวดหมู่
- ✅ จำกัดจำนวนรายการที่แสดง

### การแสดงผล
- ✅ Grid layout ที่ responsive
- ✅ เลือกจำนวนคอลัมน์ (2, 3, 4, หรือ auto)
- ✅ รูปภาพพร้อม lazy loading
- ✅ Hover effects และ animations

### การจัดการข้อผิดพลาด
- ✅ Loading states ที่สวยงาม
- ✅ Error handling พร้อมปุ่ม retry
- ✅ Empty states ที่แตกต่างตามประเภทเนื้อหา

### การนำทาง
- ✅ Internal และ external links
- ✅ ปุ่ม "ดูทั้งหมด" (ตัวเลือก)
- ✅ SEO-friendly URLs

## โครงสร้างไฟล์

```
ContentGridBlock/
├── Component.tsx     # React component หลัก
├── config.ts         # Payload CMS block configuration
├── types.ts          # TypeScript type definitions
├── constants.ts      # ค่าคงที่และการตั้งค่า
├── utils.ts          # Utility functions
├── index.tsx         # Export ทั้งหมด
└── README.md         # Documentation นี้
```

## การใช้งาน

### ใน Payload CMS Admin

1. ไปที่หน้าแก้ไข Page
2. เลือกแท็บ "Content"
3. คลิก "Add Block" และเลือก "บทความกริด"
4. กรอกข้อมูลตามต้องการ:

#### เนื้อหาที่กำหนดเอง
- กรอกหัวข้อและคำอธิบาย
- เลือก "เนื้อหาที่กำหนดเอง"
- เพิ่มรายการเนื้อหาพร้อมรูปภาพและลิงก์

#### บทความล่าสุด
- เลือก "ดึงจากบทความล่าสุด"
- เลือกหมวดหมู่ (ตัวเลือก)
- กำหนดจำนวนรายการ

#### ผลิตภัณฑ์
- เลือก "ดึงจากผลิตภัณฑ์"
- กำหนดจำนวนรายการ

### ในโค้ด

```tsx
import { ContentGridBlock } from '@/blocks/ContentGridBlock'

// ใช้ใน block renderer
<ContentGridBlock block={blockData} />
```

## API ที่ใช้

### Posts API
```
GET /api/posts?depth=2&limit=6&sort=-createdAt&where={categories:{in:["category1","category2"]}}
```

### Products API
```
GET /api/products?depth=2&limit=6&sort=-createdAt
```

## การตั้งค่าเริ่มต้น

```typescript
{
  title: 'รวมเรื่องน่ารู้คู่คนรักบ้าน',
  contentType: 'custom',
  limit: 6,
  columns: 'auto',
  showMoreButton: false,
  moreButtonText: 'ดูทั้งหมด'
}
```

## การ Customize

### แก้ไขสไตล์
แก้ไขใน `Component.tsx` ส่วน CSS classes หรือ Tailwind classes

### เพิ่มประเภทเนื้อหาใหม่
1. เพิ่มใน `types.ts` -> `ContentGridBlockProps.contentType`
2. เพิ่มใน `config.ts` -> `contentType.options`
3. เพิ่ม fetch function ใน `Component.tsx`
4. เพิ่มข้อความใน `constants.ts`

### แก้ไข Error Messages
แก้ไขใน `constants.ts` -> `ERROR_MESSAGES` และ `EMPTY_STATE_MESSAGES`

## การ Debug

### ตรวจสอบ API Response
เปิด Developer Tools -> Network tab เพื่อดู API calls

### ตรวจสอบ Console Logs
Component จะ log errors ไปที่ console เมื่อเกิดปัญหา

```javascript
// ตัวอย่าง error logs
console.error('Error fetching posts:', err)
console.error('Content fetch error:', err)
```

## ปัญหาที่พบบ่อย

### ไม่แสดงข้อมูล
1. ตรวจสอบว่ามี Posts/Products ในระบบ
2. ตรวจสอบ API endpoints ทำงานปกติ
3. ตรวจสอบ permissions ของ collections

### รูปภาพไม่แสดง
1. ตรวจสอบ Media collection settings
2. ตรวจสอบ file uploads

### ลิงก์ไม่ทำงาน
1. ตรวจสอบ slug ของ pages/posts
2. ตรวจสอบ routing configuration

## Performance

- ใช้ React.useCallback สำหรับ functions
- ใช้ lazy loading สำหรับรูปภาพ
- API calls มี caching ตาม browser
- Component มี proper dependency arrays

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅  
- Safari: ✅
- Internet Explorer: ❌ (ไม่รองรับ) 