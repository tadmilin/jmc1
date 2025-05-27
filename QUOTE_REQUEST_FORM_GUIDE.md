# คู่มือฟอร์มขอใบเสนอราคา - จงมีชัยค้าวัสดุ

## ภาพรวม

ระบบฟอร์มขอใบเสนอราคาที่สร้างขึ้นสำหรับเว็บไซต์จงมีชัยค้าวัสดุ ใช้ **Custom Block** ที่สามารถเพิ่มเข้าไปใน Layout ของ Pages ผ่าน Admin Dashboard พร้อมระบบจัดการข้อมูลลูกค้าและการติดตามที่ครบถ้วน

## ฟีเจอร์หลัก

### 1. Quote Request Form Block
- **ข้อมูลส่วนตัว**: ชื่อ-นามสกุล, อีเมล, เบอร์โทรศัพท์
- **รายละเอียดสินค้า**: รายการสินค้าและจำนวน, หมายเหตุเพิ่มเติม
- **การอัปโหลดไฟล์**: รองรับรูปภาพ, PDF, Word (ปรับแต่งได้ 1-10 ไฟล์, ขนาด 1-50MB)
- **การปรับแต่ง**: แก้ไขข้อความ, เปิด/ปิดส่วนต่างๆ ผ่าน Admin Dashboard
- **ไม่มี hardcode**: ทุกอย่างปรับแต่งได้ผ่าน CMS

### 2. ระบบจัดการใน Admin Dashboard
- **Quote Requests Collection**: เก็บข้อมูลคำขอทั้งหมด
- **การจัดกลุ่ม**: จัดกลุ่มใน "ลูกค้า" ใน Admin Panel
- **สถานะการติดตาม**: ใหม่, กำลังดำเนินการ, ส่งใบเสนอราคาแล้ว, ปิดการขาย, ยกเลิก
- **ระดับความสำคัญ**: สูง, ปานกลาง, ต่ำ
- **การมอบหมายงาน**: สามารถมอบหมายให้ user ต่างๆ

### 3. ระบบติดตาม
- **วันที่ติดตาม**: กำหนดวันที่ติดตามลูกค้า
- **มูลค่าประมาณการ**: บันทึกมูลค่าโครงการ
- **ราคาที่เสนอ**: บันทึกราคาที่เสนอให้ลูกค้า
- **บันทึกการติดตาม**: Rich text สำหรับบันทึกการสื่อสาร

### 4. การจัดการเอกสาร
- **ไฟล์แนบ**: รูปภาพหรือเอกสารจากลูกค้า
- **ใบเสนอราคา**: อัปโหลดไฟล์ใบเสนอราคา
- **สัญญา**: อัปโหลดไฟล์สัญญา (เมื่อปิดการขาย)
- **เอกสารที่เกี่ยวข้อง**: เอกสารอื่นๆ

## โครงสร้างไฟล์

### Collections
```
src/collections/QuoteRequests.ts - Collection สำหรับเก็บข้อมูลคำขอ
```

### API Endpoints
```
src/app/api/quote-request/route.ts - API สำหรับรับข้อมูลฟอร์ม
src/app/api/upload/route.ts - API สำหรับอัปโหลดไฟล์
src/app/api/seed/route.ts - API สำหรับ seed ข้อมูล
```

### Blocks
```
src/blocks/QuoteRequestFormBlock/config.ts - Block configuration
src/blocks/QuoteRequestFormBlock/Component.tsx - React component
src/blocks/QuoteRequestFormBlock/index.tsx - Export file
src/blocks/Form/FileUpload/index.tsx - File upload component
```

### Pages
```
src/app/(frontend)/quote-request-standalone/page.tsx - หน้าทดสอบฟอร์ม
```

## การใช้งาน

### 1. การเพิ่มฟอร์มในหน้าเว็บ
1. เข้า Admin Panel: `/admin`
2. ไปที่ "Collections" > "Pages"
3. สร้างหน้าใหม่หรือแก้ไขหน้าที่มีอยู่
4. ในส่วน "Content" > "Add Layout"
5. เลือก "ฟอร์มขอใบเสนอราคา" (Quote Request Form Block)
6. ปรับแต่งการตั้งค่าตามต้องการ
7. บันทึกและ Publish

### 2. การจัดการคำขอใน Admin
1. เข้า Admin Panel: `/admin`
2. ไปที่ "ลูกค้า" > "Quote Requests"
3. ดูรายการคำขอทั้งหมด
4. คลิกเพื่อดูรายละเอียดและจัดการ

