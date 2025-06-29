import React from 'react'
import { Metadata } from 'next'
import { generateMeta } from '@/utilities/generateMeta'
import CategoriesPageClient from './page.client'

export default function CategoriesPage() {
  return <CategoriesPageClient />
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({ doc: null, pageType: 'category' })
}
