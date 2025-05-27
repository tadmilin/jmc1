# คู่มือการใช้งาน Social Media Buttons

## สิ่งที่เปลี่ยนแปลง

### ปัญหาเดิม:
- Social Media Buttons รวมอยู่ใน categories dropdown
- หายไปใน mobile mode เพราะ `hidden lg:block`

### การแก้ไข:
✅ **แยก Social Media Buttons ออกจาก categories** เป็นส่วนต่างหาก  
✅ **Desktop**: แสดงใน sidebar ใต้ categories  
✅ **Mobile**: แสดงในส่วนกลางหลังจาก Hero content  
✅ **Design**: รักษาการออกแบบที่สวยงามไว้

## การใช้งาน Admin Panel

### 1. เข้าไปที่ Admin Panel
```
http://localhost:3000/admin
```

### 2. แก้ไขหน้า Home
- ไปที่ **Collections** → **Pages**
- เลือก **Home page**
- หาส่วน **Hero** settings

### 3. เพิ่ม Social Media Buttons
ในส่วน **Hero** จะมีฟิลด์ **"ปุ่มโซเชียลมีเดีย"**:

| ฟิลด์ | คำอธิบาย | ตัวอย่าง |
|-------|----------|-----------|
| **Label** | ข้อความที่แสดง | "ติดต่อทางไลน์" |
| **Icon** | รูปไอคอน | อัปโหลดรูป Line/Facebook/Phone |
| **URL** | ลิงก์ปลายทาง | `https://line.me/ti/p/YOUR_ID` |
| **New Tab** | เปิดแท็บใหม่ | ✅ เปิด / ❌ ไม่เปิด |

### 4. ตัวอย่าง URLs

#### Line Official Account:
```
https://line.me/ti/p/YOUR_LINE_ID
```

#### Facebook Page:
```
https://facebook.com/YOUR_PAGE_NAME
```

#### โทรศัพท์:
```
tel:021234567
```

#### Email:
```
mailto:contact@example.com
```

## การแสดงผลใน Website

### Desktop Mode:
- **Categories**: แสดงใน sidebar ซ้าย
- **Social Media Buttons**: แสดงใน sidebar ซ้าย (ใต้ categories)
- **Layout**: `categories | content | frame`

### Mobile Mode:
- **Categories**: ซ่อนใน mobile
- **Social Media Buttons**: แสดงในส่วนกลางหลัง Hero content
- **Layout**: แนวตั้งทั้งหมด

## ไฟล์ที่เปลี่ยนแปลง

### 1. HighImpact Hero (`/src/heros/HighImpact/index.tsx`)
- แยก `SocialMediaButtons` เป็น component ต่างหาก
- เพิ่ม responsive behavior
- คืนค่า grid layout เดิมให้เรียบง่าย

### 2. MediumImpact Hero (`/src/heros/MediumImpact/index.tsx`)
- แยก Social Media Buttons ออกจาก categories dropdown
- รองรับทั้ง centered และ 2-column layouts

### 3. Hero Config (`/src/heros/config.ts`)
- เพิ่มฟิลด์ `socialMediaButtons` ใน admin panel

## การทดสอบ

### 1. Build Test:
```bash
npm run build
```
✅ สำเร็จ - ไม่มี errors

### 2. Development:
```bash
npm run dev
```
✅ ทำงานได้ปกติ

### 3. Responsive Test:
- เปิด Developer Tools
- ทดสอบ mobile และ desktop views
- ตรวจสอบการแสดงผล Social Media Buttons

## หมายเหตุ

- Social Media Buttons จะแสดงเฉพาะเมื่อมีการเพิ่มข้อมูลใน admin panel
- รองรับได้สูงสุด 5 ปุ่ม (ตามที่กำหนดใน config)
- Icons ควรเป็นไฟล์ขนาดเล็ก เช่น PNG หรือ SVG
- รองรับ dark/light themes

## การแก้ไขปัญหา

### ปัญหา: Social Media Buttons ไม่แสดง
- ตรวจสอบว่ามีข้อมูลใน admin panel
- ตรวจสอบ Hero type เป็น HighImpact หรือ MediumImpact
- ตรวจสอบ browser console สำหรับ errors

### ปัญหา: Layout พัง
- ตรวจสอบ grid layout ใน HighImpact Hero
- ดู responsive classes ในส่วน Social Media Buttons

---
**อัปเดตล่าสุด**: แก้ไข responsive behavior และลดความซับซ้อนของ grid layout 