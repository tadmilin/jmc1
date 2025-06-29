import React from 'react'
import { Metadata } from 'next'
import { generateMeta } from '@/utilities/generateMeta'
import ProductsPageClient from './page.client'

export default function ProductsPage() {
  return <ProductsPageClient />
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({ doc: null, pageType: 'category' })
}
