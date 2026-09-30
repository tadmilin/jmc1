import Link from 'next/link'
import React from 'react'
import { ArrowUpRight, Navigation } from 'lucide-react'

import { Reveal } from '@/components/site/Reveal'
import { serviceAreas } from '@/content/areas'
import { site } from '@/content/site'
import { ServiceMap } from './ServiceMap'

export function ServiceArea() {
  return (
    <section id="service-area" aria-labelledby="area-title" className="bg-paper py-20 sm:py-28">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="eyebrow text-signal">Service area</p>
            <h2
              id="area-title"
              className="mt-4 text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em]"
            >
              ส่งถึงหน้างาน
              <br />
              รอบตลิ่งชัน {site.facts.deliveryRadiusKm}+ กม.
            </h2>
            <p className="mt-5 max-w-lg text-[0.98rem] leading-7 text-stone-600">
              ร้านอยู่{site.address.short} ส่งวัสดุก่อสร้างถึงบ้านและไซต์งานในย่านฝั่งธนฯ และนนทบุรีฝั่งใต้
              ไกลกว่านี้ก็ทักมาถามได้
            </p>
          </Reveal>

          <Reveal as="ul" delay={100} className="mt-10 grid grid-cols-1 border-t border-hairline sm:grid-cols-2 sm:gap-x-8">
            {serviceAreas.map((area) => (
              <li key={area.slug} className="border-b border-hairline">
                <Link
                  href={`/service-areas/${area.slug}`}
                  className="group flex items-center justify-between gap-4 py-4 transition-colors"
                >
                  <span className="text-[1.02rem] font-medium text-ink">
                    วัสดุก่อสร้าง <span className="group-hover:text-signal">{area.name}</span>
                  </span>
                  <span className="flex items-center gap-2 font-mono text-xs text-stone-500">
                    ~{area.distanceKm} กม.
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                  </span>
                </Link>
              </li>
            ))}
          </Reveal>

          <Reveal delay={150} className="mt-8 flex flex-wrap gap-3">
            <a href={site.maps.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ink">
              <Navigation className="h-4 w-4" />
              นำทางมาร้าน
            </a>
            <a href={site.maps.shareUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              ดูรีวิวบน Google Maps
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <div className="sticky top-[calc(var(--header-h)+1.5rem)] overflow-hidden rounded-[2rem] bg-ink p-4 text-paper sm:p-6">
            <div className="flex items-center justify-between px-2 pt-1">
              <span className="eyebrow text-stone-500">Delivery radius</span>
              <span className="font-mono text-[0.7rem] text-stone-500">
                {site.geo.lat.toFixed(4)}°N {site.geo.lng.toFixed(4)}°E
              </span>
            </div>
            <ServiceMap className="mx-auto mt-2 aspect-square w-full max-w-[34rem]" />
            <p className="px-2 pb-1 text-[0.78rem] leading-5 text-stone-500">
              ระยะทางตามแนวเส้นตรงจากร้าน ระยะส่งจริงคิดตามเส้นทางถนน กดชื่อย่านเพื่อดูรายละเอียด
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
