import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    
    const body = await request.json()
    
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
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' },
        { status: 400 }
      )
    }

    // Create quote request
    const quoteRequest = await payload.create({
      collection: 'quote-requests',
      data: {
        customerName,
        email,
        phone,
        productList,
        additionalNotes,
        attachments,
        status: 'new',
        source: 'website',
        priority: 'medium',
      },
    })

    // Success response
    return NextResponse.json({
      success: true,
      message: 'บันทึกคำขอใบเสนอราคาเรียบร้อยแล้ว',
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