import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { CategoryNavigation, ProductButton, BackButton } from '@/components/CategoryPageNavigation'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  // ดึงข้อมูลหมวดหมู่จาก slug
  const categoryResponse = await payload.find({
    collection: 'categories',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 1,
  })

  // ถ้าไม่พบหมวดหมู่ให้แสดงหน้า 404
  if (!categoryResponse.docs || categoryResponse.docs.length === 0) {
    return notFound()
  }

  const category = categoryResponse.docs[0]

  // ดึงข้อมูลสินค้าในหมวดหมู่นี้
  const productsResponse = await payload.find({
    collection: 'products',
    where: {
      categories: {
        contains: category?.id,
      },
      status: {
        equals: 'active',
      },
    },
    depth: 2,
    limit: 20,
    sort: '-publishedAt',
  })

  const products = productsResponse.docs || []

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <CategoryNavigation categoryTitle={category?.title || 'หมวดหมู่'} />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 lg:col-span-3">
            <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100">
              {category?.image && typeof category.image === 'object' && category.image.url ? (
                <Media
                  resource={category.image}
                  fill
                  imgClassName="object-cover"
                  size="(max-width: 768px) 100vw, 350px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-8 lg:col-span-9">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
              {category?.title || 'หมวดหมู่'}
            </h1>
            {/* แสดงคำอธิบายของหมวดหมู่ ตามฟอร์แมตที่มี */}
            {category?.description && typeof category.description === 'object' && (
              <div className="prose dark:prose-invert mb-8">
                <RichText data={category.description} />
              </div>
            )}
            {category?.description && typeof category.description === 'string' && (
              <div className="prose dark:prose-invert mb-8">
                <p className="text-lg text-black mb-6">{category.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <h2 className="text-2xl font-bold mb-6 text-black">สินค้าในหมวดหมู่นี้</h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => {
              const mainImage = product.images?.[0]?.image
              const currentPrice = product.salePrice || product.price
              const hasDiscount = product.salePrice && product.salePrice < product.price

              return (
                <ProductButton key={product.id} product={product}>
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {mainImage && typeof mainImage === 'object' ? (
                      <Media
                        resource={mainImage}
                        fill
                        imgClassName="object-cover"
                        size="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        ไม่มีรูปภาพ
                      </div>
                    )}

                    {hasDiscount && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        ลดราคา
                      </div>
                    )}

                    {product.status === 'out_of_stock' && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-medium">สินค้าหมด</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.title}</h3>

                    {product.shortDescription && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.shortDescription}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-bold text-lg text-blue-600">
                          ฿{currentPrice?.toLocaleString()}
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-gray-500 line-through">
                            ฿{product.price?.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {product.stock !== undefined && (
                        <span className="text-xs text-gray-500">คงเหลือ {product.stock}</span>
                      )}
                    </div>
                  </div>
                </ProductButton>
              )
            })}
          </div>
        ) : (
          <div className="p-8 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-500">ยังไม่มีสินค้าในหมวดหมู่นี้</p>
            <BackButton />
          </div>
        )}
      </div>
    </div>
  )
}
