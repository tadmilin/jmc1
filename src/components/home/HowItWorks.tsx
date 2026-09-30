import React from 'react'

import { LineIcon } from '@/components/site/icons'
import { Reveal } from '@/components/site/Reveal'
import { site } from '@/content/site'

const steps = [
  {
    title: 'แอดไลน์ หรือโทรหาเรา',
    body: `แอด ${site.line.id} หรือโทร ${site.phone.display} ทุกวัน 07:00–17:00`,
  },
  {
    title: 'ส่งรายการของ',
    body: 'พิมพ์รายการ ถ่ายรูปลิสต์ หรือส่งแบบบ้าน/รูปหน้างานมาได้เลย',
  },
  {
    title: 'รับราคาและนัดส่ง',
    body: 'ทีมงานเช็คของ ตอบราคา และนัดวันเวลาส่งที่สะดวก',
  },
  {
    title: 'ของถึงหน้างาน',
    body: 'จัดรถให้เหมาะกับงาน กระบะ 6 ล้อ หรือรถเครนสำหรับของหนัก',
  },
]

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="relative bg-concrete py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-signal">How it works</p>
            <h2 id="how-title" className="mt-4 text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em]">
              สั่งของไม่ต้องมาที่ร้าน
              <br />
              ส่งรายการมา เราจัดให้
            </h2>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <a href={site.line.addUrl} target="_blank" rel="noopener noreferrer" className="btn btn-line btn-lg">
              <LineIcon className="h-6 w-6 text-white" />
              เริ่มที่ LINE
            </a>
          </div>
        </Reveal>

        <Reveal bare className="relative mt-16">
          <div aria-hidden="true" className="absolute left-0 right-0 top-[1.15rem] hidden h-px bg-stone-300 lg:block">
            <div className="step-line h-full bg-ink" />
          </div>
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 120} className="relative">
                <span className="relative z-10 inline-flex h-[2.3rem] items-center rounded-full bg-ink px-4 font-mono text-sm text-paper">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2 max-w-xs text-[0.95rem] leading-7 text-stone-600">{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
