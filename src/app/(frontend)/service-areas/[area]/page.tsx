import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import { ArrowUpRight, MapPin, Phone } from 'lucide-react'

import { ServiceMap } from '@/components/home/ServiceMap'
import StructuredData from '@/components/SEO/StructuredData'
import { LineIcon } from '@/components/site/icons'
import { Reveal } from '@/components/site/Reveal'
import { getServiceArea, nearbyAreas, serviceAreas } from '@/content/areas'
import { deliveries } from '@/content/deliveries'
import { fullAddress, site } from '@/content/site'
import { getServerSideURL } from '@/utilities/getURL'

type Args = { params: Promise<{ area: string }> }

const materials = [
  'อิฐมอญ · อิฐบล็อก · อิฐมวลเบา',
  'ปูนซีเมนต์ · ปูนสำเร็จรูป',
  'ทราย · หิน · หินคลุก',
  'เหล็กเส้น · เหล็กกล่อง · เหล็กรูปพรรณ',
  'เสาเข็มคอนกรีต · ท่อคอนกรีต',
  'ท่อ PVC · อุปกรณ์ประปา',
  'สายไฟ · อุปกรณ์ไฟฟ้า',
  'สีทาบ้าน TOA · ผสมสีตามสั่ง',
  'แผ่นบอร์ด · ยิปซัม · ไม้อัด',
]