### 3. การติดตาม
1. เปิดคำขอที่ต้องการ
2. อัปเดตสถานะ
3. เพิ่มบันทึกการติดตาม
4. อัปโหลดเอกสารที่เกี่ยวข้อง

## การตั้งค่า

### 1. Dependencies ที่จำเป็น
```bash
npm install react-dropzone zod @hookform/resolvers
```

### 2. การ Seed ข้อมูล
```bash
# ผ่าน API
POST /api/seed

# หรือผ่าน Admin Panel
ไปที่ Settings > Seed Database
```

### 3. การตั้งค่าอีเมล
อัปเดตการตั้งค่าอีเมลใน `src/endpoints/seed/quote-request-form.ts`:
- `emailFrom`: อีเมลผู้ส่ง
- `emailTo`: อีเมลผู้รับ (admin)

## การปรับแต่ง

### 1. การปรับแต่งฟอร์มผ่าน Admin
ทุกการตั้งค่าสามารถปรับแต่งได้ผ่าน Admin Dashboard:
- หัวข้อฟอร์ม
- คำอธิบาย
- เปิด/ปิดคำแนะนำการใช้งาน
- เปิด/ปิดข้อมูลการติดต่อ
- จำนวนไฟล์สูงสุด (1-10)
- ขนาดไฟล์สูงสุด (1-50MB)
- ประเภทไฟล์ที่อนุญาต
- ข้อความปุ่มส่ง
- ข้อความเมื่อส่งสำเร็จ
- ข้อมูลการติดต่อ

### 2. เพิ่มฟิลด์ใหม่ในฟอร์ม
หากต้องการเพิ่มฟิลด์ใหม่ ต้องแก้ไข:

1. **Block Config** (`src/blocks/QuoteRequestFormBlock/config.ts`):
```typescript
{
  name: 'company',
  type: 'text',
  label: 'ชื่อบริษัท',
  defaultValue: '',
}
```

2. **Component** (`src/blocks/QuoteRequestFormBlock/Component.tsx`):
เพิ่มฟิลด์ในฟอร์มและ validation schema

3. **Collection** (`src/collections/QuoteRequests.ts`):
```typescript
{
  name: 'company',
  type: 'text',
  label: 'ชื่อบริษัท',
}
```

### 3. การปรับแต่งการอัปโหลดไฟล์
แก้ไขใน `src/blocks/Form/FileUpload/index.tsx`:
- `maxFiles`: จำนวนไฟล์สูงสุด
- `maxFileSize`: ขนาดไฟล์สูงสุด
- `acceptedFileTypes`: ประเภทไฟล์ที่รองรับ

## การแก้ไขปัญหา

### 1. Block ไม่แสดงใน Admin
- ตรวจสอบว่าได้เพิ่ม QuoteRequestFormBlock ใน Pages collection แล้ว
- ตรวจสอบ import ใน `src/collections/Pages/index.ts`
- ตรวจสอบ RenderBlocks ใน `src/blocks/RenderBlocks.tsx`

### 2. อัปโหลดไฟล์ไม่ได้
- ตรวจสอบขนาดไฟล์ (สูงสุด 5MB)
- ตรวจสอบประเภทไฟล์ที่รองรับ
- ตรวจสอบการตั้งค่า upload ใน `payload.config.ts`

### 3. ฟอร์มไม่ทำงาน
- ตรวจสอบ API endpoints (/api/quote-request, /api/upload)
- ตรวจสอบ QuoteRequests collection
- ตรวจสอบ console ใน browser สำหรับ error

## URL สำคัญ

- **Admin Panel**: `/admin`
- **ฟอร์มขอใบเสนอราคา**: `/quote-request`
- **ทดสอบฟอร์ม**: `/quote-request-standalone`
- **API ฟอร์ม**: `/api/quote-request`
- **API อัปโหลด**: `/api/upload`
- **API Seed**: `/api/seed`

## การบำรุงรักษา

### 1. การสำรองข้อมูล
- สำรองฐานข้อมูล MongoDB
- สำรองไฟล์ที่อัปโหลด

### 2. การตรวจสอบประสิทธิภาพ
- ตรวจสอบขนาดไฟล์ที่อัปโหลด
- ทำความสะอาดข้อมูลเก่า

### 3. การอัปเดต
- อัปเดต Payload CMS และ dependencies
- ทดสอบฟังก์ชันการทำงานหลังอัปเดต

---

สร้างโดย: AI Assistant
วันที่: 2024
เวอร์ชัน: 1.0 