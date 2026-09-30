'use client'

import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { Reveal } from '@/components/site/Reveal'
import { deliveries } from '@/content/deliveries'

export function DeliveryGallery() {
  const track = useRef<HTMLUListElement>(null)
  const [progress, setProgress] = useState(0)
  const [edges, setEdges] = useState({ start: true, end: false })

  const update = useCallback(() => {
    const el = track.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setProgress(max > 0 ? el.scrollLeft / max : 0)
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft > max - 8 })
  }, [])

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [update])

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('li')
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step * 2, behavior: 'smooth' })
  }

  return (
    <section aria-labelledby="deliveries-title" className="relative overflow-hidden bg-ink py-20 text-paper sm:py-28">
      <div className="container-x">
        <Reveal className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow text-signal">On the road</p>
            <h2
              id="deliveries-title"
              className="mt-4 text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em]"
            >
              ส่งจริง ทุกวัน
            </h2>
            <p className="mt-4 max-w-xl text-[0.98rem] leading-7 text-stone-400">
              ภาพจากงานส่งของจริงของร้าน เสาเข็ม ปูน เหล็ก ท่อ บอร์ด ขึ้นรถของเราเองแล้วไปถึงหน้างานลูกค้า
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={edges.start}
              aria-label="รูปก่อนหน้า"
              className="flex h-12 w-12 items-center justify-center rounded-full ring-1 ring-inset ring-white/20 transition hover:bg-white/10 disabled:opacity-30"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={edges.end}
              aria-label="รูปถัดไป"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-paper text-ink transition hover:bg-white disabled:opacity-30"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </Reveal>
      </div>

      <Reveal delay={120} className="mt-12">
        <ul
          ref={track}
          onScroll={update}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 sm:px-6 lg:px-[max(2.5rem,calc((100vw-84rem)/2+2.5rem))]"
        >
          {deliveries.map((d, i) => (
            <li
              key={d.src}
              className="group relative w-[78vw] shrink-0 snap-start overflow-hidden rounded-3xl bg-stone-800 sm:w-[22rem] lg:w-[24rem]"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={d.src}
                  alt={d.alt}
                  fill
                  sizes="(min-width: 1024px) 24rem, (min-width: 640px) 22rem, 78vw"
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                  loading={i < 3 ? 'eager' : 'lazy'}
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 pt-16">
                <p className="font-mono text-[0.7rem] text-stone-400">{String(i + 1).padStart(2, '0')} / {String(deliveries.length).padStart(2, '0')}</p>
                <p className="mt-1 text-lg font-semibold leading-snug">{d.material}</p>
                <p className="mt-0.5 text-sm text-stone-300">{d.vehicle}</p>
              </div>
            </li>
          ))}
          <li aria-hidden="true" className="w-1 shrink-0" />
        </ul>

        <div className="container-x mt-8">
          <div className="h-px w-full bg-white/15">
            <div
              className="h-px bg-signal transition-[width] duration-200"
              style={{ width: `${Math.max(8, progress * 100)}%` }}
            />
          </div>
        </div>
      </Reveal>
    </section>
  )
}
