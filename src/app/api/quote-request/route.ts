import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    const data = await request.json()

    // Validate required fields
    if (!data.customerName || !data.email || !data.phone || !data.productList) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' }, { status: 400 })
    }

    // Create quote request
    const result = await payload.create({
      collection: 'quote-requests',
      data: {
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        productList: data.productList,
        additionalNotes: data.additionalNotes || '',
        attachments: data.attachments || [],
        status: 'new',
        priority: 'medium',
        source: 'website',
        followUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // ติดตาม 1 วันข้างหน้า
      },
    })

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
