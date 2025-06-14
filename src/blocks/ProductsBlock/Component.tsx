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
        const fetchLimit = showOnlyOnSale ? Math.max((limit || 8) * 3, 50) : (limit || 8)

        const params = new URLSearchParams({
          limit: fetchLimit.toString(),
          depth: '1',
          'where[status][equals]': 'active',
        })

        console.log('ProductsBlock: Fetching products...', { showOnlyOnSale, limit: fetchLimit })
        const response = await fetch(`/api/products?${params.toString()}`)

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
        filteredProducts = filteredProducts.filter((product: ProductCardData) => 
          product && product.status === 'active'
        )

        // ถ้า showOnlyOnSale เป็น true ให้กรองเฉพาะสินค้าลดราคา (ใช้ logic เดียวกับ SaleProductsSlider)
        if (showOnlyOnSale) {
          filteredProducts = filteredProducts.filter((product: ProductCardData) => {
            if (!product || product.status !== 'active') return false
            
            // เช็คสินค้าหลักว่ามีราคาลดหรือไม่
            const basePrice = product.price ? Number(product.price) : 0
            const baseSalePrice = product.salePrice ? Number(product.salePrice) : 0
            const hasBaseSale = baseSalePrice > 0 && baseSalePrice < basePrice
            
            // เช็ค variants ว่ามีราคาลดหรือไม่
            const hasVariantSale = product.variants && 
                                  product.variants.length > 0 && 
                                  product.variants.some((variant) => {
                                    if (variant.variantStatus !== 'active') return false
                                    const variantPrice = variant.variantPrice ? Number(variant.variantPrice) : 0
                                    const variantSalePrice = variant.variantSalePrice ? Number(variant.variantSalePrice) : 0
                                    return variantSalePrice > 0 && variantSalePrice < variantPrice
                                  })
            
            const isSaleProduct = hasBaseSale || hasVariantSale
            
            if (isSaleProduct) {
              console.log('✅ ProductsBlock sale product:', product.title, {
                hasBaseSale,
                hasVariantSale,
                basePrice,
                baseSalePrice
              })
            }
            
            return isSaleProduct
          })
          
          console.log('🎯 ProductsBlock filtered sale products:', filteredProducts.length)
        }

        const finalProducts = filteredProducts.slice(0, limit || 8)
        setProducts(finalProducts)
        
        if (showOnlyOnSale && finalProducts.length === 0) {
          console.warn('⚠️ ProductsBlock: No sale products found!')
        }
        
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
      <div className={`py-6 lg:py-8 ${getBgClasses()}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-3 text-gray-600 text-base">กำลังโหลดสินค้า...</p>
          </div>
        </div>
      </div>
    )
  }

  // ถ้าไม่มีสินค้า ให้แสดง message ที่เหมาะสม
  if (products.length === 0) {
    return (
      <div className={`py-6 lg:py-8 ${getBgClasses()}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h2>
            {showOnlyOnSale ? (
              <>
                <p className={`text-base ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                  ขณะนี้ยังไม่มีสินค้าลดราคา กรุณาติดตามใหม่อีกครั้ง
                </p>
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg mb-4 max-w-md mx-auto">
                  <p className="text-sm">
                    💡 <strong>สำหรับ Admin:</strong> ตั้งค่า salePrice ในสินค้าหรือ variant เพื่อแสดงในส่วนนี้
                  </p>
                </div>
              </>
            ) : (
              <p className={`text-base ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                กำลังเตรียมสินค้าสำหรับคุณ...
              </p>
            )}
            <div className="mt-4">
              <a 
                href={showOnlyOnSale ? "/products" : "/admin"} 
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {showOnlyOnSale ? "ดูสินค้าทั้งหมด" : "เพิ่มสินค้าใน Admin Panel"}
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // คำนวณ slidesPerView และ loop condition สำหรับ Swiper
  const getMaxSlidesPerView = (breakpointSlides: number) => Math.min(breakpointSlides, products.length)
  const shouldEnableLoop = products.length >= 6 // ต้องมีอย่างน้อย 6 ชิ้นถึงจะ loop ได้

  return (
    <div className={`py-6 lg:py-8 ${getBgClasses()}`}>
      <style dangerouslySetInnerHTML={{ __html: customPaginationStyles }} />
      <div className="container mx-auto px-4">
        {/* Header Section - ลดขนาด */}
        <div className="text-center mb-6">
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${isDarkTheme ? 'text-red-400' : 'text-red-600'}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`text-sm lg:text-base max-w-2xl mx-auto ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
              {subtitle}
            </p>
          )}
          {showOnlyOnSale && (
            <div className="mt-3">
              <div className="bg-red-100 text-red-800 px-4 py-1 rounded-full text-xs font-semibold inline-block">
                🔥 สินค้าลดราคา {products.length} รายการ
              </div>
            </div>
          )}
        </div>

        {/* Products Section */}
        {layout === 'slider' ? (
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={12}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              pagination={{
                clickable: true,
                el: '.swiper-pagination-custom',
              }}
              autoplay={products.length > 1 ? {
                delay: 4000,
                disableOnInteraction: false,
              } : false}
              loop={shouldEnableLoop}
              loopAdditionalSlides={shouldEnableLoop ? 2 : 0}
              watchSlidesProgress={true}
              breakpoints={{
                640: {
                  slidesPerView: getMaxSlidesPerView(2),
                  spaceBetween: 16,
                },
                768: {
                  slidesPerView: getMaxSlidesPerView(3),
                  spaceBetween: 16,
                },
                1024: {
                  slidesPerView: getMaxSlidesPerView(4),
                  spaceBetween: 20,
                },
                1280: {
                  slidesPerView: getMaxSlidesPerView(5),
                  spaceBetween: 20,
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

            {/* Custom Navigation Buttons - ลดขนาด */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button className={`swiper-button-prev-custom w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isDarkTheme 
                  ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600' 
                  : 'bg-white text-gray-600 hover:text-blue-600 hover:bg-blue-50 shadow-lg border border-gray-200'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Custom Pagination */}
              <div className="swiper-pagination-custom flex gap-2"></div>

              <button className={`swiper-button-next-custom w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isDarkTheme 
                  ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600' 
                  : 'bg-white text-gray-600 hover:text-blue-600 hover:bg-blue-50 shadow-lg border border-gray-200'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          // Grid Layout - ลด gap
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <ProductCard key={product.id || index} product={product} colorTheme={colorTheme} />
            ))}
          </div>
        )}

        {/* View All Button - ลดขนาด */}
        {showViewAllButton && viewAllLink && (
          <div className="text-center mt-6">
            <a
              href={viewAllLink}
              className={`inline-flex items-center px-6 py-2 rounded-lg font-medium text-base transition-all duration-300 ${
                isDarkTheme
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg'
                  : 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 shadow-md hover:shadow-lg'
              }`}
            >
              ดูสินค้าทั้งหมด
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
