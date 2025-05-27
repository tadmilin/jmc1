import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const formData = await request.formData()
    
    const uploadedFiles: string[] = []
    const maxFiles = 3
    let fileCount = 0

    // Process each file
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file-') && value instanceof File && fileCount < maxFiles) {
        try {
          // Validate file type
          const allowedTypes = [
            'image/jpeg',
            'image/png', 
            'image/gif',
            'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ]

          if (!allowedTypes.includes(value.type)) {
            continue // Skip unsupported file types
          }

          // Validate file size (5MB max)
          const maxSize = 5 * 1024 * 1024 // 5MB
          if (value.size > maxSize) {
            continue // Skip files that are too large
          }

          // Convert File to Buffer
          const bytes = await value.arrayBuffer()
          const buffer = Buffer.from(bytes)

          // Create media document
          const mediaDoc = await payload.create({
            collection: 'media',
            data: {
              alt: value.name,
            },
            file: {
              data: buffer,
              mimetype: value.type,
              name: value.name,
              size: value.size,
            },
          })

          uploadedFiles.push(mediaDoc.id)
          fileCount++
        } catch (fileError) {
          console.error(`Error uploading file ${value.name}:`, fileError)
          // Continue with other files even if one fails
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `อัปโหลดไฟล์สำเร็จ ${uploadedFiles.length} ไฟล์`,
      fileIds: uploadedFiles,
    })

  } catch (error) {
    console.error('Error uploading files:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'File Upload API is working' },
    { status: 200 }
  )
} 