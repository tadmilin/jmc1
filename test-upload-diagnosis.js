// การทดสอบปัญหา Upload ใน Admin Panel
const fs = require('fs')
const fetch = require('node-fetch')

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
    const { list } = require('@vercel/blob')
    const blobs = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
    console.log(`   ✅ เชื่อมต่อสำเร็จ - พบไฟล์ ${blobs.blobs.length} ไฟล์`)

    if (blobs.blobs.length > 0) {
      console.log(`   📁 ไฟล์ล่าสุด: ${blobs.blobs[0].pathname}`)
    }
  } catch (error) {
    console.log(`   ❌ เชื่อมต่อไม่สำเร็จ: ${error.message}`)
  }

  // 3. ตรวจสอบขีดจำกัดของ Vercel
  console.log('\n3. ข้อมูลขีดจำกัด Vercel:')
  console.log('   📊 ขีดจำกัด Server Upload: 4.5MB')
  console.log('   📊 ขีดจำกัด Client Upload: 100MB')
  console.log('   📊 ขีดจำกัดปัจจุบันใน Config: 10MB')

  // 4. ข้อแนะนำในการแก้ไข
  console.log('\n4. ข้อแนะนำการแก้ไข:')
  console.log('   💡 สาเหตุหลักที่ Upload ไม่เสถียร:')
  console.log('      - ขนาดไฟล์ใหญ่เกิน 4.5MB (ใช้ clientUploads)')
  console.log('      - Network timeout ระหว่าง upload')
  console.log('      - CORS policy blocking')
  console.log('      - Blob storage quota เต็ม')

  console.log('\n   🔧 แนวทางแก้ไข:')
  console.log('      1. ตรวจสอบขนาดไฟล์ก่อน upload')
  console.log('      2. ใช้ clientUploads: true (ปัจจุบันเปิดแล้ว)')
  console.log('      3. เพิ่ม error handling ใน admin panel')
  console.log('      4. ตรวจสอบ network connection')

  // 5. สร้างไฟล์ทดสอบขนาดต่างๆ
  console.log('\n5. สถิติการ Upload ที่แนะนำ:')
  console.log('   📈 ขนาดไฟล์ที่แนะนำ:')
  console.log('      - รูปภาพ: < 2MB')
  console.log('      - PDF: < 5MB')
  console.log('      - ไฟล์อื่นๆ: < 10MB')

  console.log('\n✅ การวินิจฉัยเสร็จสิ้น')
}

// รันการวินิจฉัย
if (require.main === module) {
  diagnoseUploadIssues().catch(console.error)
}

module.exports = { diagnoseUploadIssues }
