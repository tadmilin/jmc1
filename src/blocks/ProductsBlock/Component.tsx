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

export const ProductsBlock: React.FC<ProductsBlockProps & { colorTheme?: string }> = (props) => {
  const {
    title = 'สินค้าลดราคาพิเศษ',
    subtitle,
    limit = 8,
    showOnlyOnSale = true,
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

        // Build query parameters - ใช้เฉพาะ status และ categories
        const whereCondition = {
          and: [
            {
              status: {
                equals: 'active',
              },
            },
            ...(categories && categories.length > 0
              ? [
                  {
                    categories: {
                      in: categories.map((cat) => (typeof cat === 'string' ? cat : cat.id)),
                    },
                  },
                ]
              : []),
          ],
        }

        console.log('ProductsBlock Query:', {
          showOnlyOnSale,
          whereCondition: JSON.stringify(whereCondition, null, 2),
        })

        const params = new URLSearchParams({
          limit: (limit || 12).toString(),
          depth: '2',
          where: JSON.stringify(whereCondition),
        })

        const response = await fetch(`/api/products?${params.toString()}`)

        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data = await response.json()
        console.log('ProductsBlock Response:', {
          totalDocs: data.totalDocs,
          docsLength: data.docs?.length,
          showOnlyOnSale,
          sampleProducts: data.docs?.slice(0, 2).map((p: any) => ({
            title: p.title,
            price: p.price,
            salePrice: p.salePrice,
            hasValidSale: p.salePrice && p.salePrice > 0 && p.salePrice < p.price,
          })),
        })

        // Client-side filtering as backup if server-side filtering doesn't work
        let filteredProducts = data.docs || []
        if (showOnlyOnSale) {
          filteredProducts = filteredProducts.filter(
            (product: any) =>
              product.salePrice && product.salePrice > 0 && product.salePrice < product.price,
          )
          console.log(
            'Client-side filtered products:',
            filteredProducts.length,
            'out of',
            data.docs?.length,
          )
        }

        setProducts(filteredProducts)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('ไม่สามารถโหลดข้อมูลสินค้าได้')
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

  const containerBg = isDarkTheme ? 'bg-gray-800' : 'bg-white'
  const borderColor = isDarkTheme ? 'border-gray-700' : 'border-gray-200'

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

  if (error) {
    return (
      <div className={`py-8 lg:py-12 ${getBgClasses()}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`py-8 lg:py-12 ${getBgClasses()}`}>
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-2">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDarkTheme ? 'text-red-400' : 'text-red-600'
            }`}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className={`text-lg max-w-2xl mx-auto ${
                isDarkTheme ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Products Section */}
        {products.length === 0 ? (
          <div className={`text-center py-16 ${containerBg} rounded-2xl border ${borderColor}`}>
            <div className="max-w-md mx-auto">
              <svg
                className="w-20 h-20 mx-auto mb-6 opacity-50"
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
              <h3
                className={`text-2xl font-bold mb-4 ${
                  isDarkTheme ? 'text-gray-100' : 'text-gray-800'
                }`}
              >
                ไม่มีสินค้าที่ตรงกับเงื่อนไข
              </h3>
              <p className={`text-lg ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                {showOnlyOnSale ? 'ขณะนี้ยังไม่มีสินค้าลดราคาพิเศษ' : 'ยังไม่มีสินค้าในหมวดหมู่นี้'}
              </p>
            </div>
          </div>
        ) : layout === 'slider' ? (
          // Slider Layout
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                nextEl: '.products-swiper-button-next',
                prevEl: '.products-swiper-button-prev',
              }}
              pagination={{
                clickable: true,
                el: '.products-swiper-pagination',
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
              className="products-swiper"
            >
              {products.map((product, index) => (
                <SwiperSlide key={product.id || index}>
                  <ProductCard product={product} colorTheme={colorTheme} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons */}
            <button
              className={`products-swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full shadow-lg transition-all duration-300 ${
                isDarkTheme
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-white text-gray-800 hover:bg-gray-50'
              }`}
            >
              <svg
                className="w-6 h-6 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              className={`products-swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full shadow-lg transition-all duration-300 ${
                isDarkTheme
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-white text-gray-800 hover:bg-gray-50'
              }`}
            >
              <svg
                className="w-6 h-6 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Pagination */}
            <div className="products-swiper-pagination mt-8 text-center"></div>
          </div>
        ) : (
          // Grid Layout
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id || index} product={product} colorTheme={colorTheme} />
            ))}
          </div>
        )}

        {/* View All Button */}
        {showViewAllButton && products.length > 0 && viewAllLink && (
          <div className="text-center mt-12">
            <button
              onClick={() => (window.location.href = viewAllLink)}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                isDarkTheme
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white'
              }`}
            >
              <span>ดูสินค้าทั้งหมด</span>
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .products-swiper .swiper-pagination-bullet {
          background: ${isDarkTheme ? '#60a5fa' : '#3b82f6'};
          opacity: 0.5;
        }
        .products-swiper .swiper-pagination-bullet-active {
          opacity: 1;
        }
      `}</style>
    </div>
  )
}
