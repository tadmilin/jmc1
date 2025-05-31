import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { Media } from '@/components/Media'
import type { Metadata } from 'next'
import { ProductCard, type ProductCardData } from '@/components/ProductCard'
import { ProductDetailClient } from '@/components/ProductDetailClient'
import type { Product } from '@/payload-types'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getProduct(slug: string): Promise<Product | null> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 2,
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  return result.docs[0] || null
}

async function getRelatedProducts(
  productId: string,
  categories: any[],
): Promise<ProductCardData[]> {
  const payload = await getPayload({ config: configPromise })

  const categoryIds = categories.map((cat) => (typeof cat === 'string' ? cat : cat.id))

  const result = await payload.find({
    collection: 'products',
    depth: 2,
    where: {
      and: [
        {
          id: {
            not_equals: productId,
          },
        },
        {
          status: {
            equals: 'active',
          },
        },
        {
          categories: {
            in: categoryIds,
          },
        },
      ],
    },
    limit: 4,
    sort: '-publishedAt',
  })

  return result.docs as ProductCardData[]
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return {
      title: 'ไม่พบสินค้า',
    }
  }

  return {
    title: `${product.title} | JMC`,
    description: product.shortDescription || product.title,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.id, product.categories || [])

  // Keep minimal calculations for image badges only
  const isOnSale = product.salePrice && product.salePrice < product.price
  const discountPercent =
    isOnSale && product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0
  const isOutOfStock = product.status === 'out_of_stock' || product.stock === 0
  const isInactive = product.status === 'inactive' || product.status === 'discontinued'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              หน้าแรก
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-blue-600 hover:text-blue-800">
              สินค้าทั้งหมด
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              {product.images && product.images.length > 0 && product.images[0]?.image ? (
                <Media
                  resource={product.images[0].image}
                  className="w-full h-full object-cover"
                  size="600px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <svg
                      className="w-24 h-24 mx-auto mb-4 opacity-50"
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
                    <p className="text-lg">ไม่มีรูปภาพ</p>
                  </div>
                </div>
              )}

              {/* Badges */}
              {isOnSale && !isInactive && (
                <div className="absolute top-4 left-4">
                  <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    ลด {discountPercent}%
                  </div>
                </div>
              )}

              {isOutOfStock && (
                <div className="absolute top-4 right-4">
                  <div className="bg-gray-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                    สินค้าหมด
                  </div>
                </div>
              )}
            </div>

            {/* Additional Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((img, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-white rounded-lg overflow-hidden shadow"
                  >
                    {img?.image && (
                      <Media
                        resource={img.image}
                        className="w-full h-full object-cover"
                        size="150px"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <ProductDetailClient product={product as any} />
        </div>

        {/* Product Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">รายละเอียดสินค้า</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.specifications.map((spec, index) => (
                <div key={index} className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-600">{spec.label}</span>
                  <span className="text-gray-800">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Description */}
        {product.description && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">รายละเอียดเพิ่มเติม</h2>
            <div className="prose prose-lg max-w-none">
              {/* Render rich text content here */}
              <div dangerouslySetInnerHTML={{ __html: JSON.stringify(product.description) }} />
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">สินค้าที่เกี่ยวข้อง</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard
                  key={relatedProduct.id || index}
                  product={relatedProduct}
                  colorTheme="light"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
