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
  const {
    title = 'สินค้าแนะนำ',
    subtitle,
    limit = 8,
    showOnlyOnSale = false,
    categories,
    layout = 'grid',
    showViewAllButton = true,
    viewAllLink = '/products',
    colorTheme = 'light',
  } = props

  const [products, setProducts] = useState<ProductCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [_error, setError] = useState<string | null>(null)

  const isDarkTheme = colorTheme === 'dark'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        // เพิ่ม limit เมื่อต้องการกรองสินค้าลดราคา
        const fetchLimit = showOnlyOnSale ? Math.max((limit || 8) * 3, 50) : limit || 8

        const params = new URLSearchParams({
          limit: fetchLimit.toString(),
          depth: '1',
          'where[status][equals]': 'active',
        })

        console.log('ProductsBlock: Fetching products...', { showOnlyOnSale, limit: fetchLimit })
        const response = await fetch(`/api/products?${params.toString()}`, {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY || 'jmc-api-2024-secure-key-xdata24b',
          },
        })

        if (!response.ok) {
          console.error('ProductsBlock API failed:', response.status, response.statusText)
          setProducts([])
          setError(null)
          return
        }

        const data = await response.json()
        console.log('ProductsBlock: Received', data.totalDocs, 'products')

        let filteredProducts = data.docs || []

        // กรองเฉพาะสินค้าที่ active
        filteredProducts = filteredProducts.filter(
          (product: ProductCardData) => product && product.status === 'active',
        )

        // ถ้า showOnlyOnSale เป็น true ให้กรองเฉพาะสินค้าลดราคา
        if (showOnlyOnSale) {
          filteredProducts = filteredProducts.filter((product: ProductCardData) => {
            if (!product || product.status !== 'active') return false

            // เช็คสินค้าหลักว่ามีราคาลดหรือไม่
            const basePrice = product.price ? Number(product.price) : 0
            const baseSalePrice = product.salePrice ? Number(product.salePrice) : 0
            const hasBaseSale = baseSalePrice > 0 && baseSalePrice < basePrice

            return hasBaseSale
          })
        }

        const finalProducts = filteredProducts.slice(0, limit || 8)
        setProducts(finalProducts)
      } catch (err) {
        console.error('ProductsBlock error:', err)
        setProducts([])
        setError(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [limit, showOnlyOnSale, categories])

  const getBgClasses = () => {
    switch (colorTheme) {
      case 'dark':
        return 'bg-gray-900 text-white'
      case 'lightBlue':
        return 'bg-blue-50 text-gray-900'
      case 'gradient':
        return 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'
      case 'light':
      default:
        return 'bg-gray-50 text-gray-900'
    }
  }

  if (loading) {
    return (
      <div className={`py-8 lg:py-12 ${getBgClasses()}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">กำลังโหลดสินค้า...</p>
          </div>
        </div>
      </div>
    )
  }

  // ถ้าไม่มีสินค้า ให้แสดง message ที่เหมาะสม
  if (products.length === 0) {
    return (
      <div className={`py-8 lg:py-12 ${getBgClasses()}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}
            >
              {title}
            </h2>
            {showOnlyOnSale ? (
              <>
                <p className={`text-lg ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                  ขณะนี้ยังไม่มีสินค้าลดราขา กรุณาติดตามใหม่อีกครั้ง
                </p>
              </>
            ) : (
              <p className={`text-lg ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                กำลังเตรียมสินค้าสำหรับคุณ...
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`py-8 lg:py-12 ${getBgClasses()}`}>
      <style dangerouslySetInnerHTML={{ __html: customPaginationStyles }} />
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className={`text-lg ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Products Display */}
        {layout === 'slider' ? (
          <div className="products-swiper">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                nextEl: '.products-swiper-button-next',
                prevEl: '.products-swiper-button-prev',
              }}
              pagination={{
                el: '.products-swiper-pagination',
                clickable: true,
                dynamicBullets: true,
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 4,
                },
              }}
              className="pb-12"
            >
              {products.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation */}
            <div className="flex justify-center items-center mt-6 space-x-4">
              <button className="products-swiper-button-prev w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
                ←
              </button>
              <div className="products-swiper-pagination swiper-pagination-custom"></div>
              <button className="products-swiper-button-next w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
                →
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* View All Button */}
        {showViewAllButton && products.length > 0 && (
          <div className="text-center mt-8 lg:mt-12">
            <a
              href={viewAllLink || '/products'}
              className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-300"
            >
              ดูสินค้าทั้งหมด
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
