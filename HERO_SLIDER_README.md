# Hero Slider Auto-Play Feature

## ภาพรวม
ระบบสไลด์โชว์อัตโนมัติสำหรับ Hero Section ในเว็บไซต์ JMC ที่มีการเลื่อนภาพอัตโนมัติแบบเห็นได้ชัดเจน

## ฟีเจอร์ที่เพิ่มเข้ามา

### 1. การเลื่อนอัตโนมัติ
- **เปิด/ปิดการเลื่อนอัตโนมัติ**: สามารถเปิดหรือปิดการเลื่อนอัตโนมัติได้จาก Admin Panel
- **ปรับความเร็ว**: มี 3 ระดับความเร็วให้เลือก
  - ช้า (5 วินาที)
  - ปานกลาง (3.5 วินาที) - ค่าเริ่มต้น
  - เร็ว (2.5 วินาที)

### 2. การควบคุมแบบ Interactive
- **หยุดเมื่อ Hover**: สไลด์โชว์จะหยุดเลื่อนเมื่อผู้ใช้เอาเมาส์ไปวางไว้เหนือภาพ
- **คลิกเพื่อเปลี่ยน**: ผู้ใช้สามารถคลิกที่จุด pagination เพื่อเปลี่ยนภาพได้
- **แสดงสถานะ**: มีการแสดงสถานะ "เลื่อนอัตโนมัติ" หรือ "หยุดชั่วคราว" ที่มุมขวาบน

### 3. การเปลี่ยนภาพแบบ Smooth
- **Transition Effect**: ใช้ CSS transition เพื่อให้การเปลี่ยนภาพดูนุ่มนวล
- **Duration**: 700ms สำหรับการเปลี่ยนภาพ
- **Easing**: ease-in-out สำหรับการเคลื่อนไหวที่ธรรมชาติ

## การตั้งค่าใน Admin Panel

### ใน Collections > Pages > Hero Section

1. **เปิดใช้งานการเลื่อนอัตโนมัติ**
   - ติ๊กช่อง "เปิดใช้งานการเลื่อนอัตโนมัติ"
   - ค่าเริ่มต้น: เปิดใช้งาน

2. **เลือกความเร็วในการเลื่อนอัตโนมัติ**
   - ช้า (5 วินาที)
   - ปานกลาง (3.5 วินาที) - แนะนำ
   - เร็ว (2.5 วินาที)

3. **เพิ่มรูปภาพสไลด์โชว์**
   - เพิ่มรูปภาพในส่วน "รูปภาพสไลด์โชว์"
   - สามารถเพิ่มคำอธิบายภาพได้
   - ระบบจะแสดงเฉพาะเมื่อมีรูปภาพมากกว่า 1 รูป

## Hero Types ที่รองรับ

### High Impact Hero
- รองรับการเลื่อนอัตโนมัติ
- แสดงในส่วน MainMediaArea
- มีการแสดงสถานะการเลื่อน

### Medium Impact Hero
- รองรับการเลื่อนอัตโนมัติ
- แสดงในทั้ง centered และ non-centered layout
- มีการแสดงสถานะการเลื่อน

### Low Impact Hero
- ไม่รองรับการเลื่อนอัตโนมัติ (ไม่มี slideImages)

## การทำงานของระบบ

### 1. การเริ่มต้น
```typescript
const [currentSlide, setCurrentSlide] = useState(0)
const [isPaused, setIsPaused] = useState(false)
```

### 2. การเลื่อนอัตโนมัติ
```typescript
useEffect(() => {
  const interval = getSlideInterval()
  if (!hasSlideImages || slideImages.length <= 1 || isPaused || !interval) return

  const timer = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % slideImages.length)
  }, interval)

  return () => clearInterval(timer)
}, [hasSlideImages, slideImages.length, isPaused, enableAutoSlide, autoSlideSpeed])
```

### 3. การหยุดเมื่อ Hover
```typescript
<div
  onMouseEnter={() => setIsPaused(true)}
  onMouseLeave={() => setIsPaused(false)}
>
```

## การแสดงผล

### Pagination Dots
- จุดสีขาว/เทาแสดงตำแหน่งปัจจุบัน
- คลิกเพื่อเปลี่ยนภาพ
- มี animation เมื่อเปลี่ยน

### สถานะการเลื่อน
- แสดงที่มุมขวาบน
- สีเขียว: กำลังเลื่อนอัตโนมัติ
- สีเทา: หยุดชั่วคราว

## การปรับแต่งเพิ่มเติม

### เปลี่ยนความเร็ว
แก้ไขใน `getSlideInterval()` function:
```typescript
const getSlideInterval = () => {
  if (!enableAutoSlide) return null
  switch (autoSlideSpeed) {
    case 'slow': return 5000
    case 'fast': return 2500
    case 'medium':
    default: return 3500
  }
}
```

### เปลี่ยน Transition Duration
แก้ไขใน CSS class:
```typescript
className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
  index === currentSlide ? 'opacity-100' : 'opacity-0'
}`}
```

## หมายเหตุ
- ระบบจะทำงานเฉพาะเมื่อมีรูปภาพมากกว่า 1 รูป
- การเลื่อนอัตโนมัติจะหยุดเมื่อผู้ใช้ hover ไว้เหนือสไลด์โชว์
- สามารถปิดการเลื่อนอัตโนมัติได้จาก Admin Panel
- ระบบรองรับการแสดงผลทั้งบน Desktop และ Mobile 