'use client'

import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { LineIcon } from '@/components/site/icons'
import { Reveal } from '@/components/site/Reveal'
import type { Promo } from '@/content/promos'
import { lineMessageUrl, site } from '@/content/site'

/**
 * Full-bleed row of square promo posters: 1 per view on phones, 2 on tablets, 3 on desktop.
 * More than fit scroll sideways with snap; the dots only show while the row overflows.
 */
export function PromoBanner({ items }: { items: Promo[] }) {
  const track = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)
  const [overflow, setOverflow] = useState(false)

  const update = useCallback(() => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('li')
    const w = card ? card.getBoundingClientRect().width : el.clientWidth
    setActive(Math.round(el.scrollLeft / Math.max(w, 1)))
    setOverflow(el.scrollWidth - el.clientWidth > 4)
  }, [])

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [update])

  const goTo = (i: number) => {
    const el = track.current
    const card = el?.querySelectorAll('li')[i]
    if (el && card) el.scrollTo({ left: card.offsetLeft, behavior: 'smooth' })
  }

  if (items.length === 0) return null

  return (
    <section aria-labelledby="promos-title" className="bg-ink text-paper">
      <div className="container-x">
        <Reveal className="flex flex-col justify-between gap-6 py-14 sm:flex-row sm:items-end sm:py-16">
          <div>
            <p className="eyebrow text-signal-300">Ready to ship</p>
            <h2
              id="promos-title"
              className="mt-4 text-[clamp(1.9rem,4.2vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.03em]"
            >
              สินค้าพร้อมส่ง ทักแชทสั่งได้เลย
            </h2>
          </div>
          <a
            href={site.line.addUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-line w-full sm:w-auto"
          >
            <LineIcon className="h-6 w-6 text-white" />
            แอดไลน์ {site.line.id}
          </a>
        </Reveal>
      </div>

      <ul
        ref={track}
        onScroll={update}
        className="no-scrollbar flex snap-x snap-mandatory gap-0.5 overflow-x-auto bg-ink"
      >
        {items.map((p) => (
          <li key={p.src} className="w-full shrink-0 snap-start sm:w-[calc((100%-2px)/2)] lg:w-[calc((100%-4px)/3)]">
            <a
              href={lineMessageUrl(p.lineText)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${p.title} — ทักแชท LINE`}
              className="group relative block aspect-square overflow-hidden bg-ink-600 focus-visible:outline-offset-[-4px]"
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-contain transition-[filter] duration-500 group-hover:brightness-[1.04]"
              />
            </a>
          </li>
        ))}
      </ul>

      <div className={overflow ? 'flex justify-center gap-2 py-5' : 'hidden'}>
        {items.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`ไปที่โปร ${i + 1}: ${p.title}`}
            aria-current={active === i || undefined}
            className="flex h-6 w-6 items-center justify-center"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-300 ${active === i ? 'w-6 bg-signal-300' : 'w-1.5 bg-white/30'}`}
            />
          </button>
        ))}
      </div>
    </section>
  )
}
