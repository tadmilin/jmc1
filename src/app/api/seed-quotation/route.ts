import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // ตรวจสอบว่ามีหน้า quotation อยู่แล้วหรือไม่
    const existingPage = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'quotation',
        },
      },
      limit: 1,
    })

    if (existingPage.docs.length > 0) {
      // อัปเดตหน้าที่มีอยู่
      const updatedPage = await payload.update({
        collection: 'pages',
        id: existingPage.docs[0].id,
        data: {
          title: 'ขอใบเสนอราคา',
          slug: 'quotation',
          layout: [
            {
              blockType: 'quoteRequestFormBlock',
              title: 'ขอใบเสนอราคา',
              description:
                'กรอกข้อมูลด้านล่างเพื่อขอใบเสนอราคาสินค้าจากเรา ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง',
              showContactInfo: true,
              maxFiles: 3,
              maxFileSize: 5,
              allowedFileTypes: ['image', 'pdf', 'document'],
              submitButtonText: 'ส่งคำขอใบเสนอราคา',
              successMessage:
                'ขอบคุณสำหรับการส่งคำขอใบเสนอราคา ทีมงานของเราจะติดต่อกลับภายใน 24 ชั่วโมง',
              contactInfo: {
                phone: '02-xxx-xxxx',
                email: 'info@jmc.com',
                lineId: '@jmc-materials',
                workingHours: 'จันทร์-ศุกร์ 8:00-17:00 น.',
              },
            },
          ],
          meta: {
            title: 'ขอใบเสนอราคา - จงมีชัยค้าวัสดุ',
            description:
              'ขอใบเสนอราคาสินค้าจากจงมีชัยค้าวัสดุ กรอกข้อมูลและรับใบเสนอราคาภายใน 24 ชั่วโมง',
            keywords: 'ขอใบเสนอราคา, จงมีชัยค้าวัสดุ, วัสดุก่อสร้าง, ราคาวัสดุ',
          },
        },
      })

      return NextResponse.json({
        success: true,
        message: 'อัปเดตหน้า quotation เรียบร้อยแล้ว',
        pageId: updatedPage.id,
      })
    } else {
      // สร้างหน้าใหม่
      const newPage = await payload.create({
        collection: 'pages',
        data: {
          title: 'ขอใบเสนอราคา',
          slug: 'quotation',
          layout: [
            {
              blockType: 'quoteRequestFormBlock',
              title: 'ขอใบเสนอราคา',
              description:
                'กรอกข้อมูลด้านล่างเพื่อขอใบเสนอราคาสินค้าจากเรา ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง',
              showContactInfo: true,
              maxFiles: 3,
              maxFileSize: 5,
              allowedFileTypes: ['image', 'pdf', 'document'],
              submitButtonText: 'ส่งคำขอใบเสนอราคา',
              successMessage:
                'ขอบคุณสำหรับการส่งคำขอใบเสนอราคา ทีมงานของเราจะติดต่อกลับภายใน 24 ชั่วโมง',
              contactInfo: {
                phone: '02-xxx-xxxx',
                email: 'info@jmc.com',
                lineId: '@jmc-materials',
                workingHours: 'จันทร์-ศุกร์ 8:00-17:00 น.',
              },
            },
          ],
          meta: {
            title: 'ขอใบเสนอราคา - จงมีชัยค้าวัสดุ',
            description:
              'ขอใบเสนอราคาสินค้าจากจงมีชัยค้าวัสดุ กรอกข้อมูลและรับใบเสนอราคาภายใน 24 ชั่วโมง',
            keywords: 'ขอใบเสนอราคา, จงมีชัยค้าวัสดุ, วัสดุก่อสร้าง, ราคาวัสดุ',
          },
        },
      })

      return NextResponse.json({
        success: true,
        message: 'สร้างหน้า quotation เรียบร้อยแล้ว',
        pageId: newPage.id,
      })
    }
  } catch (error) {
    console.error('Error creating/updating quotation page:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการสร้างหน้า quotation' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Quotation page seeder API',
    usage: 'POST to create/update quotation page with QuoteRequestFormBlock',
  })
}
