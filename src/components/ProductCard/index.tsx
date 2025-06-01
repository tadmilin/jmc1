'use client'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
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
>

export const ProductCard: React.FC<{
  className?: string
  product: ProductCardData
  colorTheme?: string
}> = ({ className, product, colorTheme = 'light' }) => {
  const { title, slug, price, salePrice, shortDescription, images, categories, stock, status } =
    product

  const isDarkTheme = colorTheme === 'dark'
  const isOnSale = salePrice && salePrice < price
  const discountPercent = isOnSale ? Math.round(((price - salePrice) / price) * 100) : 0
  const isOutOfStock = status === 'out_of_stock' || stock === 0
  const isInactive = status === 'inactive' || status === 'discontinued'

  // Get first image
  const firstImage = images && images.length > 0 ? images[0] : null
  const imageResource = firstImage?.image as MediaType | undefined

  const href = `/products/${slug}`

  return (
    <article
      className={cn(
        `group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
          isDarkTheme
            ? 'bg-gray-800 border border-gray-700 hover:border-gray-600'
            : 'bg-white border border-gray-200 hover:border-blue-300'
        } ${isInactive ? 'opacity-60' : ''}`,
        className,
      )}
    >
      {/* Sale Badge */}
      {isOnSale && !isInactive && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{discountPercent}%
          </div>
        </div>
      )}

      {/* Out of Stock Badge */}
      {isOutOfStock && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            หมด
          </div>
        </div>
      )}

      {/* Image Section */}
      <Link href={href} className="block">
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
      </Link>

      {/* Content Section */}
      <div className="p-6">
        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="mb-2">
            <div className="flex flex-wrap gap-1">
              {categories.slice(0, 2).map((category, index) => {
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
          className={`text-lg font-bold leading-tight mb-2 transition-colors duration-300 ${
            isDarkTheme
              ? 'text-gray-100 group-hover:text-blue-400'
              : 'text-gray-800 group-hover:text-blue-600'
          }`}
        >
          <Link href={href} className="hover:no-underline">
            {title}
          </Link>
        </h3>

        {/* Description */}
        {shortDescription && (
          <p
            className={`text-sm leading-relaxed line-clamp-2 mb-3 ${
              isDarkTheme ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {shortDescription}
          </p>
        )}

        {/* Price Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isOnSale ? (
              <>
                <span
                  className={`text-xl font-bold ${isDarkTheme ? 'text-red-400' : 'text-red-600'}`}
                >
                  ฿{salePrice?.toLocaleString()}
                </span>
                <span
                  className={`text-sm line-through ${
                    isDarkTheme ? 'text-gray-500' : 'text-gray-400'
                  }`}
                >
                  ฿{price.toLocaleString()}
                </span>
              </>
            ) : (
              <span
                className={`text-xl font-bold ${isDarkTheme ? 'text-gray-100' : 'text-gray-800'}`}
              >
                ฿{price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock Info */}
          {stock !== undefined && stock !== null && stock > 0 && stock <= 5 && (
            <span className="text-xs text-orange-500 font-medium">เหลือ {stock} ชิ้น</span>
          )}
        </div>

        {/* Action Button */}
        <div className="flex gap-2">
          <Link
            href={href}
            className={`flex-1 text-center py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
              isInactive || isOutOfStock
                ? isDarkTheme
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : isDarkTheme
                  ? 'bg-blue-600 text-white hover:bg-blue-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            onClick={(e) => {
              if (isInactive || isOutOfStock) {
                e.preventDefault()
              }
            }}
          >
            {isInactive ? 'ไม่พร้อมขาย' : isOutOfStock ? 'สินค้าหมด' : 'ดูรายละเอียด'}
          </Link>
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
