import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import type { Post } from '../../../payload-types'

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

export const revalidatePost: CollectionAfterChangeHook<Post> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/posts/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      await safeRevalidate(path)
      await safeRevalidate(undefined, 'posts-sitemap')
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/posts/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      await safeRevalidate(oldPath)
      await safeRevalidate(undefined, 'posts-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = async ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/posts/${doc?.slug}`

    await safeRevalidate(path)
    await safeRevalidate(undefined, 'posts-sitemap')
  }

  return doc
}
