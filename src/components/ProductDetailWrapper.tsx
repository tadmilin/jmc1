'use client'

import React, { useState } from 'react'
import { ProductDetailClient } from '@/components/ProductDetailClient'
import { ProductImageGallery } from '@/components/ProductImageGallery'
import type { ProductWithVariants } from '@/utilities/variants'

interface ProductDetailWrapperProps {
  product: ProductWithVariants
}

export function ProductDetailWrapper({ product }: ProductDetailWrapperProps) {
  const [variantImages, setVariantImages] = useState<any[] | undefined>(undefined)

  // Get main product images
  const mainImages = (product as any).images?.map((img: any) => img.image) || []

  // Calculate badges info
  const isOnSale = !!(product.salePrice && product.salePrice < product.price)
  const discountPercent =
    isOnSale && product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0
  const isOutOfStock = !!(product.status === 'out_of_stock' || product.stock === 0)
  const isInactive = !!(product.status === 'inactive' || product.status === 'discontinued')

  const handleVariantImageChange = (images: any[]) => {
    setVariantImages(images)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
      {/* Product Images */}
      <ProductImageGallery
        mainImages={mainImages}
        variantImages={variantImages}
        productTitle={product.title}
        isOnSale={isOnSale}
        discountPercent={discountPercent}
        isOutOfStock={isOutOfStock}
        isInactive={isInactive}
      />

      {/* Product Info */}
      <ProductDetailClient product={product} onVariantImageChange={handleVariantImageChange} />
    </div>
  )
}

export default ProductDetailWrapper
