'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

// Client component สำหรับปุ่ม breadcrumb
export const CategoryNavigation = ({ categoryTitle }: { categoryTitle: string }) => {
  const router = useRouter()

  const handleCategoriesClick = () => {
    router.push('/categories')
  }

  return (
    <div className="flex items-center mb-4">
      <button
        onClick={handleCategoriesClick}
        className="text-blue-500 hover:underline cursor-pointer"
      >
        หมวดหมู่ทั้งหมด
      </button>
      <span className="mx-2 text-gray-600">{'>'}</span>
      <span className="text-black font-medium">{categoryTitle}</span>
    </div>
  )
}

// Client component สำหรับ product cards
export const ProductButton = ({
  product,
  children,
}: {
  product: { slug: string }
  children: React.ReactNode
}) => {
  const router = useRouter()

  const handleProductClick = () => {
    router.push(`/products/${product.slug}`)
  }

  return (
    <button
      onClick={handleProductClick}
      className="group bg-white rounded-lg text-gray-900 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer w-full text-left"
    >
      {children}
    </button>
  )
}

// Client component สำหรับ back button
export const BackButton = () => {
  const router = useRouter()

  const handleBackClick = () => {
    router.push('/categories')
  }

  return (
    <p className="mt-2">
      <button
        onClick={handleBackClick}
        className="text-blue-500 hover:underline cursor-pointer"
      >
        กลับไปดูหมวดหมู่อื่น
      </button>
    </p>
  )
}
