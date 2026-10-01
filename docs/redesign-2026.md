# Redesign 2026 — brief, decisions, plan

Owner requests collected on 2026-10-01. This file is the single source of truth for the rebuild; update the **Status** and **Open questions** sections as work lands.

## Goal

Turn jongmeechai.com from a product catalogue into a **lead-gen** site for a local building-materials shop. Every page pushes the visitor toward one of three actions:

1. **Add LINE** — `https://lin.ee/uSpo9iT` (verified: redirects to `line.me/R/ti/p/@308aoxno`, the OA add-friend link). LINE ID `@308aoxno`.
2. **Call** — `02-434-8319`.
3. **Callback request** — name + phone + optional note. It opens a LINE chat with the OA with the message prefilled (LINE `oaMessage` deep link), so the owner receives it in the LINE OA inbox with no backend. On desktop LINE shows a QR page; the site also shows its own QR of the add-friend link.

Products stay online (239 products, 24 categories) and remain reachable from nav, category tiles and search — they are supporting content for SEO and trust, not the hero.

## Business facts (use these, invent nothing)

| Fact | Value |
|---|---|
| Name | จงมีชัยค้าวัสดุ (JMC) |
| Address | 38,40 ปากซอยชักพระ 6 ถนนชักพระ แขวงตลิ่งชัน เขตตลิ่งชัน กรุงเทพฯ 10170 |
| Geo | 13.780839, 100.462298 |
| Hours | เปิดทุกวัน 07:00–17:00 |
| Phone | 02-434-8319 |
| LINE | @308aoxno · `https://lin.ee/uSpo9iT` |
| Facebook | `https://www.facebook.com/jmc1990lekmor` |
| Experience | ประสบการณ์มากกว่า 35 ปี |
| Delivery | ส่งถึงหน้างาน ใกล้ตลิ่งชัน ส่งได้ไกลกว่า 10 กม. Own fleet: pickups, 6-wheel dump truck, crane truck |
| Dealer | TOA Color World (ศูนย์ผสมสีตามสั่ง) — shown on the shop sign |

Marketing claims in old copy that the owner has **not** confirmed: "ส่งฟรีทุกออเดอร์", per-area delivery minutes (e.g. "ส่งได้ภายใน 20 นาที"). New copy leaves them out until confirmed (see Open questions).

## Design direction

The owner asked for: ล้ำๆ (cutting-edge), clean, modern-2026, beautiful animation, **not AI slop**.

**Concept — "site-ready":** an engineered, confident look built from the shop's real world — concrete, steel, the TOA Color World blue on the shop sign, and real delivery photos.

- **Palette (blue/white, owner request 2026-10-01):** ink (navy) `#0F1938`, concrete `#EBF1FA`, paper `#F9FBFD`, hairline `#D1DBEB`, accent blue `signal` `#2A54DF` — a lighter take on the TOA blue sampled from the shop sign (~`#001078`). `signal-500` is 6.1:1 on white; on navy surfaces use `signal-300` (`#8BA4F9`, 7.2:1) for text and icons. `stone`/`gray` utilities are remapped to Tailwind `slate` so greys stay cool. LINE green `#06C755` appears only on LINE actions. Tokens live in `tailwind.config.cjs` and as CSS variables in `globals.css`; components use the tokens. The token names (`ink`, `signal`, `concrete`) are historical — keep them, change values.
- **Type:** Anuphan (Thai + Latin, loopless, via `next/font/google`) for everything; Geist Mono for numbers, coordinates, and small uppercase labels. Large, tight headlines; generous whitespace.
- **Imagery:** real delivery photos in `public/images/deliveries/` (WebP, ≤1600px). Photos with stickers on them are cropped or left out. Brand logos sit in a uniform tile treatment.
- **Motion:** purposeful and restrained — headline mask-reveal on load, scroll-triggered reveals, count-up stats, an animated service-radius map (pulsing store pin, rings, area labels), a brand marquee, step lines that draw on scroll. All motion respects `prefers-reduced-motion`. CSS + a small IntersectionObserver hook; no animation library.
- **Slop checklist** — every section passes all of these: solid surfaces or real photos as backgrounds; headline text in a solid colour; varied section layouts (steps, bento, marquee, map, form) instead of repeated identical icon cards; icons from `lucide-react`; copy that states concrete facts from the table above.

