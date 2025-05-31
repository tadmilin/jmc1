export interface ProductVariant {
  id?: string
  variantName: string
  variantPrice: number
  variantSalePrice?: number
  variantStock: number
  variantSku?: string
  variantImages?: Array<{
    image: {
      url?: string
      alt?: string
      [key: string]: unknown
    }
    alt?: string
  }>
  variantStatus: 'active' | 'inactive' | 'out_of_stock'
  isDefault: boolean
}

export interface ProductWithVariants {
  id: string
  title: string
  price: number
  salePrice?: number
  stock: number
  variants?: ProductVariant[]
  images?: Array<{
    image: {
      url?: string
      alt?: string
      [key: string]: unknown
    }
    alt?: string
  }>
  [key: string]: unknown
}

/**
 * Get the default variant for a product
 */
export function getDefaultVariant(product: ProductWithVariants): ProductVariant | null {
  if (!product.variants || product.variants.length === 0) {
    return null
  }

  const defaultVariant = product.variants.find((variant) => variant.isDefault)
  return defaultVariant || product.variants[0] || null
}

/**
 * Get available variants (active and in stock)
 */
export function getAvailableVariants(product: ProductWithVariants): ProductVariant[] {
  if (!product.variants) {
    return []
  }

  return product.variants.filter(
    (variant) => variant.variantStatus === 'active' && variant.variantStock > 0,
  )
}

/**
 * Get all active variants
 */
export function getActiveVariants(product: ProductWithVariants): ProductVariant[] {
  if (!product.variants) {
    return []
  }

  return product.variants.filter((variant) => variant.variantStatus === 'active')
}

/**
 * Check if product has variants
 */
export function hasVariants(product: ProductWithVariants): boolean {
  return product.variants && product.variants.length > 0
}

/**
 * Get variant by ID or name
 */
export function getVariantById(
  product: ProductWithVariants,
  variantId: string,
): ProductVariant | null {
  if (!product.variants) {
    return null
  }

  return (
    product.variants.find(
      (variant) => variant.id === variantId || variant.variantName === variantId,
    ) || null
  )
}

/**
 * Get total stock across all variants
 */
export function getTotalVariantStock(product: ProductWithVariants): number {
  if (!product.variants) {
    return product.stock || 0
  }

  return product.variants.reduce((total, variant) => {
    return total + (variant.variantStock || 0)
  }, 0)
}

/**
 * Get price range for variants
 */
export function getVariantPriceRange(product: ProductWithVariants): {
  min: number
  max: number
  hasSalePrice: boolean
} {
  if (!product.variants || product.variants.length === 0) {
    return {
      min: product.price || 0,
      max: product.price || 0,
      hasSalePrice: !!product.salePrice,
    }
  }

  const activeVariants = getActiveVariants(product)

  if (activeVariants.length === 0) {
    return {
      min: product.price || 0,
      max: product.price || 0,
      hasSalePrice: !!product.salePrice,
    }
  }

  const prices = activeVariants.map((variant) => variant.variantSalePrice || variant.variantPrice)
  const hasSalePrice = activeVariants.some((variant) => variant.variantSalePrice)

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    hasSalePrice,
  }
}

/**
 * Format price range display
 */
export function formatPriceRange(priceRange: { min: number; max: number }): string {
  if (priceRange.min === priceRange.max) {
    return `${priceRange.min.toLocaleString('th-TH')} บาท`
  }

  return `${priceRange.min.toLocaleString('th-TH')} - ${priceRange.max.toLocaleString('th-TH')} บาท`
}

/**
 * Get variant images or fallback to product images
 */
export function getVariantImages(product: ProductWithVariants, variant: ProductVariant): unknown[] {
  // Use variant-specific images if available
  if (variant.variantImages && variant.variantImages.length > 0) {
    return variant.variantImages.map((img) => img.image)
  }

  // Fallback to product images
  if (product.images && Array.isArray(product.images)) {
    return product.images.map((img) => img.image)
  }

  return []
}
