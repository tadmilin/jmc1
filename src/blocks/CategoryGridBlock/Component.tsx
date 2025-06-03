'use client'

import React, { useEffect, useState } from 'react'
import { Category } from '@/payload-types'
import { Media as MediaComponent } from '@/components/Media'
import RichText from '@/components/RichText'

interface CategoryGridBlockProps {
  title?: string
  description?: any
  categorySelection?: 'all' | 'select'
  categories?: (string | Category)[]
  limit?: number
  columns?: 'auto' | '2' | '3' | '4' | '6'
  showCategoryNames?: boolean
}

// สร้าง interface สำหรับ state ให้ชัดเจน
interface BlockConfigState {
  title: string
  description: any
  categorySelection: 'all' | 'select'
  categories: (string | Category)[]
  limit: number
  columns: 'auto' | '2' | '3' | '4' | '6'
  showCategoryNames: boolean
}

export const CategoryGridBlock: React.FC<{
  block?: CategoryGridBlockProps
}> = ({ block }) => {
  // State สำหรับเก็บข้อมูลหมวดหมู่
  const [categoryData, setCategoryData] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // เก็บค่าที่ใช้ใน component ไว้ใน state แทนการอ้างอิงโดยตรงจาก props
  const [blockConfig, setBlockConfig] = useState<BlockConfigState>({
    title: 'หมวดหมู่สินค้า',
    description: null,
    categorySelection: 'all',
    categories: [],
    limit: 12,
    columns: 'auto',
    showCategoryNames: true,
  })

  // ป้องกันกรณี block เป็น undefined
  useEffect(() => {
    if (block) {
      setBlockConfig({
        title: block.title || 'หมวดหมู่สินค้า',
        description: block.description || null,
        categorySelection: block.categorySelection || 'all',
        categories: block.categories || [],
        limit: block.limit || 12,
        columns: block.columns || 'auto',
        showCategoryNames: block.showCategoryNames !== undefined ? block.showCategoryNames : true,
      })
    }
  }, [block])

  // ดึงข้อมูลหมวดหมู่
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)

      try {
        // ดึงข้อมูลหมวดหมู่ตามเงื่อนไขที่กำหนด
        let url = '/api/categories?depth=1'

        // กรณีเลือกหมวดหมู่เอง
        if (
          blockConfig.categorySelection === 'select' &&
          Array.isArray(blockConfig.categories) &&
          blockConfig.categories.length > 0
        ) {
          // สร้าง query เพื่อดึงเฉพาะหมวดหมู่ที่เลือก
          const categoryIds = blockConfig.categories
            .map((cat) => (typeof cat === 'string' ? cat : cat?.id || ''))
            .filter(Boolean)
            .join(',')

          if (categoryIds) {
            url += `&where[id][in]=${categoryIds}`
          }
        }

        // เพิ่ม sort parameter เพื่อเรียงลำดับตามที่กำหนดใน dashboard
        url += '&sort=sortOrder'

        // เพิ่ม limit parameter
        url += `&limit=${blockConfig.limit}`

        const response = await fetch(url)
        if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลหมวดหมู่ได้')

        const data = await response.json()
        const fetchedCategories = data.docs || []

        setCategoryData(fetchedCategories)
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่:', error)
        setCategoryData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [blockConfig])

  // สร้าง CSS classes สำหรับกริด
  const getGridClasses = () => {
    switch (blockConfig.columns) {
      case '2':
        return 'grid-cols-2'
      case '3':
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
      case '4':
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      case '6':
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
      case 'auto':
      default:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
    }
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* หัวข้อและคำอธิบาย */}
        {blockConfig.title && (
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">{blockConfig.title}</h2>
            {blockConfig.description && (
              <div className="text-black max-w-2xl mx-auto">
                <RichText data={blockConfig.description} />
              </div>
            )}
          </div>
        )}

        {/* Grid หมวดหมู่ */}
        <div className={`grid ${getGridClasses()} gap-4 md:gap-6`}>
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-blue-600 bg-blue-50">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                กำลังโหลดข้อมูล...
              </div>
            </div>
          ) : categoryData && categoryData.length > 0 ? (
            categoryData.map((category) => {
              if (!category) return null

              const categoryUrl = `/categories/${category.slug}`

              return (
                <button
                  onClick={() => (window.location.href = categoryUrl)}
                  key={category.id}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 cursor-pointer w-full text-left"
                >
                  {/* รูปภาพ */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    {category.image ? (
                      <MediaComponent
                        resource={category.image}
                        fill
                        imgClassName="object-cover group-hover:scale-105 transition-transform duration-300"
                        size="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg
                          className="w-12 h-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                  </div>

                  {/* ชื่อหมวดหมู่ */}
                  {blockConfig.showCategoryNames && (
                    <div className="p-3">
                      <h3 className="text-sm md:text-base font-medium text-black text-center line-clamp-2">
                        {category.title || 'หมวดหมู่'}
                      </h3>
                    </div>
                  )}
                </button>
              )
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p className="text-lg font-medium">ไม่พบข้อมูลหมวดหมู่สินค้า</p>
                <p className="text-sm text-gray-400 mt-1">กรุณาเพิ่มหมวดหมู่สินค้าในระบบจัดการ</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CategoryGridBlock