## Information architecture

**Header:** logo · สินค้า · พื้นที่จัดส่ง · คำนวณสี · บทความ · ติดต่อ · phone (mono) · "แอดไลน์" button. Mobile: logo + LINE button + menu sheet. Header links are code-owned (the CMS `header` global is no longer read).

**Mobile action bar:** fixed bottom bar with โทร / แอดไลน์ / ให้โทรกลับ, replacing the three floating circles. Desktop keeps one floating LINE button.

**Home (`src/app/(frontend)/page.tsx`, code-owned, zero CMS reads except category tiles):**
1. Hero — H1 keeps the local keywords (วัสดุก่อสร้าง ตลิ่งชัน ชักพระ 6 ส่งถึงหน้างาน), primary LINE CTA, call CTA, live open/closed status from hours, real hero photo, count-up facts.
2. Real deliveries ("ส่งจริง ทุกวัน") — horizontally scrolling gallery of delivery photos with material captions, on a white surface so it separates from the navy hero.
3. Promo posters ("สินค้าพร้อมส่ง") — the shop's square Facebook ad creatives as a full-bleed row (1/2/3 per view at phone/tablet/desktop), each opening a prefilled LINE chat. Text is baked into the posters, so they are never cropped.
4. Brand wall — logos in full colour, no hover state needed.
5. Categories — bento tiles from CMS categories (links to existing category pages).

The "how ordering works" steps section was removed from home on owner request (2026-10-01); `HowItWorks` is still used on `/construction-materials-near-me`.

`DeliveryGallery` and `PromoBanner` take their items as props from the page, so a different source (e.g. a Facebook Page loader) can replace the static files without touching the components.
6. Service area — animated radius map + list linking to `/service-areas/[area]` + Google Maps embed + NAP + hours.
7. Callback form + LINE QR card.
8. FAQ — accordion, emitted as `FAQPage` JSON-LD.
9. Final CTA band.

**Footer:** NAP exactly as in the facts table, hours, LINE QR, links to categories, service areas and pages, socials.

**Restyle only (keep routes, data and URLs):** `/products`, `/products/[slug]`, `/categories`, `/categories/[slug]`, `/posts`, `/calculator`, CMS pages (`contact`, `quotation`, `catalogs`, `aboutus`). Product cards get the new tokens and a "สอบถามราคาทาง LINE" CTA; `.payload-richtext` drops its gradient headings.

## Brand wall

"แบรนด์ที่เรามีจำหน่าย" — the brands the shop sells, the same big names Thai Watsadu carries. The list lives in `src/content/brands.ts`; each entry is a name plus an optional logo file in `public/brands/`. Logos come from official or Wikimedia sources or from the five already in CMS media (TPI, Sanwa, ปูนจิงโจ้, TOA, Denzo); an entry without a logo renders as a clean text wordmark tile. Wording is nominative ("แบรนด์ที่เรามีจำหน่าย"), never implying partnership beyond the TOA Color World dealership.

## Local SEO

Target the same zone as the shop's Google Maps pin: ตลิ่งชัน and neighbouring areas — ชักพระ, บางขุนนนท์, สวนผัก, บรมราชชนนี, ปิ่นเกล้า, จรัญสนิทวงศ์, บางพลัด, บางกอกน้อย, ท่าพระ, พระราม 5, บางกรวย.

- `src/content/areas.ts` is the only area list. Area pages, `service-areas-sitemap.xml`, the home service-area section and LocalBusiness `areaServed` all import it.
- JSON-LD: `HardwareStore` (LocalBusiness) with NAP, geo, `openingHoursSpecification` 07:00–17:00 daily, `areaServed`, `sameAs` (Facebook, LINE); `FAQPage` on home; `BreadcrumbList` on area pages. The home layout's old CMS `code` block carried a LocalBusiness snippet — the code-owned version replaces it.
- Keep existing metadata titles/descriptions from `layout.tsx` and `page.tsx` as the baseline; move the site-level strings into `src/content/site.ts` so they no longer need the CMS.
- Photo alt text names the material and the area (e.g. "ส่งเสาเข็มคอนกรีตถึงหน้างาน ย่านตลิ่งชัน").

