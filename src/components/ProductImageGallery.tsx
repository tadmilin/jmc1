'use client'

import React from 'react'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

interface ProductImageGalleryProps {
  mainImages: MediaType[]
  variantImages?: MediaType[]
  productTitle: string
  isOnSale?: boolean
  discountPercent?: number
  isOutOfStock?: boolean
  isInactive?: boolean
}

export function ProductImageGallery({
  mainImages,
  variantImages,
  productTitle: _productTitle,
  isOnSale = false,
  discountPercent = 0,
  isOutOfStock = false,
  isInactive = false,
}: ProductImageGalleryProps) {
  return (
    <div className="space-y-4">
      {/* Main Image - Always show main product images */}
      <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
        {mainImages && mainImages.length > 0 && mainImages[0] ? (
          <Media resource={mainImages[0]} className="w-full h-full object-cover" size="600px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg
                className="w-24 h-24 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <p className="text-lg">ไม่มีรูปภาพ</p>
            </div>
          </div>
        )}

        {/* Badges */}
        {isOnSale && !isInactive && (
          <div className="absolute top-4 left-4">
            <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
              ลด {discountPercent}%
            </div>
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute top-4 right-4">
            <div className="bg-gray-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
              สินค้าหมด
            </div>
          </div>
        )}
      </div>

      {/* Additional Main Images */}
      {mainImages && mainImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {mainImages.slice(1, 5).map((img, index) => (
            <div key={index} className="aspect-square bg-white rounded-lg overflow-hidden shadow">
              {img && <Media resource={img} className="w-full h-full object-cover" size="150px" />}
            </div>
          ))}
        </div>
      )}

      {/* Variant Images - Show larger variant images when selected */}
      {variantImages && variantImages.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">รูปภาพของขนาดที่เลือก</h4>
          <div className="grid grid-cols-2 gap-6">
            {variantImages.slice(0, 4).map((img, index) => (
              <div
                key={index}
                className="aspect-square bg-white rounded-xl overflow-hidden shadow-lg border-3 border-blue-300 hover:border-blue-500 transition-colors"
              >
                {img && (
                  <Media resource={img} className="w-full h-full object-cover" size="500px" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductImageGallery
