'use client'
import React, { useEffect, useState } from 'react'
import { Media } from '@/components/Media'
import type { Category } from '@/payload-types'

// คอมโพเนนต์สำหรับหน้าแสดงรายการหมวดหมู่ทั้งหมด
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/categories?depth=2&sort=title&limit=100')

        if (!response.ok) {
          throw new Error('ไม่สามารถดึงข้อมูลหมวดหมู่ได้')
        }

        const data = await response.json()
        setCategories(data.docs || [])
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูลหมวดหมู่')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // ฟังก์ชันตรวจสอบรูปภาพ
  const hasValidImage = (image: any) => {
    return image && typeof image === 'object' && image.url
  }

  if (loading) {
    return (
      <div className="pt-24 pb-24">
        <div className="container">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">กำลังโหลดหมวดหมู่สินค้า...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-24 pb-24">
        <div className="container">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ลองใหม่
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">หมวดหมู่สินค้า</h1>
          <p className="text-lg mb-8">เลือกดูสินค้าตามหมวดหมู่ที่ต้องการ</p>
        </div>
      </div>

      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {categories.map((category) => (
            <button
              onClick={() => (window.location.href = `/categories/${category.slug}`)}
              key={category.id}
              className="flex flex-col items-center p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-all group cursor-pointer w-full text-left"
            >
              <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100">
                {hasValidImage(category.image) ? (
                  <Media
                    resource={category.image}
                    fill
                    imgClassName="object-cover group-hover:scale-105 transition-transform duration-300"
                    size="(max-width: 768px) 100vw, 250px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400"
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
              <h2 className="text-center font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                {category.title}
              </h2>
              {category.description && (
                <p className="text-xs text-gray-500 text-center mt-1 line-clamp-2">
                  {category.description}
                </p>
              )}
            </button>
          ))}
        </div>

        {categories.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
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
            <p className="text-gray-500">ไม่พบหมวดหมู่สินค้า</p>
          </div>
        )}
      </div>
    </div>
  )
}
