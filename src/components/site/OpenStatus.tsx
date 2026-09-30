'use client'

import React, { useEffect, useState } from 'react'
import { site } from '@/content/site'
import { cn } from '@/utilities/ui'

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

/** Current open/closed state in Bangkok time. */
function getStatus(now: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Bangkok',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    hour12: false,
  }).formatToParts(now)
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0)
  const weekday = parts.find((p) => p.type === 'weekday')?.value ?? 'Mon'
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(weekday)
  const mins = (hour % 24) * 60 + minute
  const open = toMinutes(site.hours.opens)
  const close = toMinutes(site.hours.closes)
  const isOpenDay = (site.hours.days as readonly number[]).includes(day)
  if (isOpenDay && mins >= open && mins < close) {
    return { open: true, label: `เปิดอยู่ · ปิด ${site.hours.closes} น.` }
  }
  const beforeOpen = isOpenDay && mins < open
  return {
    open: false,
    label: `ปิดแล้ว · เปิด ${site.hours.opens} น.${beforeOpen ? '' : ' พรุ่งนี้'}`,
  }
}

/** Live "open now" pill. Renders the static hours on the server, then swaps to live status after mount. */
export function OpenStatus({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null)

  useEffect(() => {
    const tick = () => setStatus(getStatus(new Date()))
    tick()
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [])

  const open = status?.open ?? true
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.8rem] font-medium',
        tone === 'dark' ? 'bg-white/[0.07] text-paper ring-1 ring-inset ring-white/10' : 'bg-white text-ink ring-1 ring-inset ring-hairline',
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        {open && <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-line" />}
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', open ? 'bg-line' : 'bg-stone-400')} />
      </span>
      <span suppressHydrationWarning>{status?.label ?? site.hours.label}</span>
    </span>
  )
}
