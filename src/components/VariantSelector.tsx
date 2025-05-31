'use client'

import React, { useState, useEffect } from 'react'
import {
  ProductWithVariants,
  ProductVariant,
  getActiveVariants,
  getDefaultVariant,
} from '@/utilities/variants'

interface VariantSelectorProps {
  product: ProductWithVariants
  onVariantChange?: (variant: ProductVariant | null) => void
  className?: string
}

export function VariantSelector({
  product,
  onVariantChange,
  className = '',
}: VariantSelectorProps) {
  const activeVariants = getActiveVariants(product)
  const defaultVariant = getDefaultVariant(product)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(defaultVariant)

  useEffect(() => {
    if (defaultVariant && !selectedVariant) {
      setSelectedVariant(defaultVariant)
      onVariantChange?.(defaultVariant)
    }
  }, [defaultVariant, selectedVariant, onVariantChange])

  // If no variants available, don't render anything
  if (activeVariants.length === 0) {
    return null
  }

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant)
    onVariantChange?.(variant)
  }

  return (
    <div className={`variant-selector ${className}`}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">เลือกขนาด/ประเภท</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {activeVariants.map((variant, index) => {
            const isSelected = selectedVariant?.variantName === variant.variantName
            const isOutOfStock =
              variant.variantStock <= 0 || variant.variantStatus === 'out_of_stock'

            return (
              <button
                key={`${variant.variantName}-${index}`}
                onClick={() => !isOutOfStock && handleVariantSelect(variant)}
                disabled={isOutOfStock}
                className={`
                  relative p-3 text-sm font-medium border rounded-lg transition-all duration-200
                  ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }
                  ${isOutOfStock ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'cursor-pointer'}
                `}
              >
                <div className="flex flex-col items-center space-y-1">
                  <span className="font-medium">{variant.variantName}</span>
                  <div className="text-xs">
                    {variant.variantSalePrice ? (
                      <div className="flex flex-col">
                        <span className="text-red-600 font-semibold">
                          ฿{variant.variantSalePrice.toLocaleString('th-TH')}
                        </span>
                        <span className="text-gray-500 line-through">
                          ฿{variant.variantPrice.toLocaleString('th-TH')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-900 font-semibold">
                        ฿{variant.variantPrice.toLocaleString('th-TH')}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                    {isOutOfStock ? 'หมด' : `เหลือ ${variant.variantStock}`}
                  </span>
                </div>

                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {selectedVariant && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">ข้อมูลขนาดที่เลือก</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">ขนาด:</span>
              <span className="ml-2 font-medium">{selectedVariant.variantName}</span>
            </div>
            <div>
              <span className="text-gray-600">ราคา:</span>
              <span className="ml-2 font-medium">
                {selectedVariant.variantSalePrice ? (
                  <>
                    <span className="text-red-600">
                      ฿{selectedVariant.variantSalePrice.toLocaleString('th-TH')}
                    </span>
                    <span className="ml-2 text-gray-500 line-through text-xs">
                      ฿{selectedVariant.variantPrice.toLocaleString('th-TH')}
                    </span>
                  </>
                ) : (
                  <span>฿{selectedVariant.variantPrice.toLocaleString('th-TH')}</span>
                )}
              </span>
            </div>
            <div>
              <span className="text-gray-600">คงเหลือ:</span>
              <span className="ml-2 font-medium">{selectedVariant.variantStock} ชิ้น</span>
            </div>
            {selectedVariant.variantSku && (
              <div>
                <span className="text-gray-600">รหัสสินค้า:</span>
                <span className="ml-2 font-medium">{selectedVariant.variantSku}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default VariantSelector
