'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Media } from '@/components/Media'
import { ProductCard, type ProductCardData } from '@/components/ProductCard'
import { ArrowLeft, Grid, List } from 'lucide-react'
import type { Category, Media as MediaType } from '@/payload-types'
import Link from 'next/link'

interface CategoryDetailClientProps {
  category: Category
}

export default function CategoryDetailClient({ category }: CategoryDetailClientProps) {
  const [products, setProducts] = useState<ProductCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalDocs, setTotalDocs] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const limit = 12

  const { title, description, image } = category
  const imageResource = image as MediaType | undefined

  // Fix hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch products in this category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        const params = new URLSearchParams({
          limit: limit.toString(),
          page: currentPage.toString(),
          depth: '1',
          'where[categories][in]': category.id,
          'where[status][equals]': 'active',
        })

        // Add search filter
        if (searchTerm.trim()) {
          params.append('where[title][contains]', searchTerm.trim())
        }

        // Add sorting
        switch (sortBy) {
          case 'newest':
            params.append('sort', '-createdAt')
            break
          case 'oldest':
            params.append('sort', 'createdAt')
            break
          case 'price-low':
            params.append('sort', 'price')
            break
          case 'price-high':
            params.append('sort', '-price')
            break
          case 'name-az':
            params.append('sort', 'title')
            break
          case 'name-za':
            params.append('sort', '-title')
            break
          default:
            params.append('sort', '-createdAt')
        }

        const response = await fetch(`/api/products?${params.toString()}`, {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY || 'jmc-api-2024-secure-key-xdata24b',
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
  }, [category.id, currentPage, searchTerm, sortBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setCurrentPage(1) // Reset to first page when sorting
  }

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600 font-medium">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/categories">
            <Button
              variant="outline"
              className="gap-2 bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 hover:text-blue-700 shadow-md hover:shadow-lg transition-all duration-200 font-medium px-4 py-2 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">กลับไปหน้าหมวดหมู่</span>
              <span className="sm:hidden">กลับ</span>
            </Button>
          </Link>
        </div>

        {/* Category Header */}
        <div className="mb-6 lg:mb-12">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            {imageResource ? (
              /* Mobile with Image */
              <div className="relative">
                <div className="w-full h-64 sm:h-72 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden rounded-2xl shadow-xl">
                  <Media
                    resource={imageResource}
                    size="800px"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Mobile Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="space-y-3">
                      <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight drop-shadow-lg">
                        {title}
                      </h1>
                      {description && (
                        <p className="text-white/90 text-sm sm:text-base leading-relaxed line-clamp-2 drop-shadow">
                          {description}
                        </p>
                      )}
                      <div className="flex items-center gap-3">
                        <Badge className="bg-white/95 text-gray-800 border-0 font-semibold px-3 py-1">
                          {totalDocs} สินค้า
                        </Badge>
                        <div className="text-white/80 text-sm">อัปเดตล่าสุด</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Mobile without Image */
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 text-white">
                <div className="space-y-4">
                  <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{title}</h1>
                  {description && (
                    <p className="text-blue-100 text-sm sm:text-base leading-relaxed line-clamp-3">
                      {description}
                    </p>
                  )}
                  <div className="flex items-center gap-3">
                    <Badge className="bg-white/20 text-white border-white/30 font-semibold px-3 py-1">
                      {totalDocs} สินค้า
                    </Badge>
                    <div className="text-blue-200 text-sm">อัปเดตล่าสุด</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="flex">
                {/* Desktop Image */}
                {imageResource && (
                  <div className="w-80 h-80 bg-gradient-to-br from-blue-50 to-indigo-100 flex-shrink-0 relative overflow-hidden">
                    <Media
                      resource={imageResource}
                      size="400px"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}

                {/* Desktop Content */}
                <div className="flex-1 p-8">
                  <div className="flex flex-col h-full justify-center">
                    <h1 className="text-4xl font-bold mb-6 text-gray-900 leading-tight">{title}</h1>
                    {description && (
                      <p className="text-gray-600 text-lg leading-relaxed mb-6 line-clamp-3">
                        {description}
                      </p>
                    )}
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="outline"
                        className="text-blue-600 border-blue-600 px-4 py-2 text-sm font-medium"
                      >
                        {totalDocs} สินค้า
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>อัปเดตล่าสุด: วันนี้</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="mb-6 lg:mb-8">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
              <div className="space-y-4">
                {/* Search */}
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="ค้นหาสินค้าในหมวดหมู่นี้..."
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

                {/* Sort and View Mode */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Select value={sortBy} onValueChange={handleSortChange}>
                      <SelectTrigger className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white text-gray-900">
                        <SelectValue placeholder="เรียงตาม" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">ใหม่ล่าสุด</SelectItem>
                        <SelectItem value="oldest">เก่าสุด</SelectItem>
                        <SelectItem value="price-low">ราคาต่ำ - สูง</SelectItem>
                        <SelectItem value="price-high">ราคาสูง - ต่ำ</SelectItem>
                        <SelectItem value="name-az">ชื่อ A-Z</SelectItem>
                        <SelectItem value="name-za">ชื่อ Z-A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Mobile View Toggle */}
                  <div className="flex bg-gray-100 rounded-xl p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-2 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-gray-200'}`}
                    >
                      <Grid className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-gray-200'}`}
                    >
                      <List className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex gap-4 items-center justify-between">
                {/* Search and Sort */}
                <div className="flex gap-4 flex-1">
                  {/* Search */}
                  <form onSubmit={handleSearch} className="flex-1 max-w-md">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="ค้นหาสินค้าในหมวดหมู่นี้..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 placeholder:text-gray-500"
                      />
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6">
                        ค้นหา
                      </Button>
                    </div>
                  </form>

                  {/* Sort */}
                  <div className="w-64">
                    <Select value={sortBy} onValueChange={handleSortChange}>
                      <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900">
                        <SelectValue placeholder="เรียงตาม" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">ใหม่ล่าสุด</SelectItem>
                        <SelectItem value="oldest">เก่าสุด</SelectItem>
                        <SelectItem value="price-low">ราคาต่ำ - สูง</SelectItem>
                        <SelectItem value="price-high">ราคาสูง - ต่ำ</SelectItem>
                        <SelectItem value="name-az">ชื่อ A-Z</SelectItem>
                        <SelectItem value="name-za">ชื่อ Z-A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Desktop View Mode Toggle */}
                <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  >
                    <Grid className="w-4 h-4" />
                    <span className="ml-2">ตาราง</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  >
                    <List className="w-4 h-4" />
                    <span className="ml-2">รายการ</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 font-medium">
              {loading
                ? 'กำลังโหลด...'
                : totalDocs > 0
                  ? `พบสินค้า ${totalDocs} รายการ`
                  : 'ไม่พบสินค้า'}
            </p>
            {!loading && totalPages > 1 && (
              <p className="text-sm text-gray-500">
                หน้า {currentPage} จาก {totalPages}
              </p>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600 font-medium">กำลังโหลดสินค้า...</p>
          </div>
        )}

        {/* Products Grid/List */}
        {!loading && products.length > 0 && (
          <div className="mb-8">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {products.map((product) => (
                  <div key={product.id} className="group">
                    <div className="transform group-hover:scale-105 transition-all duration-300 ease-out">
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <ProductCard product={product} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="group">
                    <div className="transform group-hover:scale-[1.02] transition-all duration-300 ease-out">
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <ProductCard product={product} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">ไม่พบสินค้า</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {searchTerm
                  ? `ไม่พบสินค้าที่ตรงกับ "${searchTerm}" ในหมวดหมู่นี้`
                  : 'ยังไม่มีสินค้าในหมวดหมู่นี้ในขณะนี้'}
              </p>
              {searchTerm && (
                <Button
                  onClick={() => {
                    setSearchTerm('')
                    setCurrentPage(1)
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  แสดงสินค้าทั้งหมดในหมวดหมู่
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
