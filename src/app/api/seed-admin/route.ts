import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // ตรวจสอบว่ามี admin user อยู่แล้วหรือไม่
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'admin@jmc111.com',
        },
      },
    })

    if (users.docs.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Admin user already exists',
        user: users.docs[0],
      })
    }

    // สร้าง admin user ใหม่
    const adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@jmc111.com',
        password: 'admin123!',
        name: 'Admin User',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: adminUser,
    })
  } catch (error) {
    console.error('Error creating admin user:', error)
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
