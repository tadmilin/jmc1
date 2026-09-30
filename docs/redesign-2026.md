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

**Concept — "site-ready":** an engineered, confident look built from the shop's real world — concrete, steel, safety orange, and real delivery photos.

- **Palette:** ink `#0B0D10`, concrete `#ECEAE4`, paper `#F7F6F2`, hairline `#D6D3CA`, accent safety-orange `#FF5A1F`. LINE green `#06C755` appears only on LINE actions. Tokens live as CSS variables in `globals.css`; components use the tokens.
- **Type:** Anuphan (Thai + Latin, loopless, via `next/font/google`) for everything; Geist Mono for numbers, coordinates, and small uppercase labels. Large, tight headlines; generous whitespace.
- **Imagery:** real delivery photos in `public/images/deliveries/` (WebP, ≤1600px). Photos with stickers on them are cropped or left out. Brand logos sit in a uniform tile treatment.
- **Motion:** purposeful and restrained — headline mask-reveal on load, scroll-triggered reveals, count-up stats, an animated service-radius map (pulsing store pin, rings, area labels), a brand marquee, step lines that draw on scroll. All motion respects `prefers-reduced-motion`. CSS + a small IntersectionObserver hook; no animation library.
- **Slop checklist** — every section passes all of these: solid surfaces or real photos as backgrounds; headline text in a solid colour; varied section layouts (steps, bento, marquee, map, form) instead of repeated identical icon cards; icons from `lucide-react`; copy that states concrete facts from the table above.

## Information architecture

**Header:** logo · สินค้า · พื้นที่จัดส่ง · คำนวณสี · บทความ · ติดต่อ · phone (mono) · "แอดไลน์" button. Mobile: logo + LINE button + menu sheet. Header links are code-owned (the CMS `header` global is no longer read).

**Mobile action bar:** fixed bottom bar with โทร / แอดไลน์ / ให้โทรกลับ, replacing the three floating circles. Desktop keeps one floating LINE button.

**Home (`src/app/(frontend)/page.tsx`, code-owned, zero CMS reads except category tiles):**
1. Hero — H1 keeps the local keywords (วัสดุก่อสร้าง ตลิ่งชัน ชักพระ 6 ส่งถึงหน้างาน), primary LINE CTA, call CTA, live open/closed status from hours, real hero photo.
2. Proof strip — count-up facts (35+ ปี, 10+ กม., 7 วัน/สัปดาห์) + brand marquee.
3. How ordering works — 01 แอดไลน์/โทร → 02 ส่งรายการหรือรูปแบบงาน → 03 รับใบเสนอราคา → 04 ส่งถึงหน้างาน.
4. Real deliveries — horizontally scrolling gallery of delivery photos with material captions.
5. Categories — bento tiles from CMS categories (links to existing category pages).
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

## Removing Payload CMS — phased

The owner wants to drop the CMS if it is not needed. Content will live in the repo (typed TS/JSON), images in Cloudflare R2, deploy on Railway. Phases keep production working at every step:

1. **Shell off the CMS (current).** Home, header, footer, contact facts, areas, brands and FAQ come from `src/content/*`. Product, category and post pages keep reading Payload through thin adapters in `src/data/*`.
2. **Read-only export.** A script reads products, categories, posts and pages from Mongo (no writes) and writes JSON into `src/content/catalog/`. Adapters switch to the JSON. Image URLs stay `/api/media/file/<filename>`.
3. **Remove Payload.** Delete the `(payload)` route group, collections, plugins, Payload deps and the Mongo dependency; keep `api/media/file` (plain `@aws-sdk/client-s3`). New images are uploaded to R2 by a script. Redirects collection is empty (0 docs), so no redirect migration is needed. Quote requests currently in Mongo are exported before removal.

Phase 2 and 3 start only after the owner confirms who edits content and how often (see Open questions).

## Status

- [x] Branch `redesign-2026` created; agent docs written
- [x] Phase 1 (2026-10-01): tokens + Anuphan font, `src/content/*`, `SiteHeader`, `ContactDock` (mobile bar + desktop LINE pill), code-owned home (`src/components/home/*`), `SiteFooter`, code-owned `/contact`, rebuilt `/service-areas/[area]` (12 areas incl. new บางกอกน้อย, ทวีวัฒนา), JSON-LD from content files, product card "สอบถามราคา" for zero prices, legacy blue/indigo/gray utilities remapped to the ink/stone palette in `tailwind.config.cjs`. `pnpm build` passes; checked at 390px and 1440px.
- [ ] Phase 2: export script + JSON adapters
- [ ] Phase 3: remove Payload

### Where things live (phase 1)

| What | File |
|---|---|
| Contact facts, nav, SEO strings, LINE deep link | `src/content/site.ts` |
| Service areas (+ map coordinates) | `src/content/areas.ts` |
| Brand wall list | `src/content/brands.ts` + logos in `public/brands/` |
| Delivery photos + alt text | `src/content/deliveries.ts` + `public/images/deliveries/` |
| FAQ (also FAQPage JSON-LD) | `src/content/faq.ts` |
| Category tiles (Payload adapter) | `src/data/categories.ts` |
| Motion primitives | `src/components/site/Reveal.tsx`, `CountUp.tsx`, keyframes in `globals.css` |

Unused after phase 1 (kept until phase 3): `src/Header/*`, `src/Footer/*` (CMS globals still exist in admin), `src/components/FloatingButtons`, the CMS `home` page document.

## Open questions for the owner

- Who edits products/prices/articles after the CMS is gone, and how often? (Decides repo files vs. Google Sheet.)
- Is delivery free, and under what conditions? Until answered, copy says "ส่งถึงหน้างาน" without "ฟรี".
- Which brands exactly to show on the brand wall (current list is a proposal).
- Should callback requests also notify the owner outside LINE (LINE Messaging API push or email)? Needs a channel token or SMTP credentials.
