import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { ArrowUpRight, Clock, MapPin, Phone } from 'lucide-react'

import { serviceAreas } from '@/content/areas'
import { fullAddress, mainNav, site } from '@/content/site'
import { BrandMark, LineIcon } from './icons'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-auto overflow-hidden bg-ink text-paper">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

      <div className="container-x relative pb-10 pt-20 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <BrandMark className="h-11 w-11 [&>rect:first-child]:fill-white/10" />
              <span className="text-xl font-bold tracking-tight">{site.name}</span>
            </Link>
            <p className="mt-6 max-w-md text-[0.95rem] leading-7 text-stone-400">
              ร้านวัสดุก่อสร้างย่านตลิ่งชัน ประสบการณ์กว่า {site.facts.years} ปี อิฐ หิน ปูน ทราย เหล็ก ประปา ไฟฟ้า สี
              ส่งถึงหน้างานด้วยรถของร้าน
            </p>

            <ul className="mt-8 space-y-4 text-[0.95rem]">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-signal-300" />
                <address className="not-italic leading-7 text-stone-300">{fullAddress}</address>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-signal-300" />
                <span className="text-stone-300">{site.hours.label}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-signal-300" />
                <a href={site.phone.href} className="link-underline font-mono text-paper">
                  {site.phone.display}
                </a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6">
            <div>
              <h3 className="kicker text-stone-500">เมนู</h3>
              <ul className="mt-5 space-y-3 text-[0.95rem]">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="link-underline text-stone-300 hover:text-paper">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/categories" className="link-underline text-stone-300 hover:text-paper">
                    หมวดหมู่สินค้า
                  </Link>
                </li>
                <li>
                  <Link href="/quotation" className="link-underline text-stone-300 hover:text-paper">
                    ขอใบเสนอราคา
                  </Link>
                </li>
              </ul>
            </div>
            <div className="sm:col-span-2">
              <h3 className="kicker text-stone-500">พื้นที่จัดส่ง</h3>
              <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 text-[0.95rem] sm:grid-cols-2">
                {serviceAreas.map((area) => (
                  <li key={area.slug}>
                    <Link
                      href={`/service-areas/${area.slug}`}
                      className="link-underline whitespace-nowrap text-stone-300 hover:text-paper"
                    >
                      วัสดุก่อสร้าง {area.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white p-4 text-ink sm:max-w-[12rem]">
              <Image src={site.line.qrSrc} alt={`QR Code แอดไลน์ ${site.line.id}`} width={176} height={176} className="h-auto w-full" />
              <p className="mt-3 text-center font-mono text-[0.8rem]">{site.line.id}</p>
            </div>
            <a
              href={site.line.addUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-line mt-4 w-full sm:max-w-[12rem]"
            >
              <LineIcon className="h-5 w-5 text-white" />
              แอดไลน์
            </a>
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-paper"
            >
              Facebook <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-white/10 pt-8 text-[0.82rem] text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name} · {site.address.short}
          </p>
          <p className="font-mono">
            {site.geo.lat.toFixed(4)}°N {site.geo.lng.toFixed(4)}°E
          </p>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none relative -mb-[0.2em] select-none whitespace-nowrap text-center text-[13.5vw] font-bold leading-none tracking-[-0.05em] text-white/[0.04]"
      >
        JONGMEECHAI
      </p>
    </footer>
  )
}
