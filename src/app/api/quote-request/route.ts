import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    const data = await request.json()

    // Debug logging
    console.log('Received data:', {
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      productList: data.productList,
      additionalNotes: data.additionalNotes,
      attachments: data.attachments,
    })

    // Validate required fields - เฉพาะข้อมูลที่จำเป็นจริง ๆ
    const missingFields = []
    if (!data.customerName || data.customerName.trim() === '') missingFields.push('ชื่อและนามสกุล')
    if (!data.email || data.email.trim() === '') missingFields.push('อีเมล')
    if (!data.phone || data.phone.trim() === '') missingFields.push('เบอร์โทรศัพท์')
    if (!data.productList || data.productList.trim() === '') missingFields.push('รายการสินค้า')

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `กรุณากรอกข้อมูลที่จำเป็น: ${missingFields.join(', ')}`,
        },
        { status: 400 },
      )
    }

    // Create quote request
    const result = await payload.create({
      collection: 'quote-requests',
      data: {
        customerName: data.customerName.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        productList: data.productList.trim(),
        additionalNotes: data.additionalNotes || '',
        attachments: data.attachments || [],
        status: 'new',
        priority: 'medium',
        source: 'website',
        followUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // ติดตาม 1 วันข้างหน้า
      },
    })

    console.log('Created quote request:', result.id)

    // ส่งอีเมลแจ้งเตือนให้ admin (ถ้าต้องการ)
    // await sendNotificationEmail(result)

    return NextResponse.json({
      success: true,
      message: 'ส่งคำขอใบเสนอราคาเรียบร้อยแล้ว',
      quoteRequestId: result.id,
    })
  } catch (error) {
    console.error('Error creating quote request:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง' },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Quote Request API is running' })
}
