import type { Metadata } from 'next'
import React from 'react'

import { BrandWall } from '@/components/home/BrandWall'
import { CategoryBento } from '@/components/home/CategoryBento'
import { ContactSection } from '@/components/home/ContactSection'
import { DeliveryGallery } from '@/components/home/DeliveryGallery'
import { Faq } from '@/components/home/Faq'
import { FinalCta } from '@/components/home/FinalCta'
import { Hero } from '@/components/home/Hero'
import { PromoBanner } from '@/components/home/PromoBanner'
import { ServiceArea } from '@/components/home/ServiceArea'
import { site } from '@/content/site'
import { getShowcase } from '@/data/facebook'
import { getServerSideURL } from '@/utilities/getURL'

/**
 * Home is code-owned (docs/redesign-2026.md). The CMS "home" page document is no longer rendered;
 * only the category tiles read Payload, through src/data/categories.ts. Delivery and promo photos
 * come from the Facebook Page when it is configured (src/data/facebook.ts), so the page refreshes
 * every 5 minutes and on the Page webhook.
 */
export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const baseURL = getServerSideURL()
  return {
    title: site.seo.title,
    description: site.seo.description,
    alternates: { canonical: `${baseURL}/` },
  }
}

export default async function HomePage() {
  const { deliveries, promos } = await getShowcase()
  return (
    <main id="main">
      <Hero />
      <DeliveryGallery items={deliveries} />
      <PromoBanner items={promos} />
      <BrandWall />
      <CategoryBento />
      <ServiceArea />
      <ContactSection />
      <Faq />
      <FinalCta />
    </main>
  )
}
