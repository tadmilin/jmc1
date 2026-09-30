import React from 'react'
import { Plus } from 'lucide-react'

import StructuredData from '@/components/SEO/StructuredData'
import { Reveal } from '@/components/site/Reveal'
import { faq } from '@/content/faq'

export function Faq() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <section aria-labelledby="faq-title" className="bg-paper py-20 sm:py-28">
      <StructuredData data={schema} />
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow text-signal">FAQ</p>
          <h2
            id="faq-title"
            className="mt-4 text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em]"
          >
            คำถามที่ลูกค้าถามบ่อย
          </h2>
        </Reveal>

        <Reveal delay={100} className="lg:col-span-8">
          <ul className="border-t border-hairline">
            {faq.map((item, i) => (
              <li key={item.q} className="border-b border-hairline">
                <details className="group" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-lg font-medium tracking-tight marker:hidden sm:text-xl [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-hairline transition-[transform,background-color] duration-300 group-open:rotate-45 group-open:bg-ink group-open:text-paper">
                      <Plus className="h-4 w-4" />
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-7 pr-12 text-[0.98rem] leading-8 text-stone-600">{item.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
