import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import ProductDetailClient from './page.client'
import { generateProductSEO } from '@/utils/seo'
import { generateMeta } from '@/utilities/generateMeta'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  
  const product = await queryProductBySlug({ slug })

  if (!product) {
    return notFound()
  }

  return <ProductDetailClient product={product} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const product = await queryProductBySlug({
    slug,
  })

  return generateMeta({ doc: product, pageType: 'product' })
}

const queryProductBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
      status: {
        equals: 'active',
      },
    },
    depth: 2,
  })

  return result.docs?.[0] || null
})

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  
  const products = await payload.find({
    collection: 'products',
    limit: 1000,
    pagination: false,
    where: {
      status: {
        equals: 'active',
      },
    },
    select: {
      slug: true,
    },
  })

  return (
    products.docs?.map(({ slug }) => ({
    slug,
  })) || []
  )
} 
