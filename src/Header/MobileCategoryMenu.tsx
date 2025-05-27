'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import type { Category } from '@/payload-types'

interface MobileCategoryMenuProps {
  onClose: () => void
}

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6.225 4.811a.75.75 0 00-1.06 1.06L10.94 12l-5.775 6.129a.75.75 0 101.06 1.06L12 13.06l5.775 6.129a.75.75 0 101.06-1.06L13.06 12l5.775-6.129a.75.75 0 00-1.06-1.06L12 10.94 6.225 4.811z" />
  </svg>
);

const CategoryIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

// Icons สำหรับแต่ละหมวดหมู่
const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case 'paint':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      )
    case 'plumbing':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    case 'electrical':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    case 'equipment':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    case 'mortar':
    case 'construction':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    case 'iron':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      )
    case 'garden':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    case 'chemical':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    default:
      return <CategoryIcon className="w-5 h-5" />
  }
}


 

export const MobileCategoryMenu: React.FC<MobileCategoryMenuProps> = ({ onClose }) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setError(null)
        const response = await fetch('/api/categories?depth=2&sort=sortOrder&limit=50')
        
        if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลหมวดหมู่ได้')
        
        const data = await response.json()
        
        // กรองเฉพาะ categories ที่มี title และ slug
        const validCategories = (data.docs || []).filter((cat: any) => {
          return cat && cat.title && cat.slug
        })
        
        setCategories(validCategories)
      } catch (error) {
        console.error('MobileCategoryMenu: เกิดข้อผิดพลาด:', error)
        setError('ไม่สามารถโหลดหมวดหมู่สินค้าได้')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // ฟังก์ชันตรวจสอบและแสดงรูปภาพ
  const renderCategoryImage = (category: Category) => {
    // ตรวจสอบว่า image เป็น object และมี url
    const hasValidImage = category.image && 
      typeof category.image === 'object' && 
      'url' in category.image &&
      category.image.url

    if (hasValidImage) {
      const imageUrl = typeof category.image === 'object' && category.image && 'url' in category.image ? (category.image.url || '') : ''
      return (
        <img
          src={imageUrl}
          alt={category.title}
          className="w-12 h-12 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
        />
      )
    } else {
      // แสดง icon แทนถ้าไม่มีรูปหรือรูปไม่ถูกต้อง
      return (
        <div className="w-12 h-12 flex items-center justify-center text-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg ring-1 ring-blue-200">
          {getCategoryIcon(category.slug || '')}
        </div>
      )
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black bg-opacity-50 lg:hidden animate-fadeIn" onClick={onClose}>
      <div 
        className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto animate-slideInLeft"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-5 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <CategoryIcon className="h-8 w-8 mr-3 text-blue-600" />
            หมวดหมู่สินค้า
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 p-2 -mr-1 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-label="Close category menu"
          >
            <XIcon className="h-7 w-7" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
              <span className="text-gray-600 text-sm">กำลังโหลดหมวดหมู่สินค้า...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">{error}</p>
              </div>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                ลองใหม่
              </button>
            </div>
          ) : categories.length > 0 ? (
            <nav>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link 
                      href={`/categories/${category.slug}`}
                      onClick={onClose}
                      className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 group border border-transparent hover:border-blue-200"
                    >
                      {/* รูปภาพหมวดหมู่ */}
                      <div className="flex-shrink-0 mr-3">
                        {renderCategoryImage(category)}
                      </div>
                      
                      {/* ชื่อหมวดหมู่ */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                          {category.title}
                        </h3>
                        {category.description && (
                          <p className="text-xs text-gray-500 line-clamp-1 mt-1 leading-relaxed">
                            {category.description}
                          </p>
                        )}
                      </div>
                      
                      {/* ลูกศรชี้ขวา */}
                      <div className="flex-shrink-0 ml-2">
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              
              {/* ลิงก์ดูทั้งหมด */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link 
                  href="/categories"
                  onClick={onClose}
                  className="flex items-center justify-center w-full p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  ดูหมวดหมู่ทั้งหมด
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </nav>
          ) : (
            <div className="text-center py-8">
              <CategoryIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-sm">ไม่พบหมวดหมู่สินค้า</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 