'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import type { Category } from '@/payload-types'

// Client component สำหรับ category cards
export const CategoryButton = ({
  category,
  children,
}: {
  category: Pick<Category, 'slug'>
  children: React.ReactNode
}) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/categories/${category.slug}`)
  }

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-all group cursor-pointer w-full text-left"
    >
      {children}
    </button>
  )
}
