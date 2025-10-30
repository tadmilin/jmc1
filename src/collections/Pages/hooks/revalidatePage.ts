import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import type { Page } from '../../../payload-types'

// Safe revalidation function to avoid server-only import errors
const safeRevalidate = async (path?: string, tag?: string) => {
  try {
    if (typeof window === 'undefined') {
      const { revalidatePath, revalidateTag } = await import('next/cache')
      if (path) revalidatePath(path)
      if (tag) revalidateTag(tag)
    }
  } catch (error) {
    console.warn('Revalidation failed:', error)
  }
}

export const revalidatePage: CollectionAfterChangeHook<Page> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`

      payload.logger.info(`Revalidating page at path: ${path}`)

      await safeRevalidate(path)
      await safeRevalidate(undefined, 'pages-sitemap')
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`

      payload.logger.info(`Revalidating old page at path: ${oldPath}`)

      await safeRevalidate(oldPath)
      await safeRevalidate(undefined, 'pages-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = async ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
    await safeRevalidate(path)
    await safeRevalidate(undefined, 'pages-sitemap')
  }

  return doc
}
