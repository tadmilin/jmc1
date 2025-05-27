'use client'

import React from 'react'
import { Media } from '@/components/Media'
import { ChevronRightIcon } from 'lucide-react'
import { CMSLink } from '@/components/Link'
import type { CategoryShowcase } from '@/payload-types'

interface CategoryShowcaseClientProps {
  showcaseData: CategoryShowcase
}

export const CategoryShowcaseClient: React.FC<CategoryShowcaseClientProps> = ({ showcaseData }) => {
  const categories = showcaseData?.categories || []

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* หัวข้อส่วน */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            หมวดหมู่สินค้า
          </h2>
          <p className="text-gray-600">
            เลือกดูสินค้าตามหมวดหมู่ที่คุณสนใจ
          </p>
        </div>

        {/* Grid หมวดหมู่ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
            >
              {/* รูปภาพ */}
              <div className="relative aspect-square overflow-hidden">
                {category.image && (
                  <Media
                    resource={category.image}
                    fill
                    imgClassName="object-cover group-hover:scale-105 transition-transform duration-300"
                    size="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
              </div>

              {/* เนื้อหา */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {category.title}
                </h3>
                {category.subtitle && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {category.subtitle}
                  </p>
                )}
                
                {/* ปุ่มดูเพิ่มเติม */}
                {category.link && (
                  <CMSLink
                    {...category.link}
                    className="inline-flex items-center text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors group/link"
                  >
                    <span>ดูสินค้า</span>
                    <ChevronRightIcon className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                  </CMSLink>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ปุ่มดูทั้งหมด */}
        <div className="text-center mt-8">
          <CMSLink
            type="custom"
            url="/categories"
            label="ดูหมวดหมู่ทั้งหมด"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            <span>ดูหมวดหมู่ทั้งหมด</span>
            <ChevronRightIcon className="w-5 h-5 ml-2" />
          </CMSLink>
        </div>
      </div>
    </section>
  )
} 