## Facebook photos

Owner decision (2026-10-01): the Facebook Page https://www.facebook.com/jmc1990lekmor is the uploader for the home page photos — no CMS, no repo commit needed to add a photo.

- **How the owner uses it:** post photos on the Page and put a hashtag in the caption. `#ส่งจริง` puts the photos in the "ส่งจริง ทุกวัน" gallery (newest first, before the static photos, max 16). `#พร้อมส่ง` puts them in the "สินค้าพร้อมส่ง" poster row; when any such post exists, they replace the static posters (max 9). Tags match as whole words, so `#ส่งจริงทุกวัน` does not count. Only photo posts and photo albums are used; videos, links and shares are skipped. The first caption line becomes the card title; hashtags and links are stripped from captions and alt text.
- **How it works:** `src/data/facebook.ts` reads `GET /{page-id}/posts` from the Graph API (v26.0) with a Page token in the `Authorization` header, then one batched `?ids=…&fields=images` call for larger photo sizes (≤1600px; attachment images are only ~720px). Responses are cached for 5 minutes under the tag `facebook-posts`; home and `/construction-materials-near-me` use `revalidate = 300`. Image URLs are `*.fbcdn.net` (allowed in `next.config.mjs`); they are signed and expire, which the 5-minute refresh and next/image's cache cover.
- **Instant updates:** `/api/facebook/webhook` receives the Page `feed` webhook, checks `X-Hub-Signature-256` against `FB_APP_SECRET`, and calls `revalidateTag('facebook-posts')`; the next page view renders fresh (verified locally: MISS then HIT). Comments and reactions are acknowledged but ignored. Cloudflare does not cache HTML here (`cf-cache-status: DYNAMIC`), so nothing else needs purging.
- **Fallback:** with no env vars, a Graph error, or a timeout (8 s), the pages show the static files in `src/content/deliveries.ts` / `promos.ts` and log `[facebook] …` with `console.error` (kept in production builds).
- **Env (Railway service variables, runtime is enough — the Dockerfile does not need them; the build renders the fallback and the first revalidate picks Facebook up):** `FB_PAGE_ID` (numeric id from `/me/accounts`, not the username), `FB_PAGE_ACCESS_TOKEN`, `FB_APP_SECRET`, `FB_WEBHOOK_VERIFY_TOKEN`, optional `FB_GRAPH_VERSION`. See `.env.example`.

### Setup (owner, once)

Permission names below are from Meta's docs (Graph API v26.0, read 2026-10-01): reading Page posts needs a **Page access token** with `pages_read_engagement` and `pages_read_user_content`; Page feed webhooks need `pages_manage_metadata` and `pages_show_list`. Not confirmed from the docs read: whether an app in Development mode receives Page webhooks and whether app review is needed for your own Page — check in the Meta dashboard. If webhooks never arrive, the 5-minute refresh still works.

1. developers.facebook.com → create an app (type Business) with the Facebook account that admins the Page.
2. Graph API Explorer → select the app → User token with `pages_show_list`, `pages_read_engagement`, `pages_read_user_content`, `pages_manage_metadata` → generate, approve for the Page.
3. Make it long-lived: exchange the user token at `/oauth/access_token?grant_type=fb_exchange_token`, then `GET /me/accounts` with the long-lived user token. Take the Page's `id` (→ `FB_PAGE_ID`) and `access_token` (→ `FB_PAGE_ACCESS_TOKEN`; a Page token from a long-lived user token does not expire). Check it in the Access Token Debugger.
4. App settings → Basic → App secret (→ `FB_APP_SECRET`). Pick any random string for `FB_WEBHOOK_VERIFY_TOKEN`.
5. Railway → service variables → add the four values → redeploy.
6. Meta app → Webhooks → object **Page** → callback `https://jongmeechai.com/api/facebook/webhook`, verify token = `FB_WEBHOOK_VERIFY_TOKEN` → subscribe to the `feed` field. If verification fails, check Cloudflare security/bot rules for that path.
7. Subscribe the app to the Page: `POST /{page-id}/subscribed_apps?subscribed_fields=feed` with the Page token (Graph API Explorer works).
8. Test: post a photo on the Page with `#ส่งจริง`, reload the home page.

