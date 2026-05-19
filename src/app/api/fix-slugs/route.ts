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

  type Change = { collection: string; id: string; title: string; oldSlug: string; newSlug: string }
  const fixed: Change[] = []
  let skipped = 0
  const errors: { collection: string; id: string; error: string }[] = []

  const collections = ['categories', 'products'] as const

  for (const col of collections) {
    let page = 1
    while (true) {
      const result = await payload.find({
        collection: col,
        limit: 100,
        page,
        overrideAccess: true,
        select: { id: true, title: true, slug: true },
        depth: 0,
      })

      if (result.docs.length === 0) break

      for (const doc of result.docs) {
        const id = String(doc.id)
        const title = typeof doc.title === 'string' ? doc.title : ''
        const oldSlug = typeof doc.slug === 'string' ? doc.slug : ''
        if (!title) { skipped++; continue }

        const newSlug = format(title)
        if (oldSlug === newSlug) { skipped++; continue }

        if (!isDry) {
          try {
            await payload.update({
              collection: col,
              id,
              data: { slug: newSlug },
              overrideAccess: true,
            })
            fixed.push({ collection: col, id, title, oldSlug, newSlug })
          } catch (e) {
            errors.push({ collection: col, id, error: e instanceof Error ? e.message : String(e) })
          }
        } else {
          fixed.push({ collection: col, id, title, oldSlug, newSlug })
        }
      }

      if (!result.hasNextPage) break
      page++
    }
  }

  const byCollection = fixed.reduce<Record<string, Change[]>>((acc, c) => {
    ;(acc[c.collection] ??= []).push(c)
    return acc
  }, {})

  return NextResponse.json({
    mode: isDry ? 'dry-run (ไม่ได้แก้จริง)' : 'live (แก้แล้ว)',
    fixed: fixed.length,
    skipped,
    errors: errors.length,
    byCollection: Object.fromEntries(
      Object.entries(byCollection).map(([k, v]) => [k, { count: v.length, items: v }])
    ),
    errorDetails: errors,
  }, { status: 200 })
}
