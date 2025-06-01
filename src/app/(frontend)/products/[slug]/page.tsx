import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { ProductCard, type ProductCardData } from '@/components/ProductCard'
import { ProductDetailWrapper } from '@/components/ProductDetailWrapper'
import { NavigationButtons, FooterButtons } from '@/components/ProductPageNavigation'
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

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationButtons productTitle={product.title} />

      {/* Product Details */}
      <div className="container mx-auto px-4 py-16">
        <ProductDetailWrapper product={product as any} />
      </div>

      {/* Product Specifications */}
      {product.specifications && product.specifications.length > 0 && (
        <div className="container mx-auto px-4 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
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
        </div>
      )}

      {/* Product Description */}
      {product.description && (
        <div className="container mx-auto px-4 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">รายละเอียดเพิ่มเติม</h2>
            <div className="prose prose-lg max-w-none">
              {/* Render rich text content here */}
              <div dangerouslySetInnerHTML={{ __html: JSON.stringify(product.description) }} />
            </div>
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 pb-16">
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
        </div>
      )}

      <FooterButtons />
    </div>
  )
}
