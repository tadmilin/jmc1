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
import { getCachedGlobal } from '@/utilities/getGlobals'
import { draftMode } from 'next/headers'
import StructuredData from '@/components/SEO/StructuredData'
import { generateOrganizationSchema, generateWebSiteSchema } from '@/utils/organization-schema'
import FloatingButtons from '@/components/FloatingButtons'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

// Generate dynamic metadata from CMS
export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getCachedGlobal('site-settings', 1)()
  const baseURL = getServerSideURL()

  // Type-safe access to settings with fallbacks
  const siteName =
    typeof siteSettings === 'object' && siteSettings !== null && 'siteName' in siteSettings
      ? String(siteSettings.siteName)
      : ''
  const siteTagline =
    typeof siteSettings === 'object' && siteSettings !== null && 'siteTagline' in siteSettings
      ? String(siteSettings.siteTagline)
      : ''
  const siteDescription =
    typeof siteSettings === 'object' && siteSettings !== null && 'siteDescription' in siteSettings
      ? String(siteSettings.siteDescription)
      : ''
  const siteKeywords =
    typeof siteSettings === 'object' && siteSettings !== null && 'siteKeywords' in siteSettings
      ? String(siteSettings.siteKeywords)
      : ''

  // Use CMS data or fallback to defaults
  const title =
    siteName && siteTagline
      ? `${siteName} | ${siteTagline}`
      : 'วัสดุก่อสร้างใกล้ฉัน ตลิ่งชัน ราคาถูก | จงมีชัยค้าวัสดุ'

  const description =
    siteDescription ||
    'ร้านวัสดุก่อสร้างใกล้ฉัน แถวตลิ่งชัน จงมีชัยค้าวัสดุ ปากซอยชักพระ6 จำหน่ายวัสดุก่อสร้างครบวงจร ราคาถูก ส่งฟรีถึงไซต์งาน อิฐแดง อิฐมอญ ปูนซีเมนต์ ทราย หิน เหล็กเส้น ท่อ PVC สี ประปา ไฟฟ้า กระเบื้อง ประตูหน้าต่าง บริการพื้นที่ ตลิ่งชัน ปิ่นเกล้า จรัญ บางขุนนนท์ บรม สวนผัก พระราม5 บางกรวย โทร 02-434-8319'

  const keywords =
    siteKeywords ||
    'ร้านวัสดุก่อสร้างใกล้ฉัน, วัสดุก่อสร้างใกล้ฉัน, ร้านวัสดุก่อสร้างแถวตลิ่งชัน, วัสดุก่อสร้างแถวตลิ่งชัน, ร้านวัสดุก่อสร้างย่านตลิ่งชัน, ร้านวัสดุก่อสร้าง ตลิ่งชัน, วัสดุก่อสร้าง ตลิ่งชัน, วัสดุก่อสร้าง, ร้านวัสดุก่อสร้าง, จงมีชัยค้าวัสดุ, อิฐใกล้ฉัน, อิฐแดง, อิฐมอญ, ปูนใกล้ฉัน, ปูนซีเมนต์ใกล้ฉัน, ทรายใกล้ฉัน, หินใกล้ฉัน, เหล็กใกล้ฉัน, เหล็กเส้นใกล้ฉัน, ประปาใกล้ฉัน, ท่อ PVC ใกล้ฉัน, ปั๊มน้ำใกล้ฉัน, ไฟฟ้าใกล้ฉัน, สายไฟใกล้ฉัน, สีทาบ้านใกล้ฉัน, กระเบื้องใกล้ฉัน, ประตูหน้าต่างใกล้ฉัน, วัสดุก่อสร้างราคาถูก, ส่งวัสดุถึงไซต์งาน, วัสดุก่อสร้าง ปิ่นเกล้า, วัสดุก่อสร้าง จรัญ, วัสดุก่อสร้าง บางขุนนนท์, วัสดุก่อสร้าง บรม, วัสดุก่อสร้าง สวนผัก, วัสดุก่อสร้าง พระราม5, วัสดุก่อสร้าง บางกรวย, วัสดุก่อสร้าง บางพลัด, วัสดุก่อสร้าง ท่าพระ, วัสดุก่อสร้าง บางกอกน้อย, ต่อเติมบ้าน, ซ่อมแซมบ้าน, รีโนเวทบ้าน, hardware store near me'

  // Use OG image from CMS or fallback
  const ogImageUrl =
    typeof siteSettings === 'object' &&
    siteSettings !== null &&
    'ogImage' in siteSettings &&
    typeof siteSettings.ogImage === 'object' &&
    siteSettings.ogImage !== null &&
    'url' in siteSettings.ogImage
      ? String(siteSettings.ogImage.url)
      : `${baseURL}/jmc-og-image.svg`

  return {
    metadataBase: new URL(baseURL),
    title,
    description,
    keywords,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',

    openGraph: {
      title,
      description,
      url: baseURL,
      siteName: siteName || 'JMC จงมีชัยค้าวัสดุ ปากซอยชักพระ6',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'th_TH',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@jmccompany',
      creator: '@jmccompany',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  // Fetch header data เพื่อเอา logo มาใช้เป็น favicon
  const headerData = await getCachedGlobal('header', 1)()
  const logoImageUrl =
    typeof headerData === 'object' &&
    headerData !== null &&
    'logo' in headerData &&
    typeof headerData.logo === 'object' &&
    headerData.logo !== null &&
    'logoImage' in headerData.logo &&
    typeof headerData.logo.logoImage === 'object' &&
    headerData.logo.logoImage !== null &&
    'url' in headerData.logo.logoImage
      ? String(headerData.logo.logoImage.url)
      : '/favicon.svg'

  // เพิ่ม cache busting version
  const faviconUrl = logoImageUrl.includes('http') ? logoImageUrl : `${logoImageUrl}?v=3`

  // Generate global structured data
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebSiteSchema()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="th" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <InitTheme />
        {/* Dynamic favicon จากรูปที่อัพโหลดใน Admin Dashboard */}
        <link href={faviconUrl} rel="icon" type="image/png" />
        <link href={faviconUrl} rel="shortcut icon" type="image/png" />
        <link href={faviconUrl} rel="apple-touch-icon" sizes="180x180" />
        <link href={faviconUrl} rel="icon" sizes="32x32" />
        <link href={faviconUrl} rel="icon" sizes="16x16" />
        <meta name="theme-color" content="#1E40AF" />
        <meta name="msapplication-TileColor" content="#1E40AF" />
        <meta name="msapplication-config" content="none" />

        {/* Geo tags — Google Maps Local Pack signals */}
        <meta name="geo.region" content="TH-10" />
        <meta name="geo.placename" content="Taling Chan, Bangkok, Thailand" />
        <meta name="geo.position" content="13.780839;100.462298" />
        <meta name="ICBM" content="13.780839, 100.462298" />
        <meta name="business:contact_data:street_address" content="38,40 ปากซอยชักพระ6 ถนนชักพระ" />
        <meta name="business:contact_data:locality" content="ตลิ่งชัน" />
        <meta name="business:contact_data:region" content="กรุงเทพมหานคร" />
        <meta name="business:contact_data:postal_code" content="10170" />
        <meta name="business:contact_data:country_name" content="Thailand" />
        <meta name="business:contact_data:phone_number" content="+66-2-434-8319" />

        {/* hreflang — language/region targeting */}
        <link rel="alternate" hrefLang="th" href="https://jmc111.vercel.app/" />
        <link rel="alternate" hrefLang="x-default" href="https://jmc111.vercel.app/" />

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
