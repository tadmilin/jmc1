import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const data = await request.json()

    // Validate required fields
    const { fullName, email, phone, productList } = data
    if (!fullName || !email || !phone || !productList) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' },
        { status: 400 }
      )
    }

    // Create quote request
    const quoteRequest = await payload.create({
      collection: 'quote-requests',
      data: {
        customerName: fullName,
        email: email,
        phone: phone,
        productList: productList,
        additionalNotes: data.additionalNotes || '',
        status: 'new',
        priority: 'medium',
        source: 'website',
        attachments: data.attachments || [],
      },
    })

    // Send confirmation email to customer
    try {
      // ส่งอีเมลยืนยันให้ลูกค้า (ถ้ามีการตั้งค่า email)
      // สามารถใช้ Payload's email system หรือ third-party service
      console.log('Quote request created:', quoteRequest.id)
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // ไม่ให้ email error ทำให้การสร้าง quote request ล้มเหลว
    }

    return NextResponse.json({
      success: true,
      message: 'ส่งคำขอใบเสนอราคาเรียบร้อยแล้ว',
      id: quoteRequest.id,
    })

  } catch (error) {
    console.error('Error creating quote request:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Quote Request API is working' },
    { status: 200 }
  )
} 