export async function generateStaticParams() {
  return serviceAreas.map((a) => ({ area: a.slug }))
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { area: slug } = await params
  const area = getServiceArea(slug)
  if (!area) return { title: 'ไม่พบหน้าที่ค้นหา | จงมีชัยค้าวัสดุ' }

  const url = `${getServerSideURL()}/service-areas/${area.slug}`
  const title = `วัสดุก่อสร้าง ${area.name} ส่งถึงหน้างาน | ร้านวัสดุก่อสร้างใกล้${area.name} จงมีชัยค้าวัสดุ`
  const description = `ร้านวัสดุก่อสร้างใกล้${area.name} อิฐ หิน ปูน ทราย เหล็ก ท่อ สี ส่งถึงหน้างาน${area.fullName} จากร้านจงมีชัยค้าวัสดุ ปากซอยชักพระ 6 ตลิ่งชัน ห่างประมาณ ${area.distanceKm} กม. แอดไลน์ ${site.line.id} โทร ${site.phone.display}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      locale: 'th_TH',
      type: 'website',
      images: [{ url: `${getServerSideURL()}${site.seo.ogImage}` }],
    },
  }
}

export default async function ServiceAreaPage({ params }: Args) {
  const { area: slug } = await params
  const area = getServiceArea(slug)
  if (!area) notFound()

  const baseURL = getServerSideURL()
  const nearby = nearbyAreas(area.slug, 4)
  const photos = deliveries.slice(0, 3)

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: `${baseURL}/` },
        { '@type': 'ListItem', position: 2, name: 'พื้นที่จัดส่ง', item: `${baseURL}/#service-area` },
        { '@type': 'ListItem', position: 3, name: `วัสดุก่อสร้าง ${area.name}`, item: `${baseURL}/service-areas/${area.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `ส่งวัสดุก่อสร้างถึงหน้างาน ${area.fullName}`,
      serviceType: 'ส่งวัสดุก่อสร้าง',
      provider: { '@id': `${baseURL}/#hardware-store` },
      areaServed: { '@type': 'Place', name: area.fullName },
      url: `${baseURL}/service-areas/${area.slug}`,
    },
  ]

  return (
    <main id="main">
      <StructuredData data={schema} />

      <section className="relative isolate overflow-hidden bg-ink text-paper">
        <div
          aria-hidden="true"
          className="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_80%_70%_at_30%_40%,#000_40%,transparent_100%)]"
        />
        <div className="container-x grid gap-12 pb-16 pt-8 lg:grid-cols-12 lg:items-center lg:pb-20 lg:pt-12">
          <div className="lg:col-span-7">
            <nav aria-label="breadcrumb" className="fade-in text-sm text-stone-400">
              <Link href="/" className="hover:text-paper">
                หน้าแรก
              </Link>
              <span className="mx-2 text-stone-600">/</span>
              <Link href="/#service-area" className="hover:text-paper">
                พื้นที่จัดส่ง
              </Link>
              <span className="mx-2 text-stone-600">/</span>
              <span className="text-paper">{area.name}</span>
            </nav>

            <h1 className="mt-8">
              <span className="mask-line kicker text-stone-400">
                <span>ส่งถึงหน้างาน{area.fullName} · ห่างร้านประมาณ {area.distanceKm} กม.</span>
              </span>
              <span className="mt-4 block text-[clamp(2.6rem,6.6vw,5.5rem)] font-semibold leading-[1.04] tracking-[-0.04em]">
                <span className="mask-line">
                  <span style={{ ['--d' as string]: '100ms' }}>ร้านวัสดุก่อสร้าง</span>
                </span>
                <span className="mask-line">
                  <span style={{ ['--d' as string]: '200ms' }}>
                    ใกล้<span className="text-signal-300">{area.name}</span>
                  </span>
                </span>
              </span>
            </h1>

            <p className="fade-in mt-7 max-w-xl text-[1.05rem] leading-8 text-stone-300" style={{ ['--d' as string]: '380ms' }}>
              {area.intro}
            </p>

            <div className="fade-in mt-9 flex flex-col gap-3 sm:flex-row" style={{ ['--d' as string]: '480ms' }}>
              <a href={site.line.addUrl} target="_blank" rel="noopener noreferrer" className="btn btn-line btn-lg">
                <LineIcon className="h-6 w-6 text-white" />
                แอดไลน์ ส่งรายการของ
              </a>
              <a href={site.phone.href} className="btn btn-ghost-light btn-lg">
                <Phone className="h-5 w-5" />
                <span className="font-mono">{site.phone.display}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[2rem] bg-white/[0.03] p-3 ring-1 ring-inset ring-white/10 sm:p-5">
              <ServiceMap highlight={area.slug} className="aspect-square w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper py-20 sm:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow text-signal">Materials</p>
            <h2 className="mt-4 text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
              ส่งอะไรถึง{area.name}ได้บ้าง
            </h2>
            <p className="mt-5 max-w-md text-[0.98rem] leading-7 text-stone-600">
              วัสดุก่อสร้างครบทั้งงานโครงสร้างและงานตกแต่ง จัดรถให้เหมาะกับของ รถกระบะเข้าซอยได้ รถ 6 ล้อและรถเครนสำหรับของหนัก
            </p>
            {area.landmarks.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-medium text-stone-500">จุดสังเกตในพื้นที่</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {area.landmarks.map((l) => (
                    <li key={l} className="inline-flex items-center gap-1.5 rounded-full bg-concrete px-3.5 py-1.5 text-sm">
                      <MapPin className="h-3.5 w-3.5 text-signal" />
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>

          <Reveal delay={100} className="lg:col-span-7">
            <ul className="grid gap-px overflow-hidden rounded-3xl border border-hairline bg-hairline sm:grid-cols-2">
              {materials.map((m) => (
                <li key={m} className="bg-white px-6 py-5 text-[1.02rem] font-medium">
                  {m}
                </li>
              ))}
              <li className="bg-ink px-6 py-5">
                <Link href="/products" className="flex items-center justify-between font-medium text-paper">
                  ดูสินค้าทั้งหมด
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-concrete py-20 sm:py-24">
        <div className="container-x">
          <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
              ส่งจริงจากร้านเรา
            </h2>
            <p className="max-w-sm text-[0.95rem] leading-7 text-stone-600">
              รูปจากงานส่งของจริง ร้านอยู่ {fullAddress}
            </p>
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {photos.map((p, i) => (
              <Reveal as="li" key={p.src} delay={i * 100} className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-stone-300">
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
                <span className="absolute bottom-4 left-4 rounded-full bg-black/45 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                  {p.material}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-paper py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <h2 className="text-[clamp(1.6rem,3.2vw,2.4rem)] font-semibold tracking-[-0.03em]">พื้นที่ใกล้เคียง</h2>
          </Reveal>
          <Reveal as="ul" delay={80} className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {nearby.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/service-areas/${a.slug}`}
                  className="group flex h-full items-center justify-between rounded-2xl border border-hairline bg-white px-5 py-5 transition-colors hover:border-ink"
                >
                  <span>
                    <span className="block text-sm text-stone-500">วัสดุก่อสร้าง</span>
                    <span className="text-lg font-semibold">{a.name}</span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-stone-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                </Link>
              </li>
            ))}
          </Reveal>
        </div>
      </section>
    </main>
  )
}
