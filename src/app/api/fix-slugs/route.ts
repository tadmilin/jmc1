/**
 * One-time slug repair endpoint — ลบทิ้งหลังใช้งาน
 *
 * GET /api/fix-slugs?key=YOUR_PRIVATE_KEY          → fix จริง
 * GET /api/fix-slugs?key=YOUR_PRIVATE_KEY&dry=1    → preview เฉยๆ
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const format = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\p{L}\p{M}\p{N}-]+/gu, '')
    .toLowerCase()

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  const isDry = req.nextUrl.searchParams.get('dry') === '1'

  if (!key || key !== process.env.PRIVATE_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config: configPromise })

  const fixed: { id: string; title: string; oldSlug: string; newSlug: string }[] = []
  const skipped: number[] = []
  const errors: { id: string; error: string }[] = []

  let page = 1
  while (true) {
    const result = await payload.find({
      collection: 'products',
      limit: 100,
      page,
      overrideAccess: true,
      select: { id: true, title: true, slug: true },
      depth: 0,
    })

    if (result.docs.length === 0) break

    for (const product of result.docs) {
      const id = String(product.id)
      const title = typeof product.title === 'string' ? product.title : ''
      const oldSlug = typeof product.slug === 'string' ? product.slug : ''
      if (!title) { skipped.push(0); continue }

      const newSlug = format(title)
      if (oldSlug === newSlug) { skipped.push(0); continue }

      if (!isDry) {
        try {
          await payload.update({
            collection: 'products',
            id,
            data: { slug: newSlug },
            overrideAccess: true,
          })
          fixed.push({ id, title, oldSlug, newSlug })
        } catch (e) {
          errors.push({ id, error: e instanceof Error ? e.message : String(e) })
        }
      } else {
        fixed.push({ id, title, oldSlug, newSlug })
      }
    }

    if (!result.hasNextPage) break
    page++
  }

  return NextResponse.json({
    mode: isDry ? 'dry-run (ไม่ได้แก้จริง)' : 'live (แก้แล้ว)',
    fixed: fixed.length,
    skipped: skipped.length,
    errors: errors.length,
    changes: fixed,
    errorDetails: errors,
  }, { status: 200 })
}
