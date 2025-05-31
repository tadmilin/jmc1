# คู่มือการใช้งาน Product Variants (ตัวเลือกย่อยของสินค้า)

## ภาพรวม

ระบบ Product Variants ช่วยให้สามารถจัดการสินค้าที่มีตัวเลือกหลากหลายใน 1 รายการได้ เช่น ขนาดต่างๆ สีต่างๆ หรือประเภทต่างๆ

## ฟีเจอร์ที่เพิ่มใหม่

### 1. ฟิลด์ Variants ใน Products Collection
- **ชื่อ/ขนาด/ประเภท**: ชื่อของตัวเลือก (เช่น "4 หุน", "6 หุน")
- **ราคา**: ราคาเฉพาะของตัวเลือกนี้
- **ราคาลดพิเศษ**: ราคาโปรโมชัน (ถ้ามี)
- **จำนวนสต็อก**: จำนวนสินค้าคงเหลือของตัวเลือกนี้
- **รหัสสินค้า (SKU)**: รหัสเฉพาะของตัวเลือกนี้
- **รูปภาพเฉพาะ**: รูปภาพที่แสดงเฉพาะตัวเลือกนี้
- **สถานะ**: สถานะของตัวเลือก (พร้อมขาย/ไม่พร้อมขาย/สินค้าหมด)
- **ตัวเลือกหลัก**: กำหนดให้เป็นตัวเลือกหลักที่แสดงก่อน

### 2. Auto-Management Features
- **สต็อกรวม**: ระบบจะคำนวณสต็อกรวมจากตัวเลือกทั้งหมดอัตโนมัติ
- **ราคาหลัก**: ราคาหลักของสินค้าจะเป็นราคาของตัวเลือกหลัก
- **สถานะอัตโนมัติ**: เมื่อสต็อกหมดจะเปลี่ยนสถานะเป็น "สินค้าหมด" อัตโนมัติ
- **ตัวเลือกหลักอัตโนมัติ**: ถ้าไม่ได้กำหนด จะใช้ตัวเลือกแรกเป็นหลัก

## วิธีการใช้งานใน Admin Panel

### การเพิ่ม Variants
1. เข้าไปแก้ไขสินค้าใน Admin Panel
2. เลื่อนลงไปหาส่วน "ตัวเลือกย่อยของสินค้า"
3. คลิก "Add Item" เพื่อเพิ่มตัวเลือกใหม่
4. กรอกข้อมูลตัวเลือก:
   - ชื่อ/ขนาด/ประเภท (จำเป็น)
   - ราคา (จำเป็น)
   - ราคาลดพิเศษ (ถ้ามี)
   - จำนวนสต็อก
   - รหัสสินค้า SKU (ถ้ามี)
   - อัปโหลดรูปภาพเฉพาะ (ถ้ามี)
   - เลือกสถานะ
   - ติ๊กถูก "ตัวเลือกหลัก" สำหรับตัวเลือกที่ต้องการให้แสดงก่อน

### การจัดการหลายตัวเลือก
- สามารถเพิ่มได้หลายตัวเลือกตามต้องการ
- ลากย้ายได้เพื่อจัดเรียงลำดับ
- ลบตัวเลือกที่ไม่ต้องการได้

## การใช้งานใน Frontend

### 1. Import Utilities
```typescript
import { 
  hasVariants, 
  getActiveVariants, 
  getDefaultVariant,
  getVariantPriceRange,
  formatPriceRange 
} from '@/utilities/variants'
```

### 2. Import Component
```typescript
import VariantSelector from '@/components/VariantSelector'
```

