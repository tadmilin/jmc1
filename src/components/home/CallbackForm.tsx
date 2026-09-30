'use client'

import React, { useState } from 'react'
import { ArrowRight, Check, Phone } from 'lucide-react'

import { LineIcon } from '@/components/site/icons'
import { lineMessageUrl, site } from '@/content/site'
import { cn } from '@/utilities/ui'

const TIMES = ['โทรกลับได้เลย', 'ช่วงเช้า', 'ช่วงบ่าย'] as const

/** Thai phone numbers: 0 followed by 8–9 digits (landline or mobile). */
function normalizePhone(raw: string) {
  return raw.replace(/[^\d]/g, '')
}
function isValidPhone(raw: string) {
  return /^0\d{8,9}$/.test(normalizePhone(raw))
}

/**
 * "Call me back" form. No backend: submitting opens a LINE chat with the shop's official
 * account with the request prefilled, so it lands in the LINE OA inbox the owner already watches.
 */
export function CallbackForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [need, setNeed] = useState('')
  const [time, setTime] = useState<(typeof TIMES)[number]>(TIMES[0])
  const [touched, setTouched] = useState(false)
  const [sentUrl, setSentUrl] = useState<string | null>(null)

  const phoneOk = isValidPhone(phone)
  const nameOk = name.trim().length > 0

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!phoneOk || !nameOk) return
    const text = [
      'สวัสดีครับ/ค่ะ ขอให้ร้านโทรกลับ',
      `ชื่อ: ${name.trim()}`,
      `เบอร์: ${normalizePhone(phone)}`,
      `สะดวก: ${time}`,
      need.trim() ? `ต้องการ: ${need.trim()}` : null,
      '(ส่งจากหน้าเว็บ jongmeechai.com)',
    ]
      .filter(Boolean)
      .join('\n')
    const url = lineMessageUrl(text)
    setSentUrl(url)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (sentUrl) {
    return (
      <div className="flex h-full flex-col justify-center rounded-[2rem] border border-hairline bg-white p-7 sm:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-line text-white">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-6 text-2xl font-semibold tracking-tight">เกือบเสร็จแล้ว กดส่งข้อความใน LINE</h3>
        <p className="mt-3 text-[0.98rem] leading-7 text-stone-600">
          เราเปิดแชท LINE {site.line.id} พร้อมข้อความให้แล้ว กด “ส่ง” ในแอป LINE ทีมงานจะโทรกลับตามเวลาที่สะดวก
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-line btn-lg">
            <LineIcon className="h-6 w-6 text-white" />
            เปิด LINE อีกครั้ง
          </a>
          <a href={site.phone.href} className="btn btn-ghost btn-lg">
            <Phone className="h-5 w-5" />
            <span className="font-mono">{site.phone.display}</span>
          </a>
        </div>
        <button
          type="button"
          onClick={() => setSentUrl(null)}
          className="mt-6 w-fit text-sm text-stone-500 underline underline-offset-4 hover:text-ink"
        >
          แก้ไขข้อมูล
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-[2rem] border border-hairline bg-white p-6 sm:p-10"
      aria-labelledby="callback-title"
    >
      <p className="eyebrow text-signal">Callback</p>
      <h3 id="callback-title" className="mt-3 text-[1.75rem] font-semibold leading-tight tracking-tight">
        ฝากเบอร์ไว้ เราโทรกลับ
      </h3>
      <p className="mt-2 text-[0.95rem] leading-7 text-stone-600">
        กรอกแค่ชื่อกับเบอร์ ระบบจะส่งข้อความเข้า LINE ของร้านให้ทันที
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium">ชื่อ</span>
          <input
            className={cn('field', touched && !nameOk && 'border-destructive')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="เช่น คุณสมชาย"
            aria-invalid={touched && !nameOk}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">เบอร์โทร</span>
          <input
            className={cn('field font-mono', touched && !phoneOk && 'border-destructive')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            autoComplete="tel"
            placeholder="08x-xxx-xxxx"
            aria-invalid={touched && !phoneOk}
            aria-describedby="phone-hint"
          />
          {touched && !phoneOk && (
            <span id="phone-hint" className="mt-1.5 block text-xs text-destructive">
              กรอกเบอร์ 9–10 หลัก ขึ้นต้นด้วย 0
            </span>
          )}
        </label>
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-medium">
          ต้องการอะไร <span className="font-normal text-stone-400">(ไม่บังคับ)</span>
        </span>
        <textarea
          className="field h-auto min-h-[6.5rem] resize-y py-3 leading-7"
          value={need}
          onChange={(e) => setNeed(e.target.value)}
          placeholder="เช่น ปูน 20 ถุง ทราย 1 คิว ส่งบางขุนนนท์"
        />
      </label>

      <fieldset className="mt-5">
        <legend className="mb-2 block text-sm font-medium">สะดวกให้โทรช่วงไหน</legend>
        <div className="flex flex-wrap gap-2">
          {TIMES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTime(t)}
              aria-pressed={time === t}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium ring-1 ring-inset transition-colors',
                time === t ? 'bg-ink text-paper ring-ink' : 'bg-white text-stone-600 ring-hairline hover:bg-concrete',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <button type="submit" className="btn btn-signal btn-lg mt-8 w-full">
        ส่งคำขอให้โทรกลับ
        <ArrowRight className="h-5 w-5" />
      </button>
      <p className="mt-3 text-center text-xs text-stone-500">ข้อมูลส่งผ่าน LINE ของร้านเท่านั้น ไม่เก็บบนเว็บ</p>
    </form>
  )
}
