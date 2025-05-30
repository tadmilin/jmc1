// การทดสอบปัญหา Upload ใน Admin Panel
import { config } from 'dotenv'
import { list } from '@vercel/blob'

// โหลด environment variables
config({ path: '.env.local' })

async function diagnoseUploadIssues() {
  console.log('🔍 เริ่มการวินิจฉัยปัญหาการ Upload...\n')

  // 1. ตรวจสอบ Environment Variables
  console.log('1. ตรวจสอบ Environment Variables:')
  const requiredEnvs = [
    'BLOB_READ_WRITE_TOKEN',
    'DATABASE_URI',
    'NEXT_PUBLIC_SERVER_URL',
    'PAYLOAD_SECRET',
  ]

  for (const env of requiredEnvs) {
    const value = process.env[env]
    if (value) {
      console.log(`   ✅ ${env}: ${value.substring(0, 20)}...`)
    } else {
      console.log(`   ❌ ${env}: ไม่พบ`)
    }
  }

  // 2. ทดสอบการเชื่อมต่อ Vercel Blob
  console.log('\n2. ทดสอบการเชื่อมต่อ Vercel Blob Storage:')
  try {
    const blobs = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
    console.log(`   ✅ เชื่อมต่อสำเร็จ - พบไฟล์ ${blobs.blobs.length} ไฟล์`)

    if (blobs.blobs.length > 0) {
      console.log(`   📁 ไฟล์ล่าสุด: ${blobs.blobs[0].pathname}`)
      blobs.blobs.slice(0, 3).forEach((blob, index) => {
        console.log(`      ${index + 1}. ${blob.pathname} (${Math.round(blob.size / 1024)}KB)`)
      })
    }
  } catch (error) {
    console.log(`   ❌ เชื่อมต่อไม่สำเร็จ: ${error.message}`)
  }

  // 3. ตรวจสอบขีดจำกัดของ Vercel
  console.log('\n3. ข้อมูลขีดจำกัด Vercel:')
  console.log('   📊 ขีดจำกัด Server Upload: 4.5MB')
  console.log('   📊 ขีดจำกัด Client Upload: 100MB')
  console.log('   📊 ขีดจำกัดปัจจุบันใน Config: 10MB')

  // 4. วิเคราะห์ปัญหาจาก screenshot
  console.log('\n4. วิเคราะห์ปัญหาจาก Admin Panel:')
  console.log('   🔍 จาก screenshot ที่ให้มา:')
  console.log('      - มี error "There was a problem while uploading the file"')
  console.log('      - อยู่ใน URL: jmc111.vercel.app/admin/collections/products/...')
  console.log('      - กำลัง upload รูปภาพในหน้าสร้าง Product')

  // 5. สาเหตุที่เป็นไปได้
  console.log('\n5. สาเหตุที่เป็นไปได้:')
  console.log('   💡 สาเหตุหลักที่ Upload ไม่เสถียร:')
  console.log('      1. ขนาดไฟล์ใหญ่เกิน 4.5MB (ใช้ clientUploads แก้แล้ว)')
  console.log('      2. Network timeout ระหว่าง upload')
  console.log('      3. CORS/CSRF policy blocking')
  console.log('      4. Blob storage quota เต็ม')
  console.log('      5. Token หมดอายุหรือไม่ถูกต้อง')
  console.log('      6. ปัญหา MIME type ไม่รองรับ')

  console.log('\n   🔧 แนวทางแก้ไขที่แนะนำ:')
  console.log('      ✅ 1. ตรวจสอบขนาดไฟล์ก่อน upload (< 2MB สำหรับรูปภาพ)')
  console.log('      ✅ 2. ใช้ clientUploads: true (เปิดแล้ว)')
  console.log('      ✅ 3. เพิ่ม timeout ในการ upload')
  console.log('      ✅ 4. ปรับปรุง error handling')
  console.log('      ✅ 5. ลองอัด/ลดขนาดรูปภาพก่อน upload')

  // 6. ขั้นตอนการทดสอบ
  console.log('\n6. ขั้นตอนการทดสอบที่แนะนำ:')
  console.log('   📝 วิธีทดสอบ:')
  console.log('      1. ลองอัปโหลดรูปภาพขนาดเล็ก (< 500KB)')
  console.log('      2. ตรวจสอบ Network tab ใน Browser DevTools')
  console.log('      3. ดู Console logs หา JavaScript errors')
  console.log('      4. ทดสอบใน Development mode ก่อน')
  console.log('      5. ลองอัปโหลดไฟล์ประเภทต่างๆ แยกกัน')

  console.log('\n✅ การวินิจฉัยเสร็จสิ้น')
  console.log('\n📋 สรุป: ปัญหามักจะเกิดจากขนาดไฟล์หรือ network issues')
  console.log('💡 แนะนำ: ลองอัปโหลดไฟล์ขนาดเล็กก่อน และตรวจสอบ browser console')
}

// รันการวินิจฉัย
diagnoseUploadIssues().catch(console.error)
