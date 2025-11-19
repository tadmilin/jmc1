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

    // Fallback: Try direct Blob Storage URL
    const blobUrl = `https://fzhrisgdjt706ftr.public.blob.vercel-storage.com/${filename}`
    return NextResponse.redirect(blobUrl, 307)
  } catch (error) {
    console.error('Error serving media file:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
