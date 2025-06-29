import type { Product, Media } from '@/payload-types'

// Type definitions for SEO metadata
export type SEOMetadata = {
  title: string
  description: string
  keywords?: string | null
  openGraph: {
    title: string
    description: string
    image?: string
    type: 'product' | 'website'
    url?: string
  }
  structuredData?: ProductStructuredData
}

export type ProductStructuredData = {
  '@context': 'https://schema.org'
  '@type': 'Product'
  name: string
  description?: string
  image?: string[]
  brand?: {
    '@type': 'Brand'
    name: string
  }
  model?: string
  sku?: string
  gtin?: string
  mpn?: string
  offers: {
    '@type': 'Offer'
    priceCurrency: 'THB'
    price: number
    priceValidUntil?: string
    availability: string
    condition: string
    seller: {
      '@type': 'Organization'
      name: string
    }
  }
  aggregateRating?: {
    '@type': 'AggregateRating'
    ratingValue: number
    reviewCount: number
  }
}

/**
 * Generates SEO metadata for a product
 */
export function generateProductSEO(product: Product, baseUrl: string = ''): SEOMetadata {
  // Fallback values
  const defaultTitle = product.title
  const defaultDescription =
    product.shortDescription ||
    (product.description ? stripHtml(JSON.stringify(product.description)) : product.title)

  // Meta tags
  const seoTitle = product.meta?.title || defaultTitle
  const seoDescription = product.meta?.description || defaultDescription
  const keywords = product.meta?.keywords || null

  // Open Graph
  const ogTitle = product.openGraph?.title || seoTitle
  const ogDescription = product.openGraph?.description || seoDescription
  const ogImage = getImageUrl(product.openGraph?.image || getFirstProductImage(product))

  // Structured Data
  const structuredData = generateProductStructuredData(product, baseUrl)

  return {
    title: seoTitle,
    description: seoDescription,
    keywords,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      image: ogImage,
      type: 'product',
      url: baseUrl ? `${baseUrl}/products/${product.slug}` : undefined,
    },
    structuredData,
  }
}

/**
 * Generates structured data (JSON-LD) for a product
 */
export function generateProductStructuredData(
  product: Product,
  baseUrl: string = '',
): ProductStructuredData {
  const currentPrice = getCurrentPrice(product)
  const images = getProductImages(product)

  const structuredData: ProductStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description:
      product.shortDescription ||
      stripHtml(product.description ? JSON.stringify(product.description) : ''),
    image: images,
    sku: product.sku || undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'THB',
      price: currentPrice,
      availability: mapAvailability(product.structuredData?.availability || 'in_stock'),
      condition: mapCondition(product.structuredData?.condition || 'new'),
      seller: {
        '@type': 'Organization',
        name: 'JMC Company', // TODO: Make this configurable
      },
    },
  }

  // Add optional fields
  if (product.structuredData?.brand) {
    structuredData.brand = {
      '@type': 'Brand',
      name: product.structuredData.brand,
    }
  }

  if (product.structuredData?.model) {
    structuredData.model = product.structuredData.model
  }

  if (product.structuredData?.gtin) {
    structuredData.gtin = product.structuredData.gtin
  }

  if (product.structuredData?.mpn) {
    structuredData.mpn = product.structuredData.mpn
  }

  if (product.structuredData?.priceValidUntil) {
    structuredData.offers.priceValidUntil = new Date(product.structuredData.priceValidUntil)
      .toISOString()
      .split('T')[0]
  }

  return structuredData
}

/**
 * Gets the current effective price (sale price if available, otherwise regular price)
 */
function getCurrentPrice(product: Product): number {
  if (product.salePrice && product.salePrice > 0 && product.salePrice < product.price) {
    return product.salePrice
  }
  return product.price
}

/**
 * Gets all product images as URLs
 */
function getProductImages(product: Product): string[] {
  if (!product.images || product.images.length === 0) return []

  return product.images.map((img) => getImageUrl(img.image)).filter(Boolean) as string[]
}

/**
 * Gets the first product image
 */
function getFirstProductImage(product: Product): string | Media | undefined {
  if (!product.images || product.images.length === 0) return undefined
  return product.images[0]?.image
}

/**
 * Extracts URL from media object or returns string as-is
 */
function getImageUrl(image: string | Media | undefined): string | undefined {
  if (!image) return undefined
  if (typeof image === 'string') return image
  return image.url || undefined
}

/**
 * Maps internal availability status to Schema.org format
 */
function mapAvailability(availability: string): string {
  const mappings: Record<string, string> = {
    in_stock: 'https://schema.org/InStock',
    out_of_stock: 'https://schema.org/OutOfStock',
    preorder: 'https://schema.org/PreOrder',
    discontinued: 'https://schema.org/Discontinued',
  }
  return mappings[availability] || 'https://schema.org/InStock'
}

/**
 * Maps internal condition to Schema.org format
 */
function mapCondition(condition: string): string {
  const mappings: Record<string, string> = {
    new: 'https://schema.org/NewCondition',
    used: 'https://schema.org/UsedCondition',
    refurbished: 'https://schema.org/RefurbishedCondition',
    damaged: 'https://schema.org/DamagedCondition',
  }
  return mappings[condition] || 'https://schema.org/NewCondition'
}

/**
 * Strips HTML tags from rich text content
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

/**
 * Truncates text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3).trim() + '...'
}
