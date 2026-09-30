# จงมีชัยค้าวัสดุ (JMC) — jongmeechai.com

Website of a building-materials shop at ปากซอยชักพระ 6, ตลิ่งชัน, Bangkok. Next.js 15 (App Router) + Payload CMS 3 + MongoDB, Tailwind 3. The site is mid-rebuild on branch `redesign-2026`: it is becoming a **lead-gen** site whose job is to get visitors to add LINE, call, or ask for a callback — products stay online but are secondary.

Read `docs/redesign-2026.md` before touching the home page, header/footer, design tokens, contact info, brand wall, service areas, local SEO, or anything about removing Payload. It holds the brief, the decisions already made, and the phase plan.

## Production guardrails

Production runs on **Railway** (Dockerfile, behind Cloudflare) at `jongmeechai.com`; `jmc111.vercel.app` only redirects there. Treat every environment as production:

- `.env` points `DATABASE_URI` at the **production** MongoDB Atlas cluster, and `.env.local` does not override it. Local `pnpm dev` reads and writes live data. Keep work read-only against the DB: browse, export, never create/update/delete documents, never submit test forms, never call `/next/seed`.
- Products, categories, posts and media are the owner's real catalogue. Keep all of them; hide or de-emphasise in the UI instead of deleting.
- Media lives in a **private** Cloudflare R2 bucket and is served by `src/app/api/media/file/[filename]/route.ts`. Image URLs look like `/api/media/file/<filename>`; keep that route and its URL shape working, Google has indexed them.
- Commit, push, open PRs, or deploy only when the user asks in the current conversation. Pushing a branch can trigger a Railway/Vercel build against production env vars.
- The working tree may contain the user's uncommitted edits. Stage files explicitly by path; leave files you did not change out of your commits.

## Conventions

- Contact facts (phone, LINE, address, hours, geo, map embed) come from `src/content/site.ts` only. Service areas come from `src/content/areas.ts` only; the area pages, sitemap, home page and JSON-LD `areaServed` all read that list.
- UI copy is Thai. Keep the local-SEO wording (ร้านวัสดุก่อสร้างใกล้ฉัน, ตลิ่งชัน, ชักพระ) in titles and H1s.
- Thai labels use the `.kicker` class; `.eyebrow` is Geist Mono, which has no Thai glyphs, so it is for short English/number labels only.
- Tailwind reads `tailwind.config.cjs` (it wins over `tailwind.config.mjs`, which is dead). Its `blue`/`indigo`/`gray` scales are deliberately remapped to the redesign palette.
- Verify UI changes at 390px and 1440px widths, and run `pnpm build` before calling work done. Stop any `pnpm dev` first — a dev server writing into `.next` during a build leaves a broken build. For headless Chrome screenshots pass `--force-prefers-reduced-motion`, otherwise scroll-reveal sections render mid-animation.
