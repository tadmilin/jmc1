import type { Metadata, Viewport } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { Anuphan } from 'next/font/google'
import React from 'react'

export const revalidate = 3600

import { AdminBar } from '@/components/AdminBar'
import { ContactDock } from '@/components/site/ContactDock'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import StructuredData from '@/components/SEO/StructuredData'
import { site } from '@/content/site'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { getServerSideURL } from '@/utilities/getURL'
import { generateOrganizationSchema, generateWebSiteSchema } from '@/utils/organization-schema'
import { draftMode } from 'next/headers'

import './globals.css'

const anuphan = Anuphan({
  subsets: ['thai', 'latin'],
  display: 'swap',
  variable: '--font-anuphan',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F7F6F2',
}

export async function generateMetadata(): Promise<Metadata> {
  const baseURL = getServerSideURL()
  const ogImageUrl = `${baseURL}${site.seo.ogImage}`

  return {
    metadataBase: new URL(baseURL),
    title: site.seo.title,
    description: site.seo.description,
    keywords: site.seo.keywords,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    icons: {
      icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
      apple: [{ url: '/favicon.svg' }],
    },
    openGraph: {
      title: site.seo.title,
      description: site.seo.description,
      url: baseURL,
      siteName: `${site.name} ปากซอยชักพระ 6`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: site.seo.title }],
      locale: 'th_TH',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: site.seo.title,
      description: site.seo.description,
      images: [ogImageUrl],
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const baseURL = getServerSideURL()

  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebSiteSchema()

  return (
    <html className={cn(anuphan.variable, GeistMono.variable)} lang="th" suppressHydrationWarning>
      <head>
        <InitTheme />
        <noscript>
          <style>{`[data-reveal],.fade-in,.mask-line>span{opacity:1!important;transform:none!important}.clip-reveal{clip-path:none!important}`}</style>
        </noscript>

        {/* Geo tags — Google Maps local pack signals */}
        <meta name="geo.region" content="TH-10" />
        <meta name="geo.placename" content="Taling Chan, Bangkok, Thailand" />
        <meta name="geo.position" content={`${site.geo.lat};${site.geo.lng}`} />
        <meta name="ICBM" content={`${site.geo.lat}, ${site.geo.lng}`} />
        <meta name="business:contact_data:street_address" content={site.address.street} />
        <meta name="business:contact_data:locality" content="ตลิ่งชัน" />
        <meta name="business:contact_data:region" content={site.address.province} />
        <meta name="business:contact_data:postal_code" content={site.address.postalCode} />
        <meta name="business:contact_data:country_name" content="Thailand" />
        <meta name="business:contact_data:phone_number" content={site.phone.e164} />

        <link rel="alternate" hrefLang="th" href={`${baseURL}/`} />
        <link rel="alternate" hrefLang="x-default" href={`${baseURL}/`} />

        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />
      </head>
      <body className="pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          <SiteHeader />
          {children}
          <SiteFooter />
          <ContactDock />
        </Providers>
      </body>
    </html>
  )
}
