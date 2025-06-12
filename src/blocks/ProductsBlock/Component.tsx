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
  const [error, setError] = useState<string | null>(null)

  const isDarkTheme = colorTheme === 'dark'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        // ใช้ query ง่ายๆ ที่สุด ไม่ใส่ where condition
        const params = new URLSearchParams({
          limit: (limit || 8).toString(),
          depth: '1',
        })

        console.log('ProductsBlock: Simple API call...')
        const response = await fetch(`/api/products?${params.toString()}`)

        if (!response.ok) {
          console.error('ProductsBlock API failed:', response.status, response.statusText)
          // ถ้า API ไม่ทำงาน ให้แสดง placeholder แทน
          setProducts([])
          setError(null) // ไม่แสดง error ให้ user เห็น
          return
        }

        const data = await response.json()
        console.log('ProductsBlock success:', data.totalDocs, 'products found')

        // กรองข้อมูลฝั่ง client แบบง่ายๆ
        let filteredProducts = data.docs || []
        
        // กรองเฉพาะสินค้าที่ active
        filteredProducts = filteredProducts.filter((product: any) => 
          product && product.status === 'active'
        )

        // ถ้า showOnlyOnSale เป็น true ให้กรองเฉพาะสินค้าลดราคา
        if (showOnlyOnSale) {
          filteredProducts = filteredProducts.filter((product: any) => 
            product.salePrice && product.price && product.salePrice < product.price
          )
        }

        setProducts(filteredProducts.slice(0, limit))
      } catch (err) {
        console.error('ProductsBlock error:', err)
        // ไม่แสดง error ให้ user เห็น แต่แสดง empty state แทน
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

  // ถ้าไม่มีสินค้า ให้แสดง message ธรรมดา
  if (products.length === 0) {
    return (
      <div className={`py-8 lg:py-12 ${getBgClasses()}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h2>
            <p className={`text-lg ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
              กำลังเตรียมสินค้าสำหรับคุณ...
            </p>
            <div className="mt-6">
              <a 
                href="/admin" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                เพิ่มสินค้าใน Admin Panel
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`py-8 lg:py-12 ${getBgClasses()}`}>
      <style dangerouslySetInnerHTML={{ __html: customPaginationStyles }} />
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkTheme ? 'text-red-400' : 'text-red-600'}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`text-lg max-w-2xl mx-auto ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Products Section */}
        {layout === 'slider' ? (
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              pagination={{
                clickable: true,
                el: '.swiper-pagination-custom',
              }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
                1280: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                },
              }}
              className="products-swiper"
            >
              {products.map((product, index) => (
                <SwiperSlide key={product.id || index}>
                  <ProductCard product={product} colorTheme={colorTheme} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button className={`swiper-button-prev-custom w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                isDarkTheme 
                  ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600' 
                  : 'bg-white text-gray-600 hover:text-blue-600 hover:bg-blue-50 shadow-lg border border-gray-200'
              }`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Custom Pagination */}
              <div className="swiper-pagination-custom flex gap-2"></div>

              <button className={`swiper-button-next-custom w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                isDarkTheme 
                  ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600' 
                  : 'bg-white text-gray-600 hover:text-blue-600 hover:bg-blue-50 shadow-lg border border-gray-200'
              }`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id || index} product={product} colorTheme={colorTheme} />
            ))}
          </div>
        )}

        {/* View All Button */}
        {showViewAllButton && viewAllLink && products.length > 0 && (
          <div className="text-center mt-12">
            <a
              href={viewAllLink}
              className="inline-flex items-center gap-2 px-8 py-3 text-lg font-semibold rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700"
            >
              ดูสินค้าทั้งหมด
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
