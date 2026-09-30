import Image from 'next/image'
import React from 'react'
import { Clock, MapPin, Phone } from 'lucide-react'

import { LineIcon } from '@/components/site/icons'
import { OpenStatus } from '@/components/site/OpenStatus'
import { Reveal } from '@/components/site/Reveal'
import { fullAddress, site } from '@/content/site'
import { CallbackForm } from './CallbackForm'

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-concrete py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <p className="eyebrow text-signal">Contact</p>
          <h2
            id="contact-title"
            className="mt-4 text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em]"
          >
            ทักมาได้ทุกช่องทาง
            <br />
            ตอบไวในเวลาทำการ
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <Reveal id="callback" className="lg:col-span-7">
            <CallbackForm />
          </Reveal>

          <div className="grid gap-4 lg:col-span-5">
            <Reveal delay={80} className="relative overflow-hidden rounded-[2rem] bg-line p-7 text-white sm:p-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <LineIcon className="h-10 w-10 text-white" letterColor="#06C755" />
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight">แอดไลน์ ส่งรายการของ</h3>
                  <p className="mt-2 text-[0.95rem] leading-7 text-white/85">
                    ส่งลิสต์ รูปแบบบ้าน หรือรูปหน้างาน แล้วรอรับราคา
                  </p>
                  <p className="mt-4 font-mono text-lg">{site.line.id}</p>
                </div>
                <div className="hidden shrink-0 rounded-2xl bg-white p-2.5 sm:block">
                  <Image src={site.line.qrSrc} alt={`QR Code แอดไลน์ ${site.line.id}`} width={112} height={112} />
                </div>
              </div>
              <a
                href={site.line.addUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg mt-7 w-full bg-white text-ink hover:bg-paper"
              >
                เพิ่มเพื่อน LINE
              </a>
            </Reveal>

            <Reveal delay={160} className="rounded-[2rem] border border-hairline bg-white p-7 sm:p-8">
              <OpenStatus tone="light" />
              <ul className="mt-6 space-y-4 text-[0.95rem]">
                <li>
                  <a href={site.phone.href} className="group flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-concrete">
                      <Phone className="h-[18px] w-[18px]" />
                    </span>
                    <span>
                      <span className="block text-xs text-stone-500">โทร</span>
                      <span className="font-mono text-lg text-ink group-hover:text-signal">{site.phone.display}</span>
                    </span>
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-concrete">
                    <MapPin className="h-[18px] w-[18px]" />
                  </span>
                  <address className="not-italic leading-7 text-stone-700">{fullAddress}</address>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-concrete">
                    <Clock className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-stone-700">{site.hours.label}</span>
                </li>
              </ul>
            </Reveal>
          </div>

          <Reveal delay={100} className="overflow-hidden rounded-[2rem] border border-hairline bg-white lg:col-span-12">
            <iframe
              title="แผนที่ร้านจงมีชัยค้าวัสดุ ปากซอยชักพระ 6 ตลิ่งชัน"
              src={site.maps.embedUrl}
              className="h-[22rem] w-full grayscale-[0.35] sm:h-[26rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