## Removing Payload CMS — phased

The owner wants to drop the CMS if it is not needed. Content will live in the repo (typed TS/JSON), images in Cloudflare R2, deploy on Railway. Phases keep production working at every step:

1. **Shell off the CMS (current).** Home, header, footer, contact facts, areas, brands and FAQ come from `src/content/*`. Product, category and post pages keep reading Payload through thin adapters in `src/data/*`.
2. **Read-only export.** A script reads products, categories, posts and pages from Mongo (no writes) and writes JSON into `src/content/catalog/`. Adapters switch to the JSON. Image URLs stay `/api/media/file/<filename>`.
3. **Remove Payload.** Delete the `(payload)` route group, collections, plugins, Payload deps and the Mongo dependency; keep `api/media/file` (plain `@aws-sdk/client-s3`). New images are uploaded to R2 by a script. Redirects collection is empty (0 docs), so no redirect migration is needed. Quote requests currently in Mongo are exported before removal.

Phase 2 and 3 start only after the owner confirms who edits content and how often (see Open questions).

## Status

- [x] Branch `redesign-2026` created; agent docs written
- [x] Phase 1 (2026-10-01): tokens + Anuphan font, `src/content/*`, `SiteHeader`, `ContactDock` (mobile bar + desktop LINE pill), code-owned home (`src/components/home/*`), `SiteFooter`, code-owned `/contact`, rebuilt `/service-areas/[area]` (12 areas incl. new บางกอกน้อย, ทวีวัฒนา), JSON-LD from content files, product card "สอบถามราคา" for zero prices, legacy blue/indigo/gray utilities remapped to the ink/stone palette in `tailwind.config.cjs`. `pnpm build` passes; checked at 390px and 1440px.
- [x] Follow-up (2026-10-01): blue/white retheme, steps section off home, delivery gallery moved under the hero, promo poster row, full-colour brand logos. Build passes; checked at 390px and 1440px.
- [x] Facebook photos (2026-10-01): loader + webhook, static fallback. Parser checked against fixture posts; build with dummy env keeps `/` and near-me as 5-minute ISR; webhook verify/signature/revalidate checked locally. Waiting on the owner's Meta app + Railway env (see "Facebook photos → Setup").
- [ ] Phase 2: export script + JSON adapters
- [ ] Phase 3: remove Payload

### Where things live (phase 1)

| What | File |
|---|---|
| Contact facts, nav, SEO strings, LINE deep link | `src/content/site.ts` |
| Service areas (+ map coordinates) | `src/content/areas.ts` |
| Brand wall list | `src/content/brands.ts` + logos in `public/brands/` |
| Delivery photos + alt text | `src/content/deliveries.ts` + `public/images/deliveries/` |
| Promo posters (1:1 ad creatives) | `src/content/promos.ts` + `public/images/promos/` |
| Facebook Page photos (loader + webhook) | `src/data/facebook.ts`, `src/app/api/facebook/webhook/route.ts` |
| FAQ (also FAQPage JSON-LD) | `src/content/faq.ts` |
| Category tiles (Payload adapter) | `src/data/categories.ts` |
| Motion primitives | `src/components/site/Reveal.tsx`, `CountUp.tsx`, keyframes in `globals.css` |

Unused after phase 1 (kept until phase 3): `src/Header/*`, `src/Footer/*` (CMS globals still exist in admin), `src/components/FloatingButtons`, the CMS `home` page document.

## Open questions for the owner

- Who edits products/prices/articles after the CMS is gone, and how often? (Decides repo files vs. Google Sheet.)
- Is delivery free, and under what conditions? Until answered, copy says "ส่งถึงหน้างาน" without "ฟรี".
- Which brands exactly to show on the brand wall (current list is a proposal).
- Should callback requests also notify the owner outside LINE (LINE Messaging API push or email)? Needs a channel token or SMTP credentials.
