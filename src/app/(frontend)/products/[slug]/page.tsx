import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import ProductDetailClient from './page.client'

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
  const product = await queryProductBySlug({ slug })

  if (!product) {
    return {
      title: 'ไม่พบสินค้า',
    }
  }

  const description = product.shortDescription || (typeof product.description === 'string' ? product.description : product.title)
  
  return {
    title: `${product.title} | JMC`,
    description: description,
    openGraph: {
      title: product.title,
      description: description,
      images: product.images?.[0]?.image ? [
        {
          url: typeof product.images[0].image === 'object' 
            ? product.images[0].image.url || ''
            : '',
          width: 800,
          height: 600,
          alt: product.title,
        }
      ] : [],
    },
  }
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

  return products.docs?.map(({ slug }) => ({
    slug,
  })) || []
} 