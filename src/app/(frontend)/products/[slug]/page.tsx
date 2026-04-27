import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import ProductDetailClient from './page.client'
import { generateMeta } from '@/utilities/generateMeta'

// ISR — render ครั้งแรกตาม request, cache 1 ชั่วโมง
export const revalidate = 3600

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

