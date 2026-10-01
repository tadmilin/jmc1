/**
 * Facebook Page as the photo uploader for the home page.
 *
 * The owner posts on https://www.facebook.com/jmc1990lekmor and adds a hashtag:
 *   #ส่งจริง   → photos go into the "ส่งจริง ทุกวัน" delivery gallery
 *   #พร้อมส่ง  → photos go into the "สินค้าพร้อมส่ง" promo poster row
 *
 * Server-only: import this from page.tsx files, never from client components. The token is read
 * from env and sent as a header, never in the URL. Without env vars, or when the Graph API call
 * fails or times out, every function here returns the static files in src/content instead of
 * throwing, so builds and pages keep working with no Facebook setup at all.
 *
 * Freshness: the Graph responses are cached for REVALIDATE_SECONDS under FACEBOOK_CACHE_TAG; the
 * webhook at /api/facebook/webhook invalidates that tag when the Page posts, so new photos show on
 * the next page view. Setup steps: docs/redesign-2026.md → "Facebook photos".
 */
import { deliveries as staticDeliveries, type Delivery } from '@/content/deliveries'
import { promos as staticPromos, type Promo } from '@/content/promos'

export const FACEBOOK_CACHE_TAG = 'facebook-posts'
export const REVALIDATE_SECONDS = 300

export const DELIVERY_TAG = '#ส่งจริง'
export const PROMO_TAG = '#พร้อมส่ง'

const MAX_DELIVERIES = 16
const MAX_PROMOS = 9
/** Largest photo width to ask next/image to optimise; FB originals can be 2048px+. */
const MAX_IMAGE_WIDTH = 1600
const TIMEOUT_MS = 8000

// ─── Graph API response shapes (only the fields we request) ─────────────────

type GraphImage = { src: string; width?: number; height?: number }
type GraphAttachment = {
  type?: string
  media?: { image?: GraphImage }
  target?: { id?: string }
  subattachments?: { data?: GraphAttachment[] }
}
export type GraphPost = {
  id: string
  message?: string
  created_time?: string
  attachments?: { data?: GraphAttachment[] }
}
/** Response of GET /?ids=<photo ids>&fields=images — every stored size of each photo. */
export type GraphPhotoSizes = Record<string, { images?: { source: string; width: number; height: number }[] }>

export type FacebookShowcase = { deliveries: Delivery[]; promos: Promo[] }

// ─── Pure parsing (no network; covered by the scratch test) ──────────────────

