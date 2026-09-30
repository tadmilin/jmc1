import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { ArrowUpRight } from 'lucide-react'

import { ContactSection } from '@/components/home/ContactSection'
import { Faq } from '@/components/home/Faq'
import { OpenStatus } from '@/components/site/OpenStatus'
import { fullAddress, site } from '@/content/site'
import { getServerSideURL } from '@/utilities/getURL'

export async function generateMetadata(): Promise<Metadata> {
  const url = `${getServerSideURL()}/contact`
  const title = 'ติดต่อจงมีชัยค้าวัสดุ | ร้านวัสดุก่อสร้าง ตลิ่งชัน ปากซอยชักพระ 6'
  const description = `ติดต่อร้านวัสดุก่อสร้างจงมีชัยค้าวัสดุ ${fullAddress} ${site.hours.label} แอดไลน์ ${site.line.id} โทร ${site.phone.display} ส่งถึงหน้างานรอบตลิ่งชัน`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, locale: 'th_TH', type: 'website' },
  }
}

export default function ContactPage() {
  return (
    <main id="main">
      <section className="bg-paper pb-4 pt-12 sm:pt-16">
        <div className="container-x">
          <OpenStatus tone="light" className="fade-in" />
          <h1 className="mt-6 max-w-4xl text-[clamp(2.6rem,6.6vw,5.5rem)] font-semibold leading-[1.04] tracking-[-0.04em]">
            <span className="mask-line">
              <span>ติดต่อ{site.name}</span>
            </span>
          </h1>
          <p className="fade-in mt-5 max-w-2xl text-[1.05rem] leading-8 text-stone-600" style={{ ['--d' as string]: '200ms' }}>
            ร้านวัสดุก่อสร้าง {fullAddress} ส่งรายการของทาง LINE หรือโทรหาเรา ทีมงานตอบราคาและนัดส่งถึงหน้างาน
          </p>
          <Link
            href="/#service-area"
            className="fade-in mt-6 inline-flex items-center gap-1.5 text-[0.95rem] font-medium text-ink underline decoration-signal decoration-2 underline-offset-4"
            style={{ ['--d' as string]: '300ms' }}
          >
            ดูพื้นที่จัดส่ง
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <ContactSection />
      <Faq />
    </main>
  )
}
