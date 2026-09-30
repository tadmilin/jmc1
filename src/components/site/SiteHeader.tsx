'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react'

import { mainNav, site } from '@/content/site'
import { cn } from '@/utilities/ui'
import { BrandMark, LineIcon } from './icons'

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const isActive = (href: string) => !href.includes('#') && href !== '/' && pathname?.startsWith(href)

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-[background-color,box-shadow,backdrop-filter] duration-300',
        scrolled || open
          ? 'bg-paper/85 shadow-[0_1px_0_0_#DAD7CE] backdrop-blur-xl backdrop-saturate-150'
          : 'bg-paper',
      )}
    >
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-3" aria-label={`${site.name} หน้าแรก`}>
          <BrandMark className="h-10 w-10 transition-transform duration-500 group-hover:-rotate-6" />
          <span className="flex flex-col leading-none">
            <span className="text-[1.05rem] font-bold tracking-tight text-ink">{site.name}</span>
            <span className="mt-1 text-[0.72rem] text-stone-500">
              {site.tagline}
              <span className="hidden sm:inline"> · ชักพระ 6</span>
            </span>
          </span>
        </Link>

        <nav aria-label="เมนูหลัก" className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-full px-4 py-2 text-[0.92rem] font-medium text-stone-600 transition-colors hover:bg-concrete hover:text-ink',
                isActive(item.href) && 'bg-concrete text-ink',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={site.phone.href}
            className="hidden items-center gap-2 rounded-full px-3 py-2 font-mono text-[0.85rem] text-ink transition-colors hover:bg-concrete md:inline-flex"
          >
            <Phone className="h-4 w-4" strokeWidth={2} />
            {site.phone.display}
          </a>
          <a
            href={site.line.addUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-line h-10 px-4 text-[0.88rem]"
          >
            <LineIcon className="h-5 w-5 text-white" />
            <span>แอดไลน์</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink ring-1 ring-inset ring-hairline transition-colors hover:bg-concrete lg:hidden"
            aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu sheet */}
      <div
        id="mobile-menu"
        className={cn(
          'fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 bg-paper transition-[opacity,visibility] duration-300 lg:hidden',
          open ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        <div className="container-x flex h-full flex-col overflow-y-auto pb-28 pt-4">
          <nav aria-label="เมนูมือถือ" className="flex flex-col">
            {mainNav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center justify-between border-b border-hairline py-5 text-[1.6rem] font-semibold tracking-tight text-ink transition-[opacity,transform] duration-500',
                  open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
                )}
                style={{ transitionDelay: open ? `${80 + i * 50}ms` : '0ms' }}
              >
                {item.label}
                <ArrowUpRight className="h-5 w-5 text-stone-400" />
              </Link>
            ))}
            <Link
              href="/categories"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between border-b border-hairline py-5 text-[1.6rem] font-semibold tracking-tight text-ink"
            >
              หมวดหมู่สินค้า
              <ArrowUpRight className="h-5 w-5 text-stone-400" />
            </Link>
          </nav>

          <div className="mt-8 grid gap-3">
            <a href={site.line.addUrl} target="_blank" rel="noopener noreferrer" className="btn btn-line btn-lg w-full">
              <LineIcon className="h-6 w-6 text-white" />
              แอดไลน์ {site.line.id}
            </a>
            <a href={site.phone.href} className="btn btn-ghost btn-lg w-full font-mono">
              <Phone className="h-5 w-5" />
              {site.phone.display}
            </a>
          </div>
          <p className="mt-6 text-sm text-stone-500">
            {site.hours.label} · {site.address.short}
          </p>
        </div>
      </div>
    </header>
  )
}
