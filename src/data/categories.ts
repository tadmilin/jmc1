import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * Data adapter for category tiles. Reads Payload today; when the catalogue moves to
 * repo JSON (docs/redesign-2026.md, phase 2) only this file changes.
 */
export type CategoryTile = {
  title: string
  slug: string
  imageUrl: string | null
}

export const getTopCategories = unstable_cache(
  async (): Promise<CategoryTile[]> => {
    try {
      const payload = await getPayload({ config: configPromise })
      const res = await payload.find({
        collection: 'categories',
        sort: 'sortOrder',
        limit: 100,
        depth: 1,
        overrideAccess: true,
      })
      return res.docs
        .filter((c) => !c.parent && c.slug && c.slug !== 'scg-category')
        .map((c) => {
          const image = c.image && typeof c.image === 'object' ? c.image : null
          return {
            title: c.title,
            slug: c.slug as string,
            imageUrl: image?.sizes?.card?.url || image?.url || null,
          }
        })
    } catch {
      // DB unavailable (e.g. at build time) — the section renders without tiles.
      return []
    }
  },
  ['home-top-categories'],
  { revalidate: 3600, tags: ['categories'] },
)
