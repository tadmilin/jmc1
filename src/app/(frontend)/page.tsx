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
import { deliveries } from '@/content/deliveries'
import { promos } from '@/content/promos'
import { site } from '@/content/site'
import { getServerSideURL } from '@/utilities/getURL'

/**
 * Home is code-owned (docs/redesign-2026.md). The CMS "home" page document is no longer rendered;
 * only the category tiles read Payload, through src/data/categories.ts.
 */
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const baseURL = getServerSideURL()
  return {
    title: site.seo.title,
    description: site.seo.description,
    alternates: { canonical: `${baseURL}/` },
  }
}

export default function HomePage() {
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
