// สร้าง admin user สำหรับ Payload CMS
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

// โหลด environment variables
dotenv.config({ path: '.env.local' })

async function createAdminUser() {
  let client
  try {
    console.log('🔍 กำลังสร้าง Admin User...')

    const uri = process.env.DATABASE_URI
    if (!uri) {
      throw new Error('❌ DATABASE_URI ไม่ได้ตั้งค่า')
    }

    // สร้าง client
    client = new MongoClient(uri, {
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

    await client.connect()
    const db = client.db()
    const usersCollection = db.collection('users')

    // ตรวจสอบว่ามี admin user อยู่แล้วหรือไม่
    const existingAdmin = await usersCollection.findOne({ email: 'admin@jmc111.com' })
    if (existingAdmin) {
      console.log('✅ Admin user มีอยู่แล้ว')
      return
    }

    // สร้าง admin user ใหม่
    const hashedPassword = await bcrypt.hash('admin123!', 10)

    const adminUser = {
      email: 'admin@jmc111.com',
      password: hashedPassword,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await usersCollection.insertOne(adminUser)
    console.log('✅ สร้าง Admin User สำเร็จ!')
    console.log('📧 Email: admin@jmc111.com')
    console.log('🔑 Password: admin123!')
    console.log('🆔 User ID:', result.insertedId)
  } catch (error) {
    console.error('💥 สร้าง Admin User ล้มเหลว:', error.message)
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
    }
  }
}

createAdminUser()
