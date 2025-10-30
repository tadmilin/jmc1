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
        const response = await fetch(`/api/products?${params.toString()}`, {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
          },
        })

        if (!response.ok) {
          console.error('SaleProductsSlider API failed:', response.status, response.statusText)
          setProducts([])
          return
        }

        const data = await response.json()
        console.log(
          'SaleProductsSlider: Received',
          data.totalDocs,
          'products, filtering for sales...',
        )

        // กรองสินค้าลดราคาอย่างละเอียด
        const saleProducts = (data.docs || []).filter((product: ProductCardData) => {
          if (!product || product.status !== 'active') return false

          // เช็คสินค้าหลักว่ามีราคาลดหรือไม่
          const basePrice = product.price ? Number(product.price) : 0
          const baseSalePrice = product.salePrice ? Number(product.salePrice) : 0
          const hasBaseSale = baseSalePrice > 0 && baseSalePrice < basePrice

          // เช็ค variants ว่ามีราคาลดหรือไม่
          const hasVariantSale =
            product.variants &&
            product.variants.length > 0 &&
            product.variants.some((variant) => {
              if (variant.variantStatus !== 'active') return false
              const variantPrice = variant.variantPrice ? Number(variant.variantPrice) : 0
              const variantSalePrice = variant.variantSalePrice
                ? Number(variant.variantSalePrice)
                : 0
              return variantSalePrice > 0 && variantSalePrice < variantPrice
            })

          const isSaleProduct = hasBaseSale || hasVariantSale

          if (isSaleProduct) {
            console.log('✅ Sale product found:', product.title, {
              hasBaseSale,
              hasVariantSale,
              basePrice,
              baseSalePrice,
              variantsCount: product.variants?.length || 0,
            })
          }

          return isSaleProduct
        })

        console.log(
          '🎯 Final sale products:',
          saleProducts.length,
          'out of',
          data.docs?.length || 0,
        )

        // จำกัดจำนวนตาม limit ที่ต้องการ
        const finalProducts = saleProducts.slice(0, limit)
        setProducts(finalProducts)

        if (finalProducts.length === 0) {
          console.warn(
            '⚠️ No sale products found! Check if products have salePrice or variant salePrice set',
          )
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
      <div className={`py-12 lg:py-16 ${getBgClasses()}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">กำลังโหลดสินค้าลดราคา...</p>
          </div>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className={`py-12 lg:py-16 ${getBgClasses()}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-red-600">{title}</h2>
            <p className="text-lg text-gray-600 mb-8">
              ขณะนี้ยังไม่มีสินค้าลดราคา กรุณาติดตามใหม่อีกครั้ง
            </p>
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg mb-6 max-w-md mx-auto">
              <p className="text-sm">
                💡 <strong>สำหรับ Admin:</strong> ตั้งค่า salePrice ในสินค้าหรือ variant
                เพื่อแสดงในส่วนนี้
              </p>
            </div>
            <a
              href="/products"
              className="inline-block bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 transition-colors font-semibold"
            >
              ดูสินค้าทั้งหมด
            </a>
          </div>
        </div>
      </div>
    )
  }

  // คำนวณ slidesPerView สำหรับแต่ละ breakpoint
  const getMaxSlidesPerView = (breakpointSlides: number) =>
    Math.min(breakpointSlides, products.length)

  // เงื่อนไข loop ที่ปลอดภัย - ต้องมีสินค้าเพียงพอสำหรับ loop
  const shouldEnableLoop = products.length >= 6 // ต้องมีอย่างน้อย 6 ชิ้นถึงจะ loop ได้

  return (
    <div className={`py-12 lg:py-16 ${getBgClasses()}`}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .sale-products-swiper .swiper-pagination-bullet {
            width: 12px;
            height: 12px;
            background: #ef4444;
            opacity: 0.3;
            margin: 0 4px;
            border-radius: 50%;
            transition: all 0.3s ease;
          }
          .sale-products-swiper .swiper-pagination-bullet-active {
            opacity: 1;
            transform: scale(1.3);
            background: #dc2626;
          }
          .sale-products-swiper {
            padding-bottom: 50px;
          }
          .sale-products-swiper .swiper-slide {
            height: auto;
          }
        `,
        }}
      />

      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg lg:text-xl max-w-3xl mx-auto text-gray-700 leading-relaxed">
              {subtitle}
            </p>
          )}
          <div className="mt-6 flex justify-center">
            <div className="bg-red-100 text-red-800 px-6 py-2 rounded-full text-sm font-semibold">
              🎯 ลดราคาสูงสุด 50% เฉพาะวันนี้! ({products.length} รายการ)
            </div>
          </div>
        </div>

        {/* Products Slider */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            navigation={{
              nextEl: '.sale-swiper-button-next',
              prevEl: '.sale-swiper-button-prev',
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={
              products.length > 1
                ? {
                    delay: 3500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }
                : false
            }
            loop={shouldEnableLoop}
            loopAdditionalSlides={shouldEnableLoop ? 3 : 0}
            watchSlidesProgress={true}
            breakpoints={{
              640: {
                slidesPerView: getMaxSlidesPerView(2),
                spaceBetween: 20,
              },
              768: {
                slidesPerView: getMaxSlidesPerView(2),
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: getMaxSlidesPerView(3),
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: getMaxSlidesPerView(4),
                spaceBetween: 24,
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

          {/* Custom Navigation Buttons */}
          <button className="sale-swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white/90 backdrop-blur-sm text-red-600 rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 border-2 border-red-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button className="sale-swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white/90 backdrop-blur-sm text-red-600 rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 border-2 border-red-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* View All Button */}
        {showViewAllButton && viewAllLink && products.length > 0 && (
          <div className="text-center mt-12">
            <a
              href={viewAllLink}
              className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>ดูสินค้าลดราคาทั้งหมด</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
