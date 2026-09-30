import type { Metadata } from 'next'
import React from 'react'

import { BrandWall } from '@/components/home/BrandWall'
import { CategoryBento } from '@/components/home/CategoryBento'
import { ContactSection } from '@/components/home/ContactSection'
import { DeliveryGallery } from '@/components/home/DeliveryGallery'
import { Faq } from '@/components/home/Faq'
import { FinalCta } from '@/components/home/FinalCta'
import { Hero } from '@/components/home/Hero'
import { HowItWorks } from '@/components/home/HowItWorks'
import { ServiceArea } from '@/components/home/ServiceArea'
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
      <BrandWall />
      <HowItWorks />
      <DeliveryGallery />
      <CategoryBento />
      <ServiceArea />
      <ContactSection />
      <Faq />
      <FinalCta />
    </main>
  )
}
