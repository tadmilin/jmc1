import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import ProductDetailClient from './page.client'
import { generateMeta } from '@/utilities/generateMeta'
import { hasDatabaseUri } from '@/utilities/buildUtils'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  if (!hasDatabaseUri()) return []
  try {
    const payload = await getPayload({ config: configPromise })
    const products = await payload.find({
      collection: 'products',
      limit: 1000,
      pagination: false,
      where: { status: { equals: 'active' } },
      select: { slug: true },
      depth: 0,
    })
    return products.docs
      .filter((p) => !!p.slug && !p.slug.startsWith('-'))
      .map((p) => ({ slug: p.slug! }))
  } catch {
    return []
  }
}

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

  // decodeURIComponent handles Thai/Unicode slugs that may arrive percent-encoded
  const decodedSlug = decodeURIComponent(slug)

  const result = await payload.find({
    collection: 'products',
    limit: 1,
    pagination: false,
    overrideAccess: true,
    where: {
      slug: {
        equals: decodedSlug,
      },
      status: {
        equals: 'active',
      },
    },
    depth: 2,
  })

  return result.docs?.[0] || null
})

