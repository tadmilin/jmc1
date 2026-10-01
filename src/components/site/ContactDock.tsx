'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { PhoneCall, PhoneIncoming } from 'lucide-react'

import { site } from '@/content/site'
import { cn } from '@/utilities/ui'
import { LineIcon } from './icons'

/**
 * Always-available contact actions.
 * Mobile: fixed bottom bar (call · LINE · callback). Desktop: a LINE pill with a QR card on hover.
 */
export function ContactDock() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Mobile bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-paper/90 px-3 pt-2 backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto grid max-w-md grid-cols-[1fr_1.35fr_1fr] gap-2">
          <a
            href={site.phone.href}
            className="flex h-12 flex-col items-center justify-center rounded-2xl text-ink ring-1 ring-inset ring-hairline active:scale-[0.97]"
          >
            <PhoneCall className="h-[18px] w-[18px]" />
            <span className="mt-0.5 text-[0.7rem] font-medium">โทรเลย</span>
          </a>
          <a
            href={site.line.addUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-line font-semibold text-white shadow-[0_8px_20px_-8px_rgba(6,199,85,0.7)] active:scale-[0.97]"
          >
            <LineIcon className="h-6 w-6 text-white" />
            <span className="text-[0.95rem]">แอดไลน์</span>
          </a>
          <a
            href="/#callback"
            className="flex h-12 flex-col items-center justify-center rounded-2xl text-ink ring-1 ring-inset ring-hairline active:scale-[0.97]"
          >
            <PhoneIncoming className="h-[18px] w-[18px]" />
            <span className="mt-0.5 text-[0.7rem] font-medium">ให้โทรกลับ</span>
          </a>
        </div>
      </div>

      {/* Desktop LINE pill */}
      <div
        className={cn(
          'group fixed bottom-6 right-6 z-40 hidden transition-[opacity,transform] duration-500 lg:block',
          visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
        )}
      >
        <div className="pointer-events-none absolute bottom-full right-0 mb-3 w-60 translate-y-2 rounded-3xl border border-hairline bg-white p-4 opacity-0 shadow-[0_24px_60px_-20px_rgba(15,25,56,0.35)] transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <Image src={site.line.qrSrc} alt={`QR แอดไลน์ ${site.line.id}`} width={200} height={200} className="h-auto w-full" />
          <p className="mt-3 text-center text-sm text-stone-600">
            สแกนแอดไลน์ <span className="font-mono text-ink">{site.line.id}</span>
          </p>
        </div>
        <a
          href={site.line.addUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-line btn-lg pl-4 pr-6 shadow-[0_18px_40px_-12px_rgba(6,199,85,0.65)]"
        >
          <LineIcon className="h-7 w-7 text-white" />
          ทักไลน์ ขอราคา
        </a>
      </div>
    </>
  )
}
