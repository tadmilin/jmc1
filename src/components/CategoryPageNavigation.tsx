'use client'
import React from 'react'

// Client component สำหรับปุ่ม breadcrumb
export const CategoryNavigation = ({ categoryTitle }: { categoryTitle: string }) => {
  return (
    <div className="flex items-center mb-4">
      <button
        onClick={() => (window.location.href = '/categories')}
        className="text-blue-500 hover:underline cursor-pointer"
      >
        หมวดหมู่ทั้งหมด
      </button>
      <span className="mx-2 text-black-600" >{'>'}</span>
      <span>{categoryTitle}</span>
    </div>
  )
}

// Client component สำหรับ product cards
export const ProductButton = ({
  product,
  children,
}: {
  product: any
  children: React.ReactNode
}) => {
  return (
    <button
      onClick={() => (window.location.href = `/products/${product.slug}`)}
      className="group bg-white rounded-lg text-black-900shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer w-full text-left"
    >
      {children}
    </button>
  )
}

// Client component สำหรับ back button
export const BackButton = () => {
  return (
    <p className="mt-2">
      <button
        onClick={() => (window.location.href = '/categories')}
        className="text-blue-500 hover:underline cursor-pointer"
      >
        กลับไปดูหมวดหมู่อื่น
      </button>
    </p>
  )
}
