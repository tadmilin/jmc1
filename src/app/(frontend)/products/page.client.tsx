'use client'
import React, { useEffect, useState } from 'react'
import { ProductCard, type ProductCardData } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Category {
  id: string
  title: string
  slug: string
}

export default function ProductsPageClient() {
  const [products, setProducts] = useState<ProductCardData[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalDocs, setTotalDocs] = useState(0)
  const limit = 12

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?limit=100&depth=0', {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
          },
        })
        if (response.ok) {
          const data = await response.json()
          setCategories(data.docs || [])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        const params = new URLSearchParams({
          limit: limit.toString(),
          page: currentPage.toString(),
          depth: '1',
        })

        // Add search filter
        if (searchTerm.trim()) {
          params.append('where[title][contains]', searchTerm.trim())
        }

        // Add category filter
        if (selectedCategory !== 'all') {
          params.append('where[categories][in]', selectedCategory)
        }

        // Only show active products
        params.append('where[status][equals]', 'active')

        const response = await fetch(`/api/products?${params.toString()}`, {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
          },
        })

        if (response.ok) {
          const data = await response.json()
          setProducts(data.docs || [])
          setTotalPages(data.totalPages || 1)
          setTotalDocs(data.totalDocs || 0)
        } else {
          console.error('Failed to fetch products:', response.status)
          setProducts([])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage, searchTerm, selectedCategory])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setCurrentPage(1) // Reset to first page when filtering
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 lg:mb-4 text-gray-900">
            ร้านวัสดุก่อสร้าง ตลิ่งชัน ปากซอยชักพระ6 ใกล้ฉัน | อิฐ หิน ปูน ทราย เหล็ก ท่อ PVC
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {totalDocs > 0 ? `พบสินค้า ${totalDocs} รายการ` : 'ไม่พบสินค้า'}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 lg:mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
            <div className="space-y-4">
              {/* Search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="ค้นหาสินค้า..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-20 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 bg-white text-gray-900 placeholder:text-gray-500"
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

              {/* Category Filter */}
              <div>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white text-gray-900">
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">หมวดหมู่ทั้งหมด</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">กำลังโหลดสินค้า...</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {products.map((product) => (
                <div key={product.id} className="group">
                  <div className="transform group-hover:scale-105 transition-all duration-300 ease-out">
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Products */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-lg p-12 max-w-lg mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg
                  className="w-12 h-12 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">ไม่พบสินค้า</h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {searchTerm || selectedCategory !== 'all'
                  ? 'ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา'
                  : 'ยังไม่มีสินค้าในระบบ'}
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <Button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                    setCurrentPage(1)
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  แสดงสินค้าทั้งหมด
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  variant="ghost"
                  size="sm"
                  className="hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2 rounded-xl"
                >
                  <span className="hidden sm:inline font-medium">ก่อนหน้า</span>
                  <span className="sm:hidden text-lg">‹</span>
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        variant={currentPage === pageNum ? 'default' : 'ghost'}
                        size="sm"
                        className={`min-w-[44px] h-11 rounded-xl font-semibold transition-all duration-200 ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg'
                            : 'hover:bg-blue-50 text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  variant="ghost"
                  size="sm"
                  className="hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2 rounded-xl"
                >
                  <span className="hidden sm:inline font-medium">ถัดไป</span>
                  <span className="sm:hidden text-lg">›</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
