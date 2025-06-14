'use client'
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { ProductCard, type ProductCardData } from '@/components/ProductCard'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface SaleProductsSliderProps {
  title?: string
  subtitle?: string
  limit?: number
  colorTheme?: string
  showViewAllButton?: boolean
  viewAllLink?: string
}

export const SaleProductsSlider: React.FC<SaleProductsSliderProps> = ({
  title = 'สินค้าลดราคาพิเศษ 🔥',
  subtitle = 'สินค้าคุณภาพดีราคาพิเศษ จำกัดเวลา อย่าพลาด!',
  limit = 12,
  colorTheme = 'light',
  showViewAllButton = true,
  viewAllLink = '/products?sale=true',
}) => {
  const [products, setProducts] = useState<ProductCardData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        setLoading(true)
        
        // เพิ่ม limit มากขึ้นเพื่อให้มีโอกาสหาสินค้าลดราคาได้มากขึ้น
        const fetchLimit = Math.max(limit * 3, 50) // ดึงมาก่อน แล้วกรองทีหลัง
        
        const params = new URLSearchParams({
          limit: fetchLimit.toString(),
          depth: '1',
          'where[status][equals]': 'active',
        })

        console.log('SaleProductsSlider: Fetching products for sale filtering...')
        const response = await fetch(`/api/products?${params.toString()}`)
        
        if (!response.ok) {
          console.error('SaleProductsSlider API failed:', response.status, response.statusText)
          setProducts([])
          return
        }

        const data = await response.json()
        console.log('SaleProductsSlider: Received', data.totalDocs, 'products, filtering for sales...')
        
        // กรองสินค้าลดราคาอย่างละเอียด
        const saleProducts = (data.docs || []).filter((product: ProductCardData) => {
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
            console.log('✅ Sale product found:', product.title, {
              hasBaseSale,
              hasVariantSale,
              basePrice,
              baseSalePrice,
              variantsCount: product.variants?.length || 0
            })
          }
          
          return isSaleProduct
        })

        console.log('🎯 Final sale products:', saleProducts.length, 'out of', data.docs?.length || 0)
        
        // จำกัดจำนวนตาม limit ที่ต้องการ
        const finalProducts = saleProducts.slice(0, limit)
        setProducts(finalProducts)
        
        if (finalProducts.length === 0) {
          console.warn('⚠️ No sale products found! Check if products have salePrice or variant salePrice set')
        }
        
      } catch (err) {
        console.error('Error fetching sale products:', err)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchSaleProducts()
  }, [limit])

  const getBgClasses = () => {
    switch (colorTheme) {
      case 'dark':
        return 'bg-gray-900 text-white'
      case 'lightBlue':
        return 'bg-blue-50 text-gray-900'
      case 'gradient':
        return 'bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 text-gray-900'
      case 'light':
      default:
        return 'bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 text-gray-900'
    }
  }

  if (loading) {
    return (
      <div className={`py-6 lg:py-8 ${getBgClasses()}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent mx-auto mb-3"></div>
            <p className="text-gray-600 text-base">กำลังโหลดสินค้าลดราคา...</p>
          </div>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className={`py-6 lg:py-8 ${getBgClasses()}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-red-600">
              {title}
            </h2>
            <p className="text-base text-gray-600 mb-6">
              ขณะนี้ยังไม่มีสินค้าลดราคา กรุณาติดตามใหม่อีกครั้ง
            </p>
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg mb-4 max-w-md mx-auto">
              <p className="text-sm">
                💡 <strong>สำหรับ Admin:</strong> ตั้งค่า salePrice ในสินค้าหรือ variant เพื่อแสดงในส่วนนี้
              </p>
            </div>
            <a 
              href="/products" 
              className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              ดูสินค้าทั้งหมด
            </a>
          </div>
        </div>
      </div>
    )
  }

  // คำนวณ slidesPerView สำหรับแต่ละ breakpoint
  const getMaxSlidesPerView = (breakpointSlides: number) => Math.min(breakpointSlides, products.length)
  
  // เงื่อนไข loop ที่ปลอดภัย - ต้องมีสินค้าเพียงพอสำหรับ loop
  const shouldEnableLoop = products.length >= 6 // ต้องมีอย่างน้อย 6 ชิ้นถึงจะ loop ได้

  return (
    <div className={`py-6 lg:py-8 ${getBgClasses()}`}>
      <style dangerouslySetInnerHTML={{ 
        __html: `
          .sale-products-swiper .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
            background: #ef4444;
            opacity: 0.3;
            margin: 0 3px;
            border-radius: 50%;
            transition: all 0.3s ease;
          }
          .sale-products-swiper .swiper-pagination-bullet-active {
            opacity: 1;
            transform: scale(1.2);
            background: #dc2626;
          }
          .sale-products-swiper {
            padding-bottom: 30px;
          }
          .sale-products-swiper .swiper-slide {
            height: auto;
          }
        ` 
      }} />
      
      <div className="container mx-auto px-4">
        {/* Header Section - ลดขนาด */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm lg:text-base max-w-2xl mx-auto text-gray-700 leading-relaxed">
              {subtitle}
            </p>
          )}
          <div className="mt-3 flex justify-center">
            <div className="bg-red-100 text-red-800 px-4 py-1 rounded-full text-xs font-semibold">
              🎯 ลดราคาสูงสุด 50% ({products.length} รายการ)
            </div>
          </div>
        </div>

        {/* Products Slider - ลด spacing */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={12}
            slidesPerView={1}
            navigation={{
              nextEl: '.sale-swiper-button-next',
              prevEl: '.sale-swiper-button-prev',
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={products.length > 1 ? {
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            } : false}
            loop={shouldEnableLoop}
            loopAdditionalSlides={shouldEnableLoop ? 3 : 0}
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
            className="sale-products-swiper"
          >
            {products.map((product, index) => (
              <SwiperSlide key={product.id || index}>
                <div className="h-full">
                  <ProductCard product={product} colorTheme={colorTheme} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons - ลดขนาด */}
          <button className="sale-swiper-button-prev absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm text-red-600 rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 border border-red-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button className="sale-swiper-button-next absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm text-red-600 rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 border border-red-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* View All Button - ลดขนาด */}
        {showViewAllButton && viewAllLink && products.length > 0 && (
          <div className="text-center mt-6">
            <a
              href={viewAllLink}
              className="inline-flex items-center gap-2 px-6 py-2 text-base font-medium rounded-lg transition-all duration-300 bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 shadow-md hover:shadow-lg"
            >
              <span>ดูสินค้าลดราคาทั้งหมด</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  )
} 