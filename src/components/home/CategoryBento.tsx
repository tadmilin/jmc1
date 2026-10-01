import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { ArrowUpRight } from 'lucide-react'

import { Reveal } from '@/components/site/Reveal'
import { getTopCategories } from '@/data/categories'
import { cn } from '@/utilities/ui'

export async function CategoryBento() {
  // 9 tiles fill the 4-column grid exactly: one 2×2 feature tile + 8 singles.
  const categories = (await getTopCategories()).slice(0, 9)
  if (categories.length === 0) return null

  return (
    <section aria-labelledby="categories-title" className="bg-paper py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-signal">Catalogue</p>
            <h2
              id="categories-title"
              className="mt-4 text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em]"
            >
              ครบทุกหมวดงานก่อสร้าง
            </h2>
          </div>
          <Link href="/products" className="btn btn-ghost w-fit">
            ดูสินค้าทั้งหมด
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <ul className="mt-12 grid auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] sm:gap-4 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal
              as="li"
              key={c.slug}
              delay={(i % 4) * 80}
              className={cn(i === 0 && 'col-span-2 row-span-2')}
            >
              <Link
                href={`/categories/${c.slug}`}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-hairline bg-white p-5 transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_24px_50px_-28px_rgba(15,25,56,0.4)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className={cn('font-semibold leading-snug tracking-tight', i === 0 ? 'text-2xl sm:text-3xl' : 'line-clamp-2 text-[1rem] sm:text-lg')}>
                    {c.title}
                  </h3>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-concrete transition-colors duration-300 group-hover:bg-signal group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                </div>
                {c.imageUrl && (
                  <div className={cn('relative mt-3 flex-1', i === 0 ? 'min-h-[10rem]' : 'min-h-[4.5rem]')}>
                    <Image
                      src={c.imageUrl}
                      alt={c.title}
                      fill
                      sizes={i === 0 ? '(min-width: 1024px) 40vw, 90vw' : '(min-width: 1024px) 20vw, 45vw'}
                      className="object-contain object-bottom mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
