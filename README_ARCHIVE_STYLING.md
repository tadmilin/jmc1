# การปรับแต่ง Archive Block ให้เข้ากับธีม Hero

## สรุปการเปลี่ยนแปลง

### 1. ArchiveBlock Component (`src/blocks/ArchiveBlock/Component.tsx`)
- **เพิ่มการรองรับ colorTheme**: รับ prop `colorTheme` เพื่อปรับสีตามธีมของ Hero
- **ปรับปรุง UI**: ใช้การออกแบบที่ทันสมัยด้วย rounded corners, shadows และ gradients
- **ActionButtons**: ปรับปรุงปุ่มให้มี hover effects และใช้ gradient backgrounds
- **Responsive Design**: ปรับให้ทำงานได้ดีในทุกขนาดหน้าจอ

### 2. Card Component (`src/components/Card/index.tsx`)
- **เพิ่ม colorTheme support**: รองรับธีมสีต่างๆ (light, dark, lightBlue, gradient)
- **ปรับปรุง Visual Design**: 
  - เพิ่ม hover effects (scale, shadow, border glow)
  - ปรับปรุง category badges ให้สวยงาม
  - เพิ่ม gradient overlay บนรูปภาพ
  - ปรับปรุง typography และ spacing
- **Better Image Handling**: แสดง placeholder เมื่อไม่มีรูปภาพ
- **Enhanced Interactions**: เพิ่ม "อ่านเพิ่มเติม" button พร้อม arrow animation

### 3. CollectionArchive Component (`src/components/CollectionArchive/index.tsx`)
- **เพิ่ม colorTheme prop**: ส่งผ่านธีมสีไปยัง Card components
- **ปรับปรุง Grid Layout**: ใช้ responsive grid ที่ดีขึ้น
- **Empty State**: เพิ่มการแสดงผลเมื่อไม่มีข้อมูล

### 4. RenderBlocks Component (`src/blocks/RenderBlocks.tsx`)
- **เพิ่ม colorTheme prop**: รับและส่งผ่านธีมสีไปยัง blocks ต่างๆ
- **Archive Block Integration**: ส่ง colorTheme โดยเฉพาะไปยัง ArchiveBlock

### 5. Page Integration (`src/app/(frontend)/[slug]/page.tsx`)
- **ส่งผ่าน colorTheme**: ส่งธีมสีจาก hero ไปยัง RenderBlocks

### 6. CSS Utilities (`src/app/(frontend)/globals.css`)
- **เพิ่ม line-clamp-3**: สำหรับจำกัดจำนวนบรรทัดของข้อความ

## ธีมสีที่รองรับ

### Light Theme (`colorTheme: 'light'`)
- พื้นหลัง: สีเทาอ่อน (#f9fafb)
- การ์ด: สีขาว
- ข้อความ: สีเทาเข้ม
- ปุ่ม: Gradient สีน้ำเงิน

### Dark Theme (`colorTheme: 'dark'`)
- พื้นหลัง: สีเทาเข้ม (#111827)
- การ์ด: สีเทาเข้ม (#1f2937)
- ข้อความ: สีขาว/เทาอ่อน
- ปุ่ม: Gradient สีน้ำเงิน

### Light Blue Theme (`colorTheme: 'lightBlue'`)
- พื้นหลัง: สีฟ้าอ่อน (#eff6ff)
- การ์ด: สีขาว
- ข้อความ: สีเทาเข้ม

### Gradient Theme (`colorTheme: 'gradient'`)
- พื้นหลัง: Gradient จากฟ้าอ่อนไปน้ำเงินอ่อน
- การ์ด: สีขาว
- ข้อความ: สีเทาเข้ม

## Features ใหม่

### ActionButtons
- **ดูสินค้าทั้งหมด**: ลิงก์ไปยัง `/categories/iron`
- **โทรหาเรา**: ลิงก์ `tel:+66123456789`
- **ขอใบเสนอราคา**: ลิงก์ไปยัง `/contact`

### Card Enhancements
- **Hover Effects**: การ์ดจะยกขึ้นและมีเงาเมื่อ hover
- **Category Badges**: แสดงหมวดหมู่ในรูปแบบ badge สวยงาม
- **Image Overlay**: Gradient overlay เมื่อ hover บนรูปภาพ
- **Read More Button**: ปุ่มอ่านเพิ่มเติมพร้อม arrow animation

### Responsive Design
- **Mobile First**: ออกแบบให้ทำงานดีบนมือถือก่อน
- **Flexible Grid**: Grid ที่ปรับตามขนาดหน้าจอ
- **Touch Friendly**: ปุ่มและลิงก์ขนาดเหมาะสมสำหรับการสัมผัส

## การใช้งาน

Archive Block จะใช้ธีมสีเดียวกับ Hero Section โดยอัตโนมัติ:

```tsx
// ใน page.tsx
<RenderHero {...hero} />
<RenderBlocks blocks={layout} colorTheme={hero?.colorTheme || 'light'} />
```

## การปรับแต่งเพิ่มเติม

หากต้องการปรับแต่งเพิ่มเติม สามารถแก้ไขได้ที่:

1. **สี**: แก้ไขใน `getBgClasses()` function ใน ArchiveBlock
2. **ปุ่ม**: แก้ไข `ActionButtons` component
3. **การ์ด**: แก้ไข Card component
4. **Layout**: แก้ไข CollectionArchive component

## ตัวอย่างการแสดงผล

### Light Theme
- พื้นหลังสีเทาอ่อน
- การ์ดสีขาวพร้อมเงา
- ปุ่มสีน้ำเงิน gradient

### Dark Theme  
- พื้นหลังสีเทาเข้ม
- การ์ดสีเทาเข้มพร้อม border สีเทา
- ข้อความสีขาว/เทาอ่อน

การปรับแต่งนี้ทำให้ Archive Block มีความสอดคล้องกับ Hero Section และมี UX ที่ดีขึ้น 