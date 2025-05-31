'use client'

import React, { useState, useEffect } from 'react'
import { Media } from '@/components/Media'

interface ProductImageGalleryProps {
  mainImages: any[]
  variantImages?: any[]
  productTitle: string
  isOnSale?: boolean
  discountPercent?: number
  isOutOfStock?: boolean
  isInactive?: boolean
}

export function ProductImageGallery({
  mainImages,
  variantImages,
  productTitle,
  isOnSale = false,
  discountPercent = 0,
  isOutOfStock = false,
  isInactive = false,
}: ProductImageGalleryProps) {
  const [currentImages, setCurrentImages] = useState(mainImages)

  // Update current images when variant images change
  useEffect(() => {
    if (variantImages && variantImages.length > 0) {
      setCurrentImages(variantImages)
    } else {
      setCurrentImages(mainImages)
    }
  }, [variantImages, mainImages])

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
        {currentImages && currentImages.length > 0 && currentImages[0] ? (
          <Media resource={currentImages[0]} className="w-full h-full object-cover" size="600px" />
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

      {/* Additional Images */}
      {currentImages && currentImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {currentImages.slice(1, 5).map((img, index) => (
            <div key={index} className="aspect-square bg-white rounded-lg overflow-hidden shadow">
              {img && <Media resource={img} className="w-full h-full object-cover" size="150px" />}
            </div>
          ))}
        </div>
      )}

      {/* Variant Images Preview - Show smaller variant images if different from main */}
      {variantImages && variantImages.length > 0 && variantImages !== mainImages && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">รูปภาพของขนาดที่เลือก</h4>
          <div className="grid grid-cols-6 gap-2">
            {variantImages.slice(0, 6).map((img, index) => (
              <div
                key={index}
                className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm border-2 border-blue-200"
              >
                {img && (
                  <Media resource={img} className="w-full h-full object-cover" size="100px" />
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
