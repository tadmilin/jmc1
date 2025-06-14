'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Media } from '@/components/Media'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, ShoppingCart, Heart, Share2, Minus, Plus } from 'lucide-react'
import type { Product, Media as MediaType } from '@/payload-types'
import Link from 'next/link'

interface ProductDetailClientProps {
  product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  
  // Reset image index when variant changes
  useEffect(() => {
    setSelectedImageIndex(0)
  }, [selectedVariant])
  const [quantity, setQuantity] = useState(1)
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
      setSelectedVariant(defaultVariant)
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

  const isOnSale = salePrice && salePrice < price
  const discountPercent = isCurrentOnSale ? Math.round(((currentPrice - currentSalePrice) / currentPrice) * 100) : 0
  const isOutOfStock = selectedVariant 
    ? (selectedVariant.variantStatus === 'out_of_stock' || selectedVariant.variantStock === 0)
    : (status === 'out_of_stock' || stock === 0)
  const isInactive = selectedVariant
    ? (selectedVariant.variantStatus === 'inactive')
    : (status === 'inactive' || status === 'discontinued')

  // Get current price based on selected variant or base price
  const currentPrice = selectedVariant?.variantPrice || price
  const currentSalePrice = selectedVariant?.variantSalePrice || salePrice
  const currentStock = selectedVariant?.variantStock || stock
  const isCurrentOnSale = currentSalePrice && currentSalePrice < currentPrice
  
  // Get current images (variant images or base images)
  const currentImages = selectedVariant?.variantImages && selectedVariant.variantImages.length > 0 
    ? selectedVariant.variantImages 
    : images

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (currentStock || 999)) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', {
      product: product.id,
      variant: selectedVariant?.id,
      quantity,
    })
    alert('เพิ่มสินค้าลงตะกร้าแล้ว!')
  }

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
              {currentImages.map((imageItem, index) => (
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
                มีสินค้า {currentStock > 0 ? `${currentStock} ชิ้น` : ''}
              </Badge>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          {!isOutOfStock && !isInactive && (
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">จำนวน:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (currentStock || 999)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 gap-2"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  เพิ่มลงตะกร้า
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" onClick={handleShare}>
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
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