### 3. ตัวอย่างการใช้งาน
```typescript
'use client'

import React, { useState } from 'react'
import { ProductWithVariants, ProductVariant } from '@/utilities/variants'
import VariantSelector from '@/components/VariantSelector'

export function ProductPage({ product }: { product: ProductWithVariants }) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)

  const handleVariantChange = (variant: ProductVariant | null) => {
    setSelectedVariant(variant)
    // อัปเดต URL หรือทำอะไรก็ได้ตามต้องการ
  }

  return (
    <div>
      <h1>{product.title}</h1>
      
      {/* แสดง Variant Selector */}
      <VariantSelector 
        product={product}
        onVariantChange={handleVariantChange}
        className="my-6"
      />
      
      {/* แสดงราคาตามตัวเลือกที่เลือก */}
      {selectedVariant && (
        <div className="price-display">
          <span className="current-price">
            ฿{(selectedVariant.variantSalePrice || selectedVariant.variantPrice).toLocaleString('th-TH')}
          </span>
          {selectedVariant.variantSalePrice && (
            <span className="original-price line-through ml-2">
              ฿{selectedVariant.variantPrice.toLocaleString('th-TH')}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
```

### 4. Utility Functions

#### ตรวจสอบว่าสินค้ามี Variants หรือไม่
```typescript
if (hasVariants(product)) {
  // มี variants
} else {
  // ไม่มี variants
}
```

#### แสดงช่วงราคา
```typescript
const priceRange = getVariantPriceRange(product)
const priceText = formatPriceRange(priceRange)
// ผลลัพธ์: "240 - 280 บาท" หรือ "240 บาท" (ถ้าราคาเดียวกัน)
```

#### ดึงตัวเลือกที่พร้อมขาย
```typescript
const availableVariants = getAvailableVariants(product)
// ได้เฉพาะตัวเลือกที่สถานะ active และมีสต็อก > 0
```

## การแสดงผลในรายการสินค้า

### แสดงช่วงราคา
เมื่อสินค้ามี variants ควรแสดงช่วงราคาแทนราคาเดียว:
- "240 - 350 บาท" (หากมีหลายราคา)
- "240 บาท" (หากราคาเดียวกัน)

### Badge สำหรับหลายตัวเลือก
สามารถเพิ่ม badge แสดงว่ามีตัวเลือกหลายแบบ:
```typescript
{hasVariants(product) && (
  <span className="badge">หลายขนาด</span>
)}
```

## ข้อควรระวัง

1. **ราคาหลัก**: ราคาหลักของสินค้าจะถูกอัปเดตตามตัวเลือกหลักอัตโนมัติ
2. **สต็อกรวม**: สต็อกหลักจะเป็นผลรวมของสต็อกทุกตัวเลือก
3. **รูปภาพ**: หากตัวเลือกไม่มีรูปเฉพาะ จะใช้รูปหลักของสินค้า
4. **SEO**: ควรใช้ structured data เพื่อแสดงข้อมูล variants ให้ search engine

## ตัวอย่างข้อมูล

```json
{
  "title": "ก๊อกบอลสนามล็อคกุญแจ ซันวา",
  "price": 240,
  "variants": [
    {
      "variantName": "4 หุน",
      "variantPrice": 240,
      "variantStock": 10,
      "variantSku": "SUNWA-4HUN",
      "variantStatus": "active",
      "isDefault": true
    },
    {
      "variantName": "6 หุน", 
      "variantPrice": 280,
      "variantStock": 5,
      "variantSku": "SUNWA-6HUN",
      "variantStatus": "active",
      "isDefault": false
    }
  ]
}
```

## การอัปเดตระบบ

หลังจากเพิ่มฟีเจอร์นี้แล้ว:

1. **Restart development server** เพื่อให้ Payload regenerate types
2. **ทดสอบการเพิ่ม variants** ใน Admin Panel
3. **ทดสอบการแสดงผล** ใน Frontend
4. **ตรวจสอบ performance** เมื่อมีข้อมูลเยอะ

## การขยายระบบในอนาคต

สามารถขยายเพิ่มเติมได้:
- **Variant combinations** (เช่น สี + ขนาด)
- **Bulk variant management**
- **Import/Export variants**
- **Variant analytics**
- **Dynamic pricing rules** 