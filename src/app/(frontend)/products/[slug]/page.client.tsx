'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Media } from '@/components/Media'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Share2 } from 'lucide-react'
import type { Product, Media as MediaType } from '@/payload-types'
import Link from 'next/link'

// Type for product variant
type ProductVariant = {
  variantName: string
  variantPrice: number
  variantSalePrice?: number | null
  variantStock?: number | null
  variantSku?: string | null
  variantImages?: {
    image: string | MediaType
    alt?: string | null
    id?: string | null
  }[] | null
  variantStatus?: ('active' | 'inactive' | 'out_of_stock') | null
  isDefault?: boolean | null
  id?: string | null
}

// Type for product image
type ProductImage = {
  image: string | MediaType
  alt?: string | null
  id?: string | null
}

interface ProductDetailClientProps {
  product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  
  // Reset image index when variant changes
  useEffect(() => {
    setSelectedImageIndex(0)
  }, [selectedVariant])

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Set default variant if available
    if (product.variants && product.variants.length > 0) {
      // Smart default variant selection
      const activeVariants = product.variants.filter(v => v.variantStatus === 'active')
      const defaultVariant = activeVariants.find(v => v.isDefault) || 
                            activeVariants.sort((a, b) => (a.variantPrice || 0) - (b.variantPrice || 0))[0] ||
                            product.variants[0]
      if (defaultVariant) {
        setSelectedVariant(defaultVariant)
      }
    }
  }, [product])

  const {
    title,
    description,
    shortDescription,
    price,
    salePrice,
    images,
    categories,
    stock,
    status,
    variants,
    featured,
  } = product

  // Get current price based on selected variant or base price
  const currentPrice = selectedVariant?.variantPrice || price
  const currentSalePrice = selectedVariant?.variantSalePrice || salePrice
  const currentStock = selectedVariant?.variantStock || stock
  const isCurrentOnSale = currentSalePrice && currentSalePrice < currentPrice
  
  // Get current images (variant images or base images)
  const currentImages = selectedVariant?.variantImages && selectedVariant.variantImages.length > 0 
    ? selectedVariant.variantImages 
    : images


  const discountPercent = isCurrentOnSale ? Math.round(((currentPrice - currentSalePrice) / currentPrice) * 100) : 0
  const isOutOfStock = selectedVariant 
    ? (selectedVariant.variantStatus === 'out_of_stock' || selectedVariant.variantStock === 0)
    : (status === 'out_of_stock' || stock === 0)
  const isInactive = selectedVariant
    ? (selectedVariant.variantStatus === 'inactive')
    : (status === 'inactive' || status === 'discontinued')



  const handleShare = async () => {
    if (navigator.share) {
      try {
        const shareText = shortDescription || (typeof description === 'string' ? description : title)
        await navigator.share({
          title: title,
          text: shareText,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('คัดลอกลิงก์แล้ว!')
    }
  }

  if (!isClient) {
    return <div className="container mx-auto px-4 py-8">กำลังโหลด...</div>
  }

  return (
    <div className="min-h-screen bg-white">
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/products">
          <Button 
            variant="outline" 
            className="gap-2 bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 hover:text-blue-700 shadow-md hover:shadow-lg transition-all duration-200 font-medium px-4 py-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">กลับไปหน้าสินค้า</span>
            <span className="sm:hidden">กลับ</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
            {currentImages && currentImages.length > 0 ? (
              <Media
                resource={currentImages[selectedImageIndex]?.image as MediaType}
                size="600px"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 opacity-50">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <p>ไม่มีรูปภาพ</p>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {currentImages && currentImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {currentImages.map((imageItem: ProductImage, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index
                      ? 'border-blue-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Media
                    resource={imageItem.image as MediaType}
                    size="80px"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Categories */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => {
                if (typeof category === 'object') {
                  return (
                    <Badge key={index} variant="secondary">
                      {category.title}
                    </Badge>
                  )
                }
                return null
              })}
            </div>
          )}

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            {featured && (
              <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                สินค้าแนะนำ
              </Badge>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {isCurrentOnSale ? (
                <>
                  <span className="text-3xl font-bold text-red-600">
                    ฿{currentSalePrice?.toLocaleString()}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    ฿{currentPrice.toLocaleString()}
                  </span>
                  <Badge variant="destructive">-{discountPercent}%</Badge>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  ฿{currentPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Short Description */}
          {shortDescription && (
            <p className="text-lg text-gray-700 leading-relaxed">{shortDescription}</p>
          )}

          {/* Variants */}
          {variants && variants.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">ตัวเลือกสินค้า:</h3>
              <div className="grid grid-cols-2 gap-2">
                {variants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={variant.variantStatus !== 'active'}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      selectedVariant?.id === variant.id
                        ? 'border-blue-500 bg-blue-50'
                        : variant.variantStatus === 'active'
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{variant.variantName}</div>
                    <div className="text-sm">
                      {variant.variantSalePrice && variant.variantSalePrice < variant.variantPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-red-600 font-semibold">
                            ฿{variant.variantSalePrice.toLocaleString()}
                          </span>
                          <span className="text-gray-500 line-through text-xs">
                        ฿{variant.variantPrice.toLocaleString()}
                          </span>
                      </div>
                      ) : (
                        <span className="text-gray-700">
                          ฿{variant.variantPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="text-xs mt-1">
                      {variant.variantStatus === 'out_of_stock' ? (
                        <span className="text-red-500">สินค้าหมด</span>
                      ) : variant.variantStatus === 'inactive' ? (
                        <span className="text-gray-500">ไม่พร้อมขาย</span>
                      ) : variant.variantStock && variant.variantStock <= 5 ? (
                        <span className="text-orange-500">เหลือ {variant.variantStock}</span>
                      ) : (
                        <span className="text-green-600">พร้อมส่ง</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Info */}
          <div className="flex items-center gap-2 text-sm">
            {isOutOfStock ? (
              <Badge variant="destructive">สินค้าหมด</Badge>
            ) : isInactive ? (
              <Badge variant="secondary">ไม่พร้อมขาย</Badge>
            ) : (
              <Badge variant="outline" className="text-green-600 border-green-600">
                มีสินค้า {currentStock && currentStock > 0 ? `${currentStock} ชิ้น` : ''}
              </Badge>
            )}
          </div>

                    {/* Contact Buttons */}
          {!isOutOfStock && !isInactive && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Add LINE Button */}
                {product.addLineButton?.enabled && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 bg-green-50 border-green-500 text-green-700 hover:bg-green-100"
                    onClick={() => window.open(product.addLineButton?.lineUrl || 'https://line.me/R/ti/p/@jmc-company', '_blank')}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.629 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                    </svg>
                    {product.addLineButton?.label || 'Add LINE'}
                  </Button>
                )}
                
                {/* Call Button */}
                {product.callButton?.enabled && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-100"
                    onClick={() => window.open(`tel:${product.callButton?.phoneNumber || '02-123-4567'}`, '_self')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {product.callButton?.label || 'โทรหาเรา'}
                  </Button>
                )}
                
                {/* Quote Button */}
                {product.quoteButton?.enabled && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 bg-orange-50 border-orange-500 text-orange-700 hover:bg-orange-100"
                    onClick={() => {
                      const quoteUrl = product.quoteButton?.quoteUrl || '/quote-request'
                      const params = new URLSearchParams({
                        productId: product.id,
                        productName: product.title,
                        productPrice: (selectedVariant?.variantPrice || product.price).toString()
                      })
                      window.location.href = `${quoteUrl}?${params.toString()}`
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {product.quoteButton?.label || 'ขอเสนอราคา'}
                  </Button>
                )}
              </div>
              
              {/* Share Button */}
              <Button variant="outline" size="lg" onClick={handleShare} className="w-full gap-2">
                <Share2 className="w-5 h-5" />
                แชร์สินค้า
              </Button>
            </div>
          )}

          <Separator />

          {/* Full Description */}
          {description && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">รายละเอียดสินค้า</h3>
              <div 
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  )
} 