import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  try {
    const { filename } = await params

    // Get Payload instance
    const payload = await getPayload({ config })

    // **สำคัญ: Media files ต้องเป็น public เพื่อให้ browser แสดงรูปภาพได้**
    // ไม่ต้องเช็ค authentication หรือ API key สำหรับ media files
    // เพราะ <img> tags ไม่สามารถส่ง headers หรือ credentials ได้

    // หาก admin ต้องการลบหรือแก้ไข media จะทำผ่าน Payload Admin Panel
    // ที่มีการตรวจสอบ session authentication อยู่แล้ว

    // Search for media with this filename
    const result = await payload.find({
      collection: 'media',
      where: {
        or: [
          { filename: { equals: filename } },
          {
            'sizes.thumbnail.filename': { equals: filename },
          },
          {
            'sizes.card.filename': { equals: filename },
          },
          {
            'sizes.feature.filename': { equals: filename },
          },
        ],
      },
      limit: 1,
      overrideAccess: true, // Bypass Payload access control
    })

    if (result.docs.length === 0) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const media = result.docs[0] as any

    // Check if file has prefix (Blob Storage URL)
    if (media?.prefix) {
      // Redirect to Blob Storage URL
      const blobUrl = `${media.prefix}/${filename}`
      return NextResponse.redirect(blobUrl, 307)
    }

    // Fallback: Try direct Blob Storage URL using environment variable or known base
    const blobBaseUrl =
      process.env.BLOB_STORAGE_URL || 'https://fzhrisgdjt706ftr.public.blob.vercel-storage.com'
    const blobUrl = `${blobBaseUrl}/${filename}`
    return NextResponse.redirect(blobUrl, 307)
  } catch (error) {
    console.error('Error serving media file:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ❌ ป้องกัน POST, PUT, PATCH, DELETE methods
// เฉพาะ GET เท่านั้นที่สามารถใช้ได้ (อ่านไฟล์เท่านั้น)
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed. Use Admin Panel to upload media.' },
    { status: 405, headers: { Allow: 'GET' } },
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use Admin Panel to update media.' },
    { status: 405, headers: { Allow: 'GET' } },
  )
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Method not allowed. Use Admin Panel to update media.' },
    { status: 405, headers: { Allow: 'GET' } },
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use Admin Panel to delete media.' },
    { status: 405, headers: { Allow: 'GET' } },
  )
}
