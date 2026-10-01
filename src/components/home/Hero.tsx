import Image from 'next/image'
import React from 'react'
import { ArrowDownRight, Phone } from 'lucide-react'

import { CountUp } from '@/components/site/CountUp'
import { LineIcon } from '@/components/site/icons'
import { OpenStatus } from '@/components/site/OpenStatus'
import { site } from '@/content/site'

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper">
      <div
        aria-hidden="true"
        className="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_80%_70%_at_30%_40%,#000_40%,transparent_100%)]"
      />

      <div className="container-x grid gap-12 pb-16 pt-10 sm:pt-14 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-20">
        <div className="flex flex-col lg:col-span-7">
          <div className="fade-in flex flex-wrap items-center gap-3" style={{ ['--d' as string]: '0ms' }}>
            <OpenStatus />
            <span className="eyebrow hidden text-stone-500 sm:inline">
              {site.geo.lat.toFixed(4)}°N · {site.geo.lng.toFixed(4)}°E
            </span>
          </div>

          <h1 className="mt-8">
            <span className="mask-line kicker text-stone-400">
              <span style={{ ['--d' as string]: '60ms' }}>ร้านวัสดุก่อสร้าง ตลิ่งชัน · ปากซอยชักพระ 6</span>
            </span>
            <span className="mt-5 block text-[clamp(3rem,8.4vw,7rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
              <span className="mask-line">
                <span style={{ ['--d' as string]: '140ms' }}>วัสดุครบ</span>
              </span>
              <span className="mask-line">
                <span style={{ ['--d' as string]: '240ms' }}>
                  ส่งถึง<span className="text-signal-300">หน้างาน</span>
                </span>
              </span>
            </span>
          </h1>

          <p
            className="fade-in mt-7 max-w-xl text-[1.05rem] leading-8 text-stone-300 sm:text-lg"
            style={{ ['--d' as string]: '420ms' }}
          >
            อิฐ หิน ปูน ทราย เหล็ก ประปา ไฟฟ้า สี ส่งรายการทาง LINE ทีมงานตอบราคาให้
            แล้วส่งถึงหน้างานด้วยรถของร้านเอง ตั้งแต่รถกระบะจนถึงรถเครน
          </p>

          <div className="fade-in mt-9 flex flex-col gap-3 sm:flex-row" style={{ ['--d' as string]: '520ms' }}>
            <a href={site.line.addUrl} target="_blank" rel="noopener noreferrer" className="btn btn-line btn-lg">
              <LineIcon className="h-6 w-6 text-white" />
              แอดไลน์ ขอราคา
            </a>
            <a href={site.phone.href} className="btn btn-ghost-light btn-lg">
              <Phone className="h-5 w-5" />
              <span className="font-mono">{site.phone.display}</span>
            </a>
          </div>
          <a
            href="#callback"
            className="fade-in mt-5 inline-flex w-fit items-center gap-1.5 text-[0.92rem] text-stone-400 transition-colors hover:text-paper"
            style={{ ['--d' as string]: '600ms' }}
          >
            ไม่สะดวกคุยตอนนี้? ฝากเบอร์ให้เราโทรกลับ
            <ArrowDownRight className="h-4 w-4" />
          </a>

          <dl
            className="fade-in mt-auto grid grid-cols-3 gap-4 border-t border-white/10 pt-8 max-lg:mt-14"
            style={{ ['--d' as string]: '700ms' }}
          >
            {[
              { value: site.facts.years, suffix: '+', label: 'ปีประสบการณ์' },
              { value: site.facts.deliveryRadiusKm, suffix: '+ กม.', label: 'รัศมีส่งถึงหน้างาน' },
              { value: 7, suffix: ' วัน', label: 'เปิดทุกวัน 07–17 น.' },
            ].map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-[clamp(1.6rem,3.4vw,2.5rem)] font-semibold tracking-tight">
                  <CountUp value={s.value} suffix={s.suffix} />
                </dd>
                <dd className="mt-1 text-[0.8rem] leading-5 text-stone-400 sm:text-sm">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative lg:col-span-5">
          <div className="clip-reveal relative aspect-[4/5] overflow-hidden rounded-3xl bg-stone-800">
            <Image
              src="/images/deliveries/steel-rebar-pickup-shop.webp"
              alt="รถกระบะของร้านจงมีชัยค้าวัสดุบรรทุกเหล็กเส้นเต็มแร็ค เตรียมส่งถึงหน้างาน ย่านตลิ่งชัน"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent" />
            <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              ส่งจริงจากหน้าร้าน · ชักพระ 6
            </span>
          </div>

          <div
            className="fade-in absolute -bottom-6 -left-4 hidden w-40 overflow-hidden rounded-2xl ring-4 ring-ink sm:block lg:-left-10 lg:w-48"
            style={{ ['--d' as string]: '900ms' }}
          >
            <div className="relative aspect-[3/4]">
              <Image
                src="/images/deliveries/cement-dump-truck.webp"
                alt="รถ 6 ล้อของร้านบรรทุกปูนซีเมนต์เต็มคัน"
                fill
                sizes="12rem"
                className="object-cover"
              />
            </div>
          </div>

          <div
            className="fade-in absolute -right-2 top-6 hidden rounded-2xl bg-paper p-3 pr-4 text-ink shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] sm:flex sm:items-center sm:gap-3 lg:-right-6"
            style={{ ['--d' as string]: '1050ms' }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-line">
              <LineIcon className="h-6 w-6 text-white" />
            </span>
            <span className="leading-tight">
              <span className="block text-[0.95rem] font-semibold">ทักแชท ตอบไว</span>
              <span className="font-mono text-xs text-stone-500">{site.line.id}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
