import Image from 'next/image'
import React from 'react'

import { Reveal } from '@/components/site/Reveal'
import { brands, type Brand } from '@/content/brands'

function BrandTile({ brand, duplicate }: { brand: Brand; duplicate?: boolean }) {
  return (
    <li
      aria-hidden={duplicate || undefined}
      data-dup={duplicate ? '' : undefined}
      className="group mr-3 flex h-24 w-44 shrink-0 items-center justify-center rounded-2xl border border-hairline bg-white px-6 transition-[border-color,box-shadow] duration-300 hover:border-stone-300 hover:shadow-[0_12px_30px_-18px_rgba(11,13,16,0.35)] sm:mr-4 sm:h-28 sm:w-52"
    >
      {brand.logo ? (
        <Image
          src={brand.logo}
          alt={brand.name}
          width={160}
          height={64}
          className="h-10 w-auto max-w-full object-contain opacity-80 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0 sm:h-12"
        />
      ) : (
        <span className="flex flex-col items-center text-center">
          <span className="text-xl font-bold tracking-tight text-ink sm:text-[1.35rem]">{brand.name}</span>
          {brand.note && <span className="mt-1 text-[0.72rem] text-stone-500">{brand.note}</span>}
        </span>
      )}
    </li>
  )
}

function MarqueeRow({ items, reverse, duration }: { items: Brand[]; reverse?: boolean; duration: number }) {
  // Two identical halves (spaced with margins, not gap) so translating -50% loops seamlessly.
  return (
    <div className="marquee-host relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
      <ul
        className="marquee py-1.5"
        data-direction={reverse ? 'reverse' : undefined}
        style={{ ['--marquee-duration' as string]: `${duration}s` }}
      >
        {items.map((b) => (
          <BrandTile key={b.name} brand={b} />
        ))}
        {items.map((b) => (
          <BrandTile key={`${b.name}-dup`} brand={b} duplicate />
        ))}
      </ul>
    </div>
  )
}

export function BrandWall() {
  const half = Math.ceil(brands.length / 2)
  return (
    <section aria-labelledby="brands-title" className="overflow-hidden bg-paper py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-signal">Brands</p>
            <h2 id="brands-title" className="mt-4 max-w-2xl text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em]">
              แบรนด์ดังที่ช่างใช้ มีที่นี่
            </h2>
          </div>
          <p className="max-w-sm text-[0.98rem] leading-7 text-stone-600">
            แบรนด์ที่เรามีจำหน่าย ตั้งแต่ปูน เหล็ก สี ไปจนถึงสุขภัณฑ์และเครื่องมือช่าง ไม่เจอรุ่นที่ต้องการ ทักไลน์ถามได้
          </p>
        </Reveal>
      </div>

      <Reveal className="mt-12 space-y-3 sm:space-y-4" delay={100}>
        <MarqueeRow items={brands.slice(0, half)} duration={70} />
        <MarqueeRow items={brands.slice(half)} duration={80} reverse />
      </Reveal>
    </section>
  )
}
