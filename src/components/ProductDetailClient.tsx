'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { VariantSelector } from '@/components/VariantSelector'
import {
  hasVariants,
  getDefaultVariant,
  getVariantImages,
  type ProductWithVariants,
  type ProductVariant,
} from '@/utilities/variants'

interface ProductDetailClientProps {
  product: ProductWithVariants
  onVariantImageChange?: (images: any[]) => void
}

export function ProductDetailClient({ product, onVariantImageChange }: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    hasVariants(product) ? getDefaultVariant(product) : null,
  )

  // Use selected variant data or fallback to main product data
  const currentPrice = selectedVariant?.variantPrice ?? product.price
  const currentSalePrice = selectedVariant?.variantSalePrice ?? product.salePrice
  const currentStock = selectedVariant?.variantStock ?? product.stock
  const currentSku = selectedVariant?.variantSku ?? product.sku

  const isOnSale = currentSalePrice && currentSalePrice < currentPrice
  const isOutOfStock = product.status === 'out_of_stock' || currentStock === 0
  const isInactive = product.status === 'inactive' || product.status === 'discontinued'

  const handleVariantChange = (variant: ProductVariant | null) => {
    setSelectedVariant(variant)

    // Get variant images and send to parent
    if (variant && onVariantImageChange) {
      const variantImages = getVariantImages(product as any, variant)
      onVariantImageChange(variantImages)
    } else if (onVariantImageChange) {
      // If no variant selected, send main product images
      const mainImages = (product as any).images?.map((img: any) => img.image) || []
      onVariantImageChange(mainImages)
    }
  }

  useEffect(() => {
    if (onVariantImageChange) {
      if (selectedVariant) {
        const variantImages = getVariantImages(product as any, selectedVariant)
        onVariantImageChange(variantImages)
      } else {
        const mainImages = (product as any).images?.map((img: any) => img.image) || []
        onVariantImageChange(mainImages)
      }
    }
  }, [selectedVariant, onVariantImageChange, product])

  return (
    <div className="space-y-6">
      {(product as any).categories &&
        Array.isArray((product as any).categories) &&
        (product as any).categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {(product as any).categories.map((category: any, index: number) => {
              if (typeof category === 'object' && category.title) {
                return (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
                  >
                    {category.title}
                  </span>
                )
              }
              return null
            })}
          </div>
        )}

      <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{product.title}</h1>

      <div className="space-y-2">
        <div className="flex items-center gap-4">
          {isOnSale ? (
            <>
              <span className="text-3xl font-bold text-red-600">
                ฿{currentSalePrice?.toLocaleString()}
              </span>
              <span className="text-xl text-gray-400 line-through">
                ฿{currentPrice.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-3xl font-bold text-gray-800">
              ฿{currentPrice.toLocaleString()}
            </span>
          )}
        </div>

        {currentStock !== undefined &&
          currentStock !== null &&
          currentStock > 0 &&
          currentStock <= 10 && (
            <p className="text-orange-500 font-medium">เหลือเพียง {currentStock} ชิ้น</p>
          )}
      </div>

      {hasVariants(product) && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <VariantSelector product={product} onVariantChange={handleVariantChange} />
        </div>
      )}

      {(product as any).shortDescription && (
        <p className="text-lg text-gray-600 leading-relaxed">{(product as any).shortDescription}</p>
      )}

      {currentSku && <p className="text-sm text-gray-500">รหัสสินค้า: {String(currentSku)}</p>}

      <div className="space-y-4">
        <div className="flex gap-4">
          {isInactive || isOutOfStock ? (
            <button
              disabled
              className="flex-1 py-4 px-6 rounded-lg font-semibold text-lg bg-gray-300 text-gray-500 cursor-not-allowed"
            >
              {isInactive ? 'ไม่พร้อมขาย' : 'สินค้าหมด'}
            </button>
          ) : (
            <Link
              href="/quote-request-standalone"
              className="flex-1 text-center py-4 px-6 rounded-lg font-semibold text-lg bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
            >
              สั่งซื้อสินค้า
            </Link>
          )}
        </div>

        <div className="flex gap-4">
          <Link
            href="/contactus"
            className="flex-1 text-center py-3 px-6 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            สอบถามข้อมูล
          </Link>
          <a
            href="tel:+66-2-123-4567"
            className="flex-1 text-center py-3 px-6 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            โทรสอบราคา
          </a>
        </div>
      </div>

      {selectedVariant && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">ข้อมูลขนาดที่เลือก:</h4>
          <div className="text-sm text-blue-700">
            <p>
              <strong>ขนาด:</strong> {selectedVariant.variantName}
            </p>
            <p>
              <strong>ราคา:</strong> ฿
              {(selectedVariant.variantSalePrice || selectedVariant.variantPrice).toLocaleString()}
            </p>
            <p>
              <strong>คงเหลือ:</strong> {selectedVariant.variantStock} ชิ้น
            </p>
            {selectedVariant.variantSku && (
              <p>
                <strong>รหัสสินค้า:</strong> {selectedVariant.variantSku}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailClient
