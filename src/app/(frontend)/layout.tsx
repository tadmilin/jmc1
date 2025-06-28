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
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />

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
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: 'JMC Company - ท่อ PVC ข้อต่อ ปั๊มน้ำ และอุปกรณ์ประปา',
  description:
    'บริษัท เจเอ็มซี จำกัด ผู้จำหน่ายท่อ PVC ข้อต่อ ปั๊มน้ำ และอุปกรณ์ประปาคุณภาพสูง ราคาย่อมเยา พร้อมคำนวณสีฟรี',
  keywords: 'ท่อ PVC, ข้อต่อ, ปั๊มน้ำ, อุปกรณ์ประปา, คำนวณสี, JMC',
  robots: 'index, follow',
  openGraph: mergeOpenGraphSync(),
  twitter: {
    card: 'summary_large_image',
    creator: '@jmccompany',
  },
}
