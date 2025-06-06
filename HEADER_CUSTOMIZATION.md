# คู่มือการแก้ไข Header ใน Payload Admin Dashboard

## ภาพรวม
ตอนนี้คุณสามารถแก้ไขส่วน Header ของเว็บไซต์ได้ผ่าน Payload Admin Dashboard โดยไม่ต้อง hardcode ในโค้ด

## วิธีการเข้าถึง
1. เข้าสู่ระบบ Payload Admin ที่ `http://localhost:3000/admin`
2. ไปที่เมนู **Globals** > **Header**

## ฟีเจอร์ที่สามารถแก้ไขได้

### 1. โลโก้และข้อมูลบริษัท
- **รูปโลโก้**: อัปโหลดรูปโลโก้ของคุณเอง (ถ้าไม่ใส่จะใช้โลโก้เริ่มต้น)
- **ชื่อบริษัท (ตัวใหญ่)**: ข้อความหลักที่แสดงข้างโลโก้ (เริ่มต้น: "JMC")
- **ชื่อบริษัท (ตัวเล็ก)**: ข้อความรองที่แสดงใต้ชื่อหลัก (เริ่มต้น: "จงมั่นคงค้าวัสดุ")
- **สีพื้นหลังโลโก้**: รหัสสี Hex สำหรับพื้นหลังโลโก้ SVG (เริ่มต้น: #1E40AF)
- **สีชื่อบริษัท**: รหัสสี Hex สำหรับข้อความชื่อบริษัท (เริ่มต้น: #1E40AF)

### 2. เมนูนำทาง (Nav Items)
- เพิ่ม/ลบ/แก้ไขรายการเมนู
- กำหนดลิงก์ไปยังหน้าต่างๆ หรือ URL ภายนอก
- สามารถมีได้สูงสุด 6 รายการ

## ตัวอย่างการใช้งาน

### การเปลี่ยนโลโก้
1. ไปที่ **โลโก้และข้อมูลบริษัท**
2. คลิก **รูปโลโก้** > **Choose File**
3. อัปโหลดรูปโลโก้ใหม่ (แนะนำขนาด 40x40 หรือ 80x80 พิกเซล)
4. บันทึกการเปลี่ยนแปลง

### การเปลี่ยนชื่อบริษัท
1. แก้ไขช่อง **ชื่อบริษัท (ตัวใหญ่)** เป็นชื่อที่ต้องการ
2. แก้ไขช่อง **ชื่อบริษัท (ตัวเล็ก)** เป็นคำอธิบายหรือสโลแกน
3. บันทึกการเปลี่ยนแปลง

### การเปลี่ยนสี
1. ใส่รหัสสี Hex ในช่อง **สีพื้นหลังโลโก้** (เช่น #FF0000 สำหรับสีแดง)
2. ใส่รหัสสี Hex ในช่อง **สีชื่อบริษัท** (เช่น #000000 สำหรับสีดำ)
3. บันทึกการเปลี่ยนแปลง

### การเพิ่มเมนูใหม่
1. ไปที่ส่วน **Nav Items**
2. คลิก **Add Nav Item**
3. ใส่ชื่อเมนูและลิงก์
4. บันทึกการเปลี่ยนแปลง

## หมายเหตุ
- การเปลี่ยนแปลงจะมีผลทันทีหลังจากบันทึก
- หากไม่อัปโหลดรูปโลโก้ ระบบจะใช้โลโก้ SVG เริ่มต้น
- รหัสสีต้องเป็นรูปแบบ Hex (#RRGGBB) เช่น #1E40AF, #FF0000, #00FF00
- ข้อมูลทั้งหมดจะถูกบันทึกในฐานข้อมูลและไม่ต้อง hardcode ในโค้ด

## การแก้ไขปัญหา
หากพบปัญหา:
1. ตรวจสอบว่าบันทึกการเปลี่ยนแปลงแล้ว
2. รีเฟรชหน้าเว็บ
3. ตรวจสอบรหัสสีว่าถูกต้องหรือไม่
4. ตรวจสอบขนาดไฟล์รูปโลโก้ (ไม่ควรเกิน 12MB)

## ตำแหน่งที่แสดงผล
- **โลโก้และชื่อบริษัท**: แสดงที่มุมซ้ายบนของหน้าเว็บ
- **เมนูนำทาง**: แสดงที่ด้านขวาของ Header (Desktop) หรือในเมนู Hamburger (Mobile) 