import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  try {
    const { filename } = await params
    const payload = await getPayload({ config })

    // Search for media with this filename
    const result = await payload.find({
      collection: 'media',
      where: {
        or: [
          { filename: { equals: filename } },
          { 'sizes.thumbnail.filename': { equals: filename } },
          { 'sizes.card.filename': { equals: filename } },
          { 'sizes.feature.filename': { equals: filename } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    })

    if (result.docs.length === 0) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const media = result.docs[0] as any

    // Redirect to Blob Storage URL
    if (media?.prefix) {
      return NextResponse.redirect(`${media.prefix}/${filename}`, 307)
    }

    // Fallback
    const blobBaseUrl =
      process.env.BLOB_STORAGE_URL || 'https://fzhrisgdjt706ftr.public.blob.vercel-storage.com'
    return NextResponse.redirect(`${blobBaseUrl}/${filename}`, 307)
  } catch (error) {
    console.error('Error serving media file:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Block other methods - Admin Panel only
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'GET' } },
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'GET' } },
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'GET' } },
  )
}
