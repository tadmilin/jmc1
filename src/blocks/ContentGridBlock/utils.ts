import type { Category } from '@/payload-types'
import { GRID_CLASSES } from './constants'

/**
 * Get URL from internal link object
 */
export const getInternalUrl = (link: any): string => {
  if (!link) return '#'

  const relationTo = link.relationTo
  const value = typeof link.value === 'object' ? link.value?.slug : link.value

  if (!value) return '#'

  if (relationTo === 'pages') {
    return value === 'home' ? '/' : `/${value}`
  } else if (relationTo === 'posts') {
    return `/posts/${value}`
  }

  return '#'
}

/**
 * Extract category IDs from array of categories (string or Category objects)
 */
export const getCategoryIds = (cats: (string | Category)[]): string[] => {
  return cats.map((cat) => (typeof cat === 'string' ? cat : cat.id)).filter(Boolean)
}

/**
 * Get grid CSS classes based on columns setting
 */
export const getGridClasses = (columns: keyof typeof GRID_CLASSES): string => {
  return GRID_CLASSES[columns] || GRID_CLASSES.auto
}

/**
 * Build API URL with query parameters
 */
export const buildApiUrl = (endpoint: string, params: Record<string, any>): string => {
  const url = new URL(endpoint, window.location.origin)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value))
    }
  })

  return url.toString()
}

/**
 * Create where clause for categories
 */
export const createCategoriesWhereClause = (categoryIds: string[]): string => {
  if (categoryIds.length === 0) return ''

  const whereClause = JSON.stringify({
    categories: {
      in: categoryIds,
    },
  })

  return `&where=${encodeURIComponent(whereClause)}`
}
