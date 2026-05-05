import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest } from 'next/server'

// R2 client (ใช้ credentials แบบ server-side เท่านั้น)
const s3 = new S3Client({
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
})

const R2_BUCKET = process.env.R2_BUCKET_NAME || process.env.R2_BUCKET || ''
const R2_PREFIX = 'jmc'

// Vercel Blob public base URL — derived from token
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || ''
const blobStoreId = BLOB_TOKEN.match(/^vercel_blob_rw_([a-z0-9]+)_/i)?.[1]?.toLowerCase() ?? ''
const BLOB_BASE_URL = blobStoreId
  ? `https://${blobStoreId}.public.blob.vercel-storage.com`
  : ''

async function streamToBuffer(body: ReadableStream | AsyncIterable<Uint8Array>): Promise<Buffer> {
  const chunks: Uint8Array[] = []
  for await (const chunk of body as AsyncIterable<Uint8Array>) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params

  if (!filename) {
    return new Response('Not Found', { status: 404 })
  }

  const cacheHeaders = {
    'Cache-Control': 'public, max-age=31536000, immutable',
  }

  // ─── 1. ลอง R2 ก่อน (รูปใหม่) ──────────────────────────────────────────
  if (R2_BUCKET) {
    try {
      const cmd = new GetObjectCommand({
        Bucket: R2_BUCKET,
        Key: `${R2_PREFIX}/${filename}`,
      })
      const obj = await s3.send(cmd)

      if (obj.Body) {
        const buffer = await streamToBuffer(obj.Body as AsyncIterable<Uint8Array>)
        return new Response(buffer, {
          headers: {
            'Content-Type': obj.ContentType ?? 'application/octet-stream',
            'Content-Length': String(obj.ContentLength ?? buffer.length),
            ETag: obj.ETag ?? '',
            ...cacheHeaders,
          },
        })
      }
    } catch (err: unknown) {
      // NoSuchKey = ไฟล์ไม่อยู่ใน R2 → ลอง Blob ต่อ
      const code = (err as { Code?: string; name?: string }).Code ?? (err as { name?: string }).name
      if (code !== 'NoSuchKey' && code !== 'NotFound') {
        console.error('[media/file] R2 error:', code, filename)
      }
    }
  }

  // ─── 2. Fallback → Vercel Blob (รูปเก่า) ────────────────────────────────
  if (BLOB_BASE_URL) {
    // ลองทั้ง encoded และ plain filename เพราะ Blob อาจเก็บแบบ encodeURIComponent
    const blobCandidates = [
      `${BLOB_BASE_URL}/${filename}`,
      `${BLOB_BASE_URL}/${encodeURIComponent(filename)}`,
    ]

    for (const blobUrl of blobCandidates) {
      try {
        const res = await fetch(blobUrl)
        if (res.ok) {
          const buffer = await res.arrayBuffer()
          return new Response(buffer, {
            headers: {
              'Content-Type': res.headers.get('content-type') ?? 'application/octet-stream',
              'Content-Length': String(buffer.byteLength),
              ...cacheHeaders,
            },
          })
        }
      } catch {
        // ลอง candidate ถัดไป
      }
    }
  }

  return new Response('Not Found', { status: 404 })
}
