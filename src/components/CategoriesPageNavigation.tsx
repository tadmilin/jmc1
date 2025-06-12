'use client'
import React from 'react'

// Client component สำหรับ category cards
export const CategoryButton = ({
  category,
  children,
}: {
  category: any
  children: React.ReactNode
}) => {
  return (
    <button
      onClick={() => (window.location.href = `/categories/${category.slug}`)}
      className="flex flex-col items-center p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-all group cursor-pointer w-full text-left"
    >
      {children}
    </button>
  )
}
