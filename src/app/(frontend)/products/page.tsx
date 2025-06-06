'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { ProductCard, type ProductCardData } from '@/components/ProductCard'
import type { Category } from '@/payload-types'

// Define filter types
interface ProductFilters {
  categories: string[]
  priceRange: {
    min: number
    max: number
  }
  onSaleOnly: boolean
  sortBy: 'newest' | 'price-low' | 'price-high' | 'name'
  searchQuery: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductCardData[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState<ProductFilters>({
    categories: [],
    priceRange: { min: 0, max: 100000 },
    onSaleOnly: false,
    sortBy: 'newest',
    searchQuery: '',
  })

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch products with status=active condition
        const productsResponse = await fetch(
          '/api/products?limit=100&depth=2&where=' +
            encodeURIComponent(
              JSON.stringify({
                status: {
                  equals: 'active',
                },
              }),
            ),
        )
        if (!productsResponse.ok) throw new Error('Failed to fetch products')
        const productsData = await productsResponse.json()

        // Fetch categories
        const categoriesResponse = await fetch('/api/categories?limit=50')
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories')
        const categoriesData = await categoriesResponse.json()

        setProducts(productsData.docs || [])
        setCategories(categoriesData.docs || [])

        // Set initial price range based on products
        if (productsData.docs && productsData.docs.length > 0) {
          const prices = productsData.docs.map((p: any) => p.price || 0)
          const minPrice = Math.min(...prices)
          const maxPrice = Math.max(...prices)
          setFilters((prev) => ({
            ...prev,
            priceRange: { min: minPrice, max: maxPrice },
          }))
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('ไม่สามารถโหลดข้อมูลสินค้าได้')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      // Category filter
      if (filters.categories.length > 0) {
        const productCategories = product.categories || []
        const hasMatchingCategory = productCategories.some((cat) => {
          const categoryId = typeof cat === 'string' ? cat : cat.id
          return filters.categories.includes(categoryId)
        })
        if (!hasMatchingCategory) return false
      }

      // Price filter
      const price = product.price || 0
      if (price < filters.priceRange.min || price > filters.priceRange.max) {
        return false
      }

      // Sale filter
      if (filters.onSaleOnly) {
        const hasValidSale =
          product.salePrice && product.salePrice > 0 && product.salePrice < product.price
        if (!hasValidSale) return false
      }

      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const title = (product.title || '').toLowerCase()
        const description = (product.shortDescription || '').toLowerCase()
        if (!title.includes(query) && !description.includes(query)) {
          return false
        }
      }

      return true
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0)
        case 'price-high':
          return (b.price || 0) - (a.price || 0)
        case 'name':
          return (a.title || '').localeCompare(b.title || '')
        case 'newest':
        default:
          // Use createdAt or updatedAt instead of publishedAt
          const aDate = new Date((a as any).createdAt || (a as any).updatedAt || 0).getTime()
          const bDate = new Date((b as any).createdAt || (b as any).updatedAt || 0).getTime()
          return bDate - aDate
      }
    })

    return filtered
  }, [products, filters])

  // Handle filter changes
  const handleCategoryChange = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }))
  }

  const handlePriceRangeChange = (min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: { min, max },
    }))
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: { min: 0, max: 100000 },
      onSaleOnly: false,
      sortBy: 'newest',
      searchQuery: '',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดสินค้า...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">สินค้าทั้งหมด</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              สินค้าคุณภาพดีจากเรา พร้อมบริการหลังการขายที่ดีเยี่ยม
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full flex items-center justify-between px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  <span>ตัวกรองสินค้า</span>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${showFilters ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ค้นหาสินค้า
                  </label>
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                    }
                    placeholder="ชื่อสินค้า..."
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    หมวดหมู่สินค้า
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category.id)}
                          onChange={() => handleCategoryChange(category.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
                        />
                        <span className="ml-2 text-sm text-gray-700">{category.title}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    ช่วงราคา (บาท)
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={filters.priceRange.min}
                        onChange={(e) =>
                          handlePriceRangeChange(Number(e.target.value), filters.priceRange.max)
                        }
                        placeholder="ต่ำสุด"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        value={filters.priceRange.max}
                        onChange={(e) =>
                          handlePriceRangeChange(filters.priceRange.min, Number(e.target.value))
                        }
                        placeholder="สูงสุด"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Sale Only */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.onSaleOnly}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, onSaleOnly: e.target.checked }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
                    />
                    <span className="ml-2 text-sm text-gray-700">เฉพาะสินค้าลดราคา</span>
                  </label>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ล้างตัวกรอง
                </button>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:w-3/4">
            {/* Sort and Results */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <p className="text-gray-600">
                  แสดงสินค้า {filteredProducts.length} รายการ
                  {filters.categories.length > 0 || filters.onSaleOnly || filters.searchQuery ? (
                    <span className="text-blue-600"> (กรองแล้ว)</span>
                  ) : (
                    <span> จากทั้งหมด {products.length} รายการ</span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">เรียงตาม:</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))
                  }
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">ใหม่ล่าสุด</option>
                  <option value="price-low">ราคาต่ำ-สูง</option>
                  <option value="price-high">ราคาสูง-ต่ำ</option>
                  <option value="name">ชื่อ A-Z</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <div className="max-w-md mx-auto">
                  <svg
                    className="w-20 h-20 mx-auto mb-6 opacity-50 text-gray-400"
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
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    ไม่พบสินค้าที่ตรงกับเงื่อนไข
                  </h3>
                  <p className="text-lg text-gray-600 mb-4">
                    ลองปรับเปลี่ยนตัวกรองหรือล้างตัวกรองทั้งหมด
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ล้างตัวกรอง
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id || index} product={product} colorTheme="light" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
