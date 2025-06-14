'use client'
import { cn } from '@/utilities/ui'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'

export type ProductCardData = Pick<
  Product,
  | 'id'
  | 'title'
  | 'slug'
  | 'price'
  | 'salePrice'
  | 'shortDescription'
  | 'images'
  | 'categories'
  | 'stock'
  | 'status'
  | 'variants'
>

export const ProductCard: React.FC<{
  className?: string
  product: ProductCardData
  colorTheme?: string
}> = ({ className, product, colorTheme = 'light' }) => {
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const { title, slug, price, salePrice, shortDescription, images, categories, stock, status, variants } =
    product

  useEffect(() => {
    setIsClient(true)
  }, [])

  const isDarkTheme = colorTheme === 'dark'
  
  // Calculate price range and sale info
  const getPriceInfo = () => {
    if (!variants || variants.length === 0) {
      // No variants - use base price
      const isOnSale = salePrice && salePrice < price
      const discountPercent = isOnSale ? Math.round(((price - salePrice) / price) * 100) : 0
      return {
        displayPrice: isOnSale ? salePrice : price,
        originalPrice: isOnSale ? price : null,
        isOnSale,
        discountPercent,
        priceRange: null
      }
    }
    
    // Has variants - calculate range
    const activeVariants = variants.filter(v => v.variantStatus === 'active')
    if (activeVariants.length === 0) {
      // No active variants - fallback to base price
      const isOnSale = salePrice && salePrice < price
      return {
        displayPrice: isOnSale ? salePrice : price,
        originalPrice: isOnSale ? price : null,
        isOnSale,
        discountPercent: isOnSale ? Math.round(((price - salePrice) / price) * 100) : 0,
        priceRange: null
      }
    }
    
    // Get price range from active variants
    const prices = activeVariants.map(v => v.variantSalePrice && v.variantSalePrice < v.variantPrice ? v.variantSalePrice : v.variantPrice)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    
    // Check if any variant is on sale
    const hasVariantOnSale = activeVariants.some(v => v.variantSalePrice && v.variantSalePrice < v.variantPrice)
    
    return {
      displayPrice: minPrice,
      originalPrice: null,
      isOnSale: hasVariantOnSale,
      discountPercent: 0, // Don't show specific discount for variants
      priceRange: minPrice === maxPrice ? null : { min: minPrice, max: maxPrice }
    }
  }
  
  const priceInfo = getPriceInfo()
  const isOutOfStock = variants && variants.length > 0 
    ? variants.every(v => v.variantStatus === 'out_of_stock' || v.variantStock === 0)
    : (status === 'out_of_stock' || stock === 0)
  const isInactive = status === 'inactive' || status === 'discontinued'

  // Get first image
  const firstImage = images && images.length > 0 ? images[0] : null
  const imageResource = firstImage?.image as MediaType | undefined

  const href = `/products/${slug}`

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isClient && href && !isInactive && !isOutOfStock) {
      router.push(href)
    }
  }

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isClient && href) {
      router.push(href)
    }
  }

  // Debug information
  if (process.env.NODE_ENV === 'development') {
    console.log('ProductCard Debug:', {
      title,
      slug,
      href,
      isClient,
      isInactive,
      isOutOfStock,
    })
  }

  return (
    <article
      className={cn(
        `group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${
          isDarkTheme
            ? 'bg-gray-800 border border-gray-700 hover:border-gray-600'
            : 'bg-white border border-gray-200 hover:border-blue-300'
        } ${isInactive ? 'opacity-60' : ''}`,
        className,
      )}
      onClick={handleCardClick}
    >
      {/* Sale Badge */}
      {priceInfo.isOnSale && !isInactive && (
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
          <div className="bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
            {priceInfo.discountPercent > 0 ? `-${priceInfo.discountPercent}%` : 'SALE'}
          </div>
        </div>
      )}

      {/* Out of Stock Badge */}
      {isOutOfStock && (
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
          <div className="bg-gray-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
            หมด
          </div>
        </div>
      )}

      {/* Image Section */}
      <div className="relative w-full aspect-square overflow-hidden">
        {!imageResource && (
          <div
            className={`w-full h-full flex items-center justify-center ${
              isDarkTheme ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
            }`}
          >
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-2 opacity-50"
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
              <p className="text-sm">ไม่มีรูปภาพ</p>
            </div>
          </div>
        )}
        {imageResource && (
          <div className="relative w-full h-full">
            <Media
              resource={imageResource}
              size="400px"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Inactive Overlay */}
            {isInactive && (
              <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">ไม่พร้อมขาย</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 lg:p-6">
        {/* Categories - Hide on mobile to save space */}
        {categories && categories.length > 0 && (
          <div className="mb-2 hidden sm:block">
            <div className="flex flex-wrap gap-1">
              {categories.slice(0, 1).map((category, index) => {
                if (typeof category === 'object') {
                  return (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        isDarkTheme ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {category.title}
                    </span>
                  )
                }
                return null
              })}
            </div>
          </div>
        )}

        {/* Title */}
        <h3
          className={`text-sm sm:text-base lg:text-lg font-bold leading-tight mb-1 sm:mb-2 transition-colors duration-300 line-clamp-2 ${
            isDarkTheme
              ? 'text-gray-100 group-hover:text-blue-400'
              : 'text-gray-800 group-hover:text-blue-600'
          }`}
        >
          <button onClick={handleLinkClick} className="hover:no-underline text-left w-full">
            {title}
          </button>
        </h3>

        {/* Description - Hide on mobile */}
        {shortDescription && (
          <p
            className={`text-xs sm:text-sm leading-relaxed line-clamp-1 sm:line-clamp-2 mb-2 sm:mb-3 hidden sm:block ${
              isDarkTheme ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {shortDescription}
          </p>
        )}

        {/* Price Section */}
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <div className="flex flex-col gap-1">
            {priceInfo.priceRange ? (
              // Show price range for variants
              <div className="flex flex-col">
                <span
                  className={`text-base sm:text-lg lg:text-xl font-bold ${isDarkTheme ? 'text-gray-100' : 'text-gray-800'}`}
                >
                  ฿{priceInfo.priceRange.min.toLocaleString()} - ฿{priceInfo.priceRange.max.toLocaleString()}
                </span>
                {priceInfo.isOnSale && (
                  <span className={`text-xs ${isDarkTheme ? 'text-red-400' : 'text-red-600'}`}>
                    มีราคาพิเศษ
                  </span>
                )}
              </div>
            ) : priceInfo.originalPrice ? (
              // Show sale price
              <div className="flex items-center gap-1 sm:gap-2">
                <span
                  className={`text-base sm:text-lg lg:text-xl font-bold ${isDarkTheme ? 'text-red-400' : 'text-red-600'}`}
                >
                  ฿{priceInfo.displayPrice.toLocaleString()}
                </span>
                <span
                  className={`text-xs sm:text-sm line-through ${
                    isDarkTheme ? 'text-gray-500' : 'text-gray-400'
                  }`}
                >
                  ฿{priceInfo.originalPrice.toLocaleString()}
                </span>
              </div>
            ) : (
              // Show regular price
              <span
                className={`text-base sm:text-lg lg:text-xl font-bold ${isDarkTheme ? 'text-gray-100' : 'text-gray-800'}`}
              >
                {variants && variants.length > 0 ? 
                  `เริ่มต้น ฿${priceInfo.displayPrice.toLocaleString()}` : 
                  `฿${priceInfo.displayPrice.toLocaleString()}`
                }
              </span>
            )}
          </div>

          {/* Stock Info - Smaller on mobile */}
          {!variants || variants.length === 0 ? (
            stock !== undefined && stock !== null && stock > 0 && stock <= 5 && (
              <span className="text-xs text-orange-500 font-medium hidden sm:inline">เหลือ {stock}</span>
            )
          ) : (
            <span className="text-xs text-blue-600 font-medium hidden sm:inline">
              {variants.filter(v => v.variantStatus === 'active').length} ตัวเลือก
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="flex gap-2">
          <button
            onClick={handleLinkClick}
            className={`flex-1 text-center py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 ${
              isInactive || isOutOfStock
                ? isDarkTheme
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : isDarkTheme
                  ? 'bg-blue-600 text-white hover:bg-blue-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            disabled={isInactive || isOutOfStock}
          >
            {isInactive ? 'ไม่พร้อมขาย' : isOutOfStock ? 'หมด' : 'ดูสินค้า'}
          </button>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
          isDarkTheme ? 'ring-2 ring-blue-500/50' : 'ring-2 ring-blue-400/50'
        }`}
      />
    </article>
  )
}
