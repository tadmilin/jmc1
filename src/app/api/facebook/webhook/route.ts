import { createHmac, timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'

import { FACEBOOK_CACHE_TAG } from '@/data/facebook'

/**
 * Meta webhook for the Page `feed` field. When the Page posts, the cached Graph responses behind
 * the home page photos are invalidated, so the next page view renders the new post.
 * Env: FB_WEBHOOK_VERIFY_TOKEN (any string, also typed into the Meta app) and FB_APP_SECRET.
 */
export const dynamic = 'force-dynamic'

/** Subscription handshake: echo hub.challenge only when the verify token matches. */
export function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const expected = process.env.FB_WEBHOOK_VERIFY_TOKEN
  if (expected && params.get('hub.mode') === 'subscribe' && params.get('hub.verify_token') === expected) {
    return new Response(params.get('hub.challenge') ?? '', { status: 200, headers: { 'Content-Type': 'text/plain' } })
  }
  return new Response('Forbidden', { status: 403 })
}

/** HMAC over the raw request bytes, exactly as Meta signed them (no decode/re-encode). */
function validSignature(raw: Buffer, header: string | null, secret: string): boolean {
  if (!header?.startsWith('sha256=')) return false
  const given = Buffer.from(header.slice('sha256='.length), 'hex')
  const expected = createHmac('sha256', secret).update(raw).digest()
  return given.length === expected.length && timingSafeEqual(given, expected)
}

type FeedChange = { field?: string; value?: { item?: string } }
type FeedEvent = { object?: string; entry?: { changes?: FeedChange[] }[] }

/** Comments and reactions also arrive on `feed`; they can't change which photos the site shows. */
const IGNORED_ITEMS = new Set(['comment', 'reaction', 'like'])

export async function POST(req: NextRequest) {
  const secret = process.env.FB_APP_SECRET
  const raw = Buffer.from(await req.arrayBuffer())
  if (!secret || !validSignature(raw, req.headers.get('x-hub-signature-256'), secret)) {
    return new Response('Invalid signature', { status: 401 })
  }

  let event: FeedEvent = {}
  try {
    event = JSON.parse(raw.toString('utf8')) as FeedEvent
  } catch {
    // signed but not JSON: nothing to act on; still 200 so Meta doesn't retry
  }

  const changes = (event.entry ?? []).flatMap((e) => e.changes ?? [])
  const relevant = changes.some((c) => c.field === 'feed' && !IGNORED_ITEMS.has(c.value?.item ?? ''))
  if (relevant) revalidateTag(FACEBOOK_CACHE_TAG)

  // Always 200 for a valid signature: Meta retries anything else.
  return new Response(relevant ? 'revalidated' : 'ignored', { status: 200 })
}
