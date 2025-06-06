import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { toKebabCase } from '@/utilities/toKebabCase'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  const url = '/' + slug

  let page: RequiredDataFromCollectionSlug<'pages'> | null

  if (slug === 'draft-preview' && draft) {
    page = await queryPageBySlug({ slug: 'home', depth: 2 })
  } else {
    page = await queryPageBySlug({ slug, depth: 2 })
  }

  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article className="pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} colorTheme={hero?.colorTheme || 'light'} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const page = await queryPageBySlug({
    slug,
    depth: 2,
  })

  return generateMeta({
    title: page?.meta?.title,
    description: page?.meta?.description,
    image: page?.meta?.image
  })
}

const queryPageBySlug = cache(async ({ slug, depth }: { slug: string; depth: number }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
    depth,
  })

  let doc = result.docs?.[0] || null

  // If no published document was found and we are not in draft mode,
  // attempt to fetch the latest draft version (if it exists) and
  // bypass collection-level access controls.
  if (!doc && !draft) {
    const draftResult = await payload.find({
      collection: 'pages',
      draft: true,
      limit: 1,
      pagination: false,
      overrideAccess: true,
      where: {
        slug: {
          equals: slug,
        },
      },
      depth,
    })

    doc = draftResult.docs?.[0] || null
  }

  return doc
})
