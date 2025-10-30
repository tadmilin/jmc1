'use client'
import React, { useEffect, useState } from 'react'
import type { ProductsBlock as ProductsBlockProps } from '@/payload-types'
import { ProductCard, type ProductCardData } from '@/components/ProductCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Custom styles for pagination
const customPaginationStyles = `
  .swiper-pagination-custom .swiper-pagination-bullet {
    width: 12px;
    height: 12px;
    background: #cbd5e1;
    opacity: 1;
    margin: 0 4px;
    border-radius: 50%;
    transition: all 0.3s ease;
  }
  .swiper-pagination-custom .swiper-pagination-bullet-active {
    background: #3b82f6;
    transform: scale(1.2);
  }
  .products-swiper {
    padding-bottom: 20px;
  }
`

export const ProductsBlock: React.FC<ProductsBlockProps & { colorTheme?: string }> = (props) => {
  const { limit = 8, showOnlyOnSale = false, categories } = props

  try {
    // Build where conditions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      _status: { equals: 'published' },
      status: { equals: 'active' },
    }

    // Filter by categories if specified
    if (categories && categories.length > 0) {
      const categoryIds = categories
        .map((cat) => (typeof cat === 'object' ? cat.id : cat))
        .filter(Boolean)

      if (categoryIds.length > 0) {
        where.categories = { in: categoryIds }
      }
    }

    // Fetch more products if we need to filter for sale items
    const safeLimit = limit || 8
    const fetchLimit = showOnlyOnSale ? Math.max(safeLimit * 3, 50) : safeLimit

    console.log('🚀 ProductsBlock Server: Fetching products...', {
      limit: fetchLimit,
      showOnlyOnSale,
    })

    const products = await getProducts({
      limit: fetchLimit,
      where,
    })

    console.log('📦 ProductsBlock Server: Received', products.totalDocs, 'products')

    let filteredProducts = products.docs || []

    // Filter for sale products if needed
    if (showOnlyOnSale) {
      filteredProducts = filteredProducts
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((product: any) => {
          const basePrice = product.price ? Number(product.price) : 0
          const baseSalePrice = product.salePrice ? Number(product.salePrice) : 0
          const hasBaseSale = baseSalePrice > 0 && baseSalePrice < basePrice

          return hasBaseSale
        })
        .slice(0, safeLimit)
    }

    // Transform to ProductCardData format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productCards = filteredProducts.map((product: any) => ({
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      images: product.images,
      shortDescription: product.shortDescription,
      categories: product.categories,
      status: product.status,
    }))

    console.log('✅ ProductsBlock Server: Sending', productCards.length, 'products to client')

    return <ProductsBlockClient {...props} products={productCards} />
  } catch (error) {
    console.error('❌ ProductsBlock Server error:', error)
    return <ProductsBlockClient {...props} products={[]} error="เกิดข้อผิดพลาดในการโหลดสินค้า" />
  }
}
