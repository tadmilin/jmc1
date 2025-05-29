// ทดสอบการเชื่อมต่อ MongoDB
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

// โหลด environment variables
dotenv.config({ path: '.env.local' })

async function testDatabaseConnection() {
  try {
    console.log('🔍 กำลังทดสอบการเชื่อมต่อ MongoDB...')

    const uri = process.env.DATABASE_URI
    if (!uri) {
      throw new Error('❌ DATABASE_URI ไม่ได้ตั้งค่า')
    }

    console.log('🌐 MongoDB URI:', uri.replace(/:[^@]*@/, ':***@'))

    // สร้าง client
    const client = new MongoClient(uri, {
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    // ทดสอบการเชื่อมต่อ
    await client.connect()
    console.log('✅ เชื่อมต่อ MongoDB สำเร็จ!')

    // ทดสอบ ping
    const db = client.db()
    await db.admin().ping()
    console.log('✅ Ping MongoDB สำเร็จ!')

    // ตรวจสอบ collections
    const collections = await db.listCollections().toArray()
    console.log(
      '📁 Collections:',
      collections.map((c) => c.name),
    )

    // ปิดการเชื่อมต่อ
    await client.close()
    console.log('🎉 MongoDB พร้อมใช้งาน!')
  } catch (error) {
    console.error('💥 MongoDB มีปัญหา:', error.message)
    process.exit(1)
  }
}

testDatabaseConnection()
