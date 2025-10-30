import type { GlobalAfterChangeHook } from 'payload'

// Safe revalidation function to avoid server-only import errors
const safeRevalidateTag = async (tag: string) => {
  try {
    if (typeof window === 'undefined') {
      const { revalidateTag } = await import('next/cache')
      revalidateTag(tag)
    }
  } catch (error) {
    console.warn('Revalidation failed:', error)
  }
}

export const revalidateCategoryShowcase: GlobalAfterChangeHook = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating category showcase`)

    await safeRevalidateTag('global_category-showcase')
  }

  return doc
}
