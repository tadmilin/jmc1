import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    const formData = await request.formData()
    const uploadedFiles: string[] = []

    // รองรับหลายไฟล์
    for (const [key, file] of formData.entries()) {
      if (key.startsWith('file-') && file instanceof File) {
        // ตรวจสอบขนาดไฟล์ (5MB)
        if (file.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: `ไฟล์ ${file.name} มีขนาดใหญ่เกินไป (สูงสุด 5MB)` },
            { status: 400 },
          )
        }

        // ตรวจสอบประเภทไฟล์
        const allowedTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
        ]

        if (!allowedTypes.includes(file.type)) {
          return NextResponse.json(
            { error: `ไฟล์ ${file.name} ไม่ใช่ประเภทที่อนุญาต` },
            { status: 400 },
          )
        }

        try {
          // แปลง File เป็น Buffer สำหรับ Payload
          const fileBuffer = await file.arrayBuffer()
          const buffer = Buffer.from(fileBuffer)

          // อัปโหลดไฟล์ผ่าน Payload
          const result = await payload.create({
            collection: 'media',
            data: {
              alt: file.name,
            },
            file: {
              data: buffer,
              mimetype: file.type,
              name: file.name,
              size: file.size,
            },
          })

          uploadedFiles.push(result.id)
        } catch (uploadError) {
          console.error('Error uploading file:', uploadError)
          return NextResponse.json(
            { error: `ไม่สามารถอัปโหลดไฟล์ ${file.name} ได้` },
            { status: 500 },
          )
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `อัปโหลดไฟล์สำเร็จ ${uploadedFiles.length} ไฟล์`,
      fileIds: uploadedFiles,
    })
  } catch (error) {
    console.error('Error in upload API:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Upload API is running' })
}
