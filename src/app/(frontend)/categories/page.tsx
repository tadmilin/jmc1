'use client'
import React, { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Media } from '@/components/Media'
import Link from 'next/link'
import type { Category, Media as MediaType } from '@/payload-types'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/categories?limit=100&depth=1&sort=sortOrder')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.docs || [])
          setFilteredCategories(data.docs || [])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // Filter categories based on search
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = categories.filter(category =>
        category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredCategories(filtered)
    } else {
      setFilteredCategories(categories)
    }
  }, [searchTerm, categories])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 lg:mb-4">หมวดหมู่สินค้า</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          {filteredCategories.length > 0 
            ? `พบหมวดหมู่ ${filteredCategories.length} หมวดหมู่` 
            : 'ไม่พบหมวดหมู่'
          }
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 lg:mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input
                type="text"
                placeholder="ค้นหาหมวดหมู่..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-20 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12"
              />
              <Button 
                type="submit" 
                size="sm" 
                className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 px-4 rounded-lg"
              >
                ค้นหา
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">กำลังโหลดหมวดหมู่...</p>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      {!loading && filteredCategories.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {filteredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}

      {/* No Categories */}
      {!loading && filteredCategories.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-lg p-12 max-w-lg mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">ไม่พบหมวดหมู่</h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {searchTerm 
                ? `ไม่พบหมวดหมู่ที่ตรงกับ "${searchTerm}"`
                : 'ยังไม่มีหมวดหมู่ในระบบ'
              }
            </p>
            {searchTerm && (
              <Button
                onClick={() => setSearchTerm('')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                แสดงหมวดหมู่ทั้งหมด
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Category Card Component
function CategoryCard({ category }: { category: Category }) {
  const { title, description, image, slug } = category
  const imageResource = image as MediaType | undefined

  return (
    <Link href={`/categories/${slug}`}>
      <article className="group relative overflow-hidden rounded-xl lg:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer bg-white border border-gray-100 hover:border-blue-300">
        {/* Image Section */}
        <div className="relative w-full aspect-square overflow-hidden">
          {!imageResource && (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400">
              <div className="text-center">
                <svg
                  className="w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 mx-auto mb-1 sm:mb-2 opacity-50"
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
                <p className="text-xs sm:text-sm">ไม่มีรูปภาพ</p>
              </div>
            </div>
          )}
          {imageResource && (
            <div className="relative w-full h-full">
              <Media
                resource={imageResource}
                size="300px"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-3 sm:p-4 lg:p-6">
          {/* Title */}
          <h3 className="text-sm sm:text-base lg:text-lg font-bold leading-tight mb-1 sm:mb-2 transition-colors duration-300 text-gray-800 group-hover:text-blue-600 line-clamp-2">
            {title}
          </h3>

          {/* Description - Hide on mobile */}
          {description && (
            <p className="text-xs sm:text-sm leading-relaxed line-clamp-1 sm:line-clamp-2 mb-2 sm:mb-3 text-gray-600 hidden sm:block">
              {description}
            </p>
          )}

          {/* Action */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs sm:text-sm px-2 py-0.5 sm:px-3 sm:py-1">
              หมวดหมู่
            </Badge>
            <span className="text-xs sm:text-sm text-gray-500 group-hover:text-blue-600 transition-colors hidden sm:inline">
              ดูสินค้า →
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
} 