/** Whole-token hashtag match: Thai has no word boundaries, and `#ส่งจริงทุกวัน` must not match `#ส่งจริง`. */
export function hasHashtag(message: string | undefined, tag: string): boolean {
  if (!message) return false
  return message
    .split(/\s+/)
    .map((t) => t.replace(/[.,!?;:)\]"'”’]+$/u, ''))
    .some((t) => t === tag)
}

/** Message without hashtags or links, whitespace collapsed per line. */
export function cleanMessage(message: string | undefined): string {
  if (!message) return ''
  return message
    .replace(/https?:\/\/\S+/g, '')
    .replace(/#\S+/g, '')
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n')
}

function clip(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

function isFacebookCdn(src: string): boolean {
  try {
    const u = new URL(src)
    return u.protocol === 'https:' && (u.hostname === 'fbcdn.net' || u.hostname.endsWith('.fbcdn.net'))
  } catch {
    return false
  }
}

type PhotoRef = { id?: string; src: string }

/** Photo attachments only: a single photo, or every photo of an album. Videos, links and shares are skipped. */
export function photosOf(post: GraphPost): PhotoRef[] {
  const out: PhotoRef[] = []
  for (const a of post.attachments?.data ?? []) {
    const children = a.subattachments?.data
    const list = children && children.length > 0 ? children : [a]
    for (const c of list) {
      const src = c.media?.image?.src
      if (c.type === 'photo' && src && isFacebookCdn(src)) out.push({ id: c.target?.id, src })
    }
  }
  return out
}

/** Pick the largest stored size up to MAX_IMAGE_WIDTH; fall back to the attachment's own image. */
function bestSrc(photo: PhotoRef, sizes: GraphPhotoSizes): string {
  const images = (photo.id && sizes[photo.id]?.images) || []
  const fit = images
    .filter((i) => i.width <= MAX_IMAGE_WIDTH && isFacebookCdn(i.source))
    .sort((a, b) => b.width - a.width)[0]
  return fit?.source ?? photo.src
}

export function parseShowcase(posts: GraphPost[], sizes: GraphPhotoSizes = {}): FacebookShowcase {
  const deliveries: Delivery[] = []
  const promos: Promo[] = []

  for (const post of posts) {
    const isDelivery = hasHashtag(post.message, DELIVERY_TAG)
    const isPromo = hasHashtag(post.message, PROMO_TAG)
    if (!isDelivery && !isPromo) continue

    const text = cleanMessage(post.message)
    const firstLine = text.split('\n')[0] ?? ''

    for (const photo of photosOf(post)) {
      const src = bestSrc(photo, sizes)
      if (isDelivery) {
        deliveries.push({
          src,
          alt: clip(`${text.replace(/\n/g, ' ') || 'งานส่งวัสดุก่อสร้างถึงหน้างาน'} — จงมีชัยค้าวัสดุ ตลิ่งชัน`, 180),
          material: clip(firstLine || 'งานส่งของจริง', 48),
        })
      }
      if (isPromo) {
        const title = clip(firstLine || 'สินค้าพร้อมส่ง', 60)
        promos.push({
          src,
          alt: clip(`${text.replace(/\n/g, ' ') || title} — จงมีชัยค้าวัสดุ ปากซอยชักพระ 6`, 180),
          title,
          lineText: `สนใจ ${title}`,
        })
      }
    }
  }

  return { deliveries, promos }
}

/** Facebook items first; promos replace the static set (a reposted poster must not show twice). */
export function mergeShowcase(fb: FacebookShowcase): FacebookShowcase {
  return {
    deliveries: [...fb.deliveries, ...staticDeliveries].slice(0, MAX_DELIVERIES),
    promos: (fb.promos.length > 0 ? fb.promos : staticPromos).slice(0, MAX_PROMOS),
  }
}

// ─── Network ────────────────────────────────────────────────────────────────

function graphConfig() {
  const pageId = process.env.FB_PAGE_ID
  const token = process.env.FB_PAGE_ACCESS_TOKEN
  if (!pageId || !token) return null
  return { pageId, token, version: process.env.FB_GRAPH_VERSION || 'v26.0' }
}

async function graphGet<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`https://graph.facebook.com/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: REVALIDATE_SECONDS, tags: [FACEBOOK_CACHE_TAG] },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!res.ok) {
    // Graph puts a readable reason in error.message; it never echoes the token.
    const body = (await res.json().catch(() => null)) as { error?: { message?: string } } | null
    throw new Error(`Graph ${res.status}: ${body?.error?.message ?? res.statusText}`)
  }
  return (await res.json()) as T
}

async function fetchFacebookShowcase(): Promise<FacebookShowcase> {
  const cfg = graphConfig()
  if (!cfg) return { deliveries: [], promos: [] }

  const fields =
    'id,message,created_time,attachments{type,media,target,subattachments.limit(30){type,media,target}}'
  const { data: posts = [] } = await graphGet<{ data?: GraphPost[] }>(
    `${cfg.version}/${encodeURIComponent(cfg.pageId)}/posts?fields=${encodeURIComponent(fields)}&limit=50`,
    cfg.token,
  )

  // Attachment images are ~720px wide; ask once for every tagged photo's larger sizes.
  const ids = posts
    .filter((p) => hasHashtag(p.message, DELIVERY_TAG) || hasHashtag(p.message, PROMO_TAG))
    .flatMap(photosOf)
    .map((p) => p.id)
    .filter((id): id is string => Boolean(id))
    .slice(0, 50)
  let sizes: GraphPhotoSizes = {}
  if (ids.length > 0) {
    sizes = await graphGet<GraphPhotoSizes>(`${cfg.version}/?ids=${ids.join(',')}&fields=images`, cfg.token).catch(
      (err: unknown) => {
        console.error('[facebook] photo sizes failed, using attachment images:', (err as Error).message)
        return {}
      },
    )
  }

  return parseShowcase(posts, sizes)
}

/** Delivery gallery + promo posters for the home page: Facebook first, static files as fallback. */
export async function getShowcase(): Promise<FacebookShowcase> {
  try {
    return mergeShowcase(await fetchFacebookShowcase())
  } catch (err) {
    console.error('[facebook] using static photos:', (err as Error).message)
    return mergeShowcase({ deliveries: [], promos: [] })
  }
}
