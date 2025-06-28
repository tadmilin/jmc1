import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import ProductDetailClient from './page.client'
import { generateProductSEO } from '@/utils/seo'

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
      description: 'ไม่พบสินค้าที่คุณต้องการ',
    }
  }

  // Generate SEO metadata using utility function
  const seoData = generateProductSEO(product, process.env.NEXT_PUBLIC_SERVER_URL || '')

  const metadata: Metadata = {
    title: `${seoData.title} | JMC`,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/products/${product.slug}`,
    },
    openGraph: {
      title: seoData.openGraph.title,
      description: seoData.openGraph.description,
      type: 'website',
      url: seoData.openGraph.url,
      siteName: 'JMC Company',
      locale: 'th_TH',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.openGraph.title,
      description: seoData.openGraph.description,
    },
  }

  // Add Open Graph and Twitter images if available
  if (seoData.openGraph.image) {
    metadata.openGraph!.images = [
      {
        url: seoData.openGraph.image,
        width: 1200,
        height: 630,
        alt: seoData.title,
      },
    ]
    metadata.twitter!.images = [seoData.openGraph.image]
  }

  // Add structured data
  if (seoData.structuredData) {
    metadata.other = {
      'script:ld+json': JSON.stringify(seoData.structuredData),
    }
  }

  return metadata
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
