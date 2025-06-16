import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    
    const body = await request.json()
    console.log('Received quote request:', { ...body, attachments: body.attachments?.length || 0 })
    
    // Extract form data
    const {
      customerName,
      email,
      phone,
      productList,
      additionalNotes,
      attachments = [],
    } = body

    // Validate required fields
    if (!customerName || !email || !phone || !productList) {
      console.log('Validation failed - missing required fields')
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'กรุณากรอกอีเมลที่ถูกต้อง' },
        { status: 400 }
      )
    }

    // Create quote request
    const quoteRequest = await payload.create({
      collection: 'quote-requests',
      data: {
        customerName: customerName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        productList: productList.trim(),
        additionalNotes: additionalNotes?.trim() || '',
        attachments,
        status: 'new',
        source: 'website',
        priority: 'medium',
      },
    })

    console.log('Quote request created successfully:', quoteRequest.id)

    // Success response
    return NextResponse.json({
      success: true,
      message: 'บันทึกคำขอใบเสนอราคาเรียบร้อยแล้ว ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง',
      id: quoteRequest.id,
    })

  } catch (error) {
    console.error('Quote request API error:', error)
    
    return NextResponse.json(
      { 
        error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS if needed
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  )
} 