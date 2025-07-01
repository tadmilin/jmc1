import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraphSync } from '@/utilities/mergeOpenGraph'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { draftMode } from 'next/headers'
import StructuredData from '@/components/SEO/StructuredData'
import { generateOrganizationSchema, generateWebSiteSchema } from '@/utils/organization-schema'
import FloatingButtons from '@/components/FloatingButtons'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  // Generate global structured data
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebSiteSchema()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="th" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <InitTheme />
        {/* Multiple favicon formats with cache busting */}
        <link href="/favicon.svg?v=2" rel="icon" type="image/svg+xml" />
        <link href="/favicon.svg?v=2" rel="shortcut icon" type="image/svg+xml" />
        <link href="/jmc-og-image.svg?v=2" rel="apple-touch-icon" sizes="180x180" />
        <link href="/favicon.svg?v=2" rel="icon" type="image/svg+xml" sizes="32x32" />
        <link href="/favicon.svg?v=2" rel="icon" type="image/svg+xml" sizes="16x16" />
        <meta name="theme-color" content="#1E40AF" />
        <meta name="msapplication-TileColor" content="#1E40AF" />
        <meta name="msapplication-config" content="none" />

        {/* Global Structured Data */}
        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
          <FloatingButtons />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: 'ร้านวัสดุก่อสร้าง ตลิ่งชัน ใกล้ฉัน | จงมีชัยค้าวัสดุ ',
  description:
    'จงมีชัยค้าวัสดุ ตลิ่งชัน ปากซอยชักพระ6 ร้านวัสดุก่อสร้างครบวงจร ราคาถูก ส่งด่วนถึงไซต์งาน อิฐ หิน ปูน ทราย เหล็ก ประปา ไฟฟ้า ช่าง ครบจบที่เดียว',
  keywords:
    'วัสดุก่อสร้าง,วัสดุก่อสร้างใกล้ฉัน, ราคาถูก, ตลิ่งชัน, ปากซอยชักพระ6, ประปา,ไฟฟ้า, เหล็ก, ปั๊มน้ำ,ปูน,ทรายคิว ,หินคิว ,ทราย ,หิน ,รถปูน ,ประตู,หน้าต่าง อุปกรณ์ประปา, เครื่องผสมสี, ร้านวัสดุก่อสร้างใกล้ฉัน',
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',

  openGraph: {
    title: 'ร้านวัสดุก่อสร้าง ตลิ่งชัน ใกล้ฉัน | JMC',
    description:
      'จงมีชัยค้าวัสดุ ร้านวัสดุก่อสร้างครบวงจร ตลิ่งชัน ราคาถูก ส่งไว ปากซอยชักพระ6 โทรเลย!',
    url: getServerSideURL(),
    siteName: 'JMC จงมีชัยค้าวัสดุ ปากซอยชักพระ6',
    images: [
      {
        url: `${getServerSideURL()}/jmc-og-image.svg`,
        width: 1200,
        height: 630,
        alt: 'ร้านวัสดุก่อสร้าง ตลิ่งชัน ใกล้ฉัน JMC',
      },
    ],
    locale: 'th_TH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@jmccompany',
    creator: '@jmccompany',
    title: 'ร้านวัสดุก่อสร้าง ตลิ่งชัน ใกล้ฉัน | JMC',
    description: 'วัสดุก่อสร้างครบวงจร ราคาถูก ตลิ่งชัน ปากซอยชักพระ6 ส่งไวถึงไซต์งาน',
    images: [`${getServerSideURL()}/jmc-og-image.svg`],
  },
}
