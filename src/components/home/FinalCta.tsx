import React from 'react'
import { Phone } from 'lucide-react'

import { LineIcon } from '@/components/site/icons'
import { Reveal } from '@/components/site/Reveal'
import { site } from '@/content/site'

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="relative overflow-hidden bg-signal text-white">
      <div aria-hidden="true" className="grid-lines absolute inset-0 opacity-90" />
      <div className="container-x relative flex flex-col items-start gap-10 py-20 sm:py-24 lg:flex-row lg:items-end lg:justify-between">
        <Reveal>
          <p className="eyebrow text-white/90">Ready when you are</p>
          <h2
            id="final-cta-title"
            className="mt-4 max-w-3xl text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[1.02] tracking-[-0.04em]"
          >
            มีรายการของแล้ว?
            <br />
            ส่งมาทาง LINE ได้เลย
          </h2>
        </Reveal>
        <Reveal delay={120} className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a href={site.line.addUrl} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-ink">
            <LineIcon className="h-6 w-6 text-line" letterColor="#0F1938" />
            แอดไลน์ {site.line.id}
          </a>
          <a href={site.phone.href} className="btn btn-lg bg-transparent text-white ring-2 ring-inset ring-white/80 hover:bg-white hover:text-signal">
            <Phone className="h-5 w-5" />
            <span className="font-mono">{site.phone.display}</span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
