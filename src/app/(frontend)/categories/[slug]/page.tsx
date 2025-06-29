import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import { generateMeta } from '@/utilities/generateMeta'
import CategoryDetailClient from './page.client'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise

  const category = await queryCategoryBySlug({ slug })

  if (!category) {
    return notFound()
  }

  return <CategoryDetailClient category={category} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const category = await queryCategoryBySlug({
    slug,
  })

  return generateMeta({ doc: category, pageType: 'category' })
}

const queryCategoryBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'categories',
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2,
  })

  return result.docs?.[0] || null
})

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'categories',
    limit: 1000,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return (
    categories.docs?.map(({ slug }) => ({
      slug,
    })) || []
  )
}
