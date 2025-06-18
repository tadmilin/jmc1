import type { Page, Post } from '@/payload-types'
import { PRODUCT_BUTTON_CONFIG } from '@/config/product-buttons'

// Type for link data
export type LinkData = {
  type?: ('reference' | 'custom') | null
  newTab?: boolean | null
  reference?: 
    | ({
        relationTo: 'pages'
        value: string | Page
      } | null)
    | ({
        relationTo: 'posts'
        value: string | Post
      } | null)
  url?: string | null
  appearance?: ('default' | 'outline') | null
}

/**
 * Resolves a link data object to a URL string
 */
export function resolveLinkUrl(linkData: LinkData | null | undefined, fallbackUrl: string): string {
  if (!linkData) {
    return fallbackUrl
  }

  // Handle reference-type links
  if (linkData.type === 'reference' && linkData.reference) {
    if (typeof linkData.reference === 'object' && 'slug' in linkData.reference) {
      return `/${linkData.reference.slug}`
    }
  }

  // Handle custom URL links
  if (linkData.type === 'custom' && linkData.url) {
    return linkData.url
  }

  // Return fallback if no valid URL found
  return fallbackUrl
}

/**
 * Checks if a URL is external (requires window.open)
 */
export function isExternalUrl(url: string): boolean {
  return PRODUCT_BUTTON_CONFIG.externalUrlPatterns.some(pattern => url.startsWith(pattern))
}

/**
 * Adds query parameters to a URL
 */
export function addQueryParams(url: string, params: Record<string, string>): string {
  const urlObj = new URL(url, window.location.origin)
  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value)
  })
  
  // For relative URLs, return just the pathname + search
  if (!isExternalUrl(url)) {
    return urlObj.pathname + urlObj.search
  }
  
  return urlObj.toString()
}

/**
 * Opens a URL using the appropriate method (router.push or window.open)
 */
export function openUrl(url: string, newTab: boolean = false, router: { push: (url: string) => void }) {
  if (isExternalUrl(url) || newTab) {
    window.open(url, newTab ? '_blank' : '_self')
  } else {
    router.push(url)
  }
}

/**
 * Creates product parameters for quote requests
 */
export function createProductParams(product: { id: string; title: string; price: number }, selectedVariantPrice?: number): Record<string, string> {
  return {
    productId: product.id,
    productName: product.title,
    productPrice: (selectedVariantPrice || product.price).toString()
  }
} 