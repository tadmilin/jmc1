'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title' | 'excerpt'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
  colorTheme?: string
}> = (props) => {
  const { card } = useClickableCard({})
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const {
    className,
    doc,
    relationTo,
    showCategories,
    title: titleFromProps,
    colorTheme = 'light',
  } = props

  useEffect(() => {
    setIsClient(true)
  }, [])

  const { slug, categories, meta, title, excerpt } = doc || {}
  const { image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const descriptionToShow = excerpt || meta?.description
  const sanitizedDescription = descriptionToShow?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  const isDarkTheme = colorTheme === 'dark'

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isClient && href) {
      router.push(href)
    }
  }

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isClient && href) {
      router.push(href)
    }
  }

  return (
    <article
      className={cn(
        `group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
          isDarkTheme
            ? 'bg-gray-800 border border-gray-700 hover:border-gray-600'
            : 'bg-white border border-gray-200 hover:border-blue-300'
        } hover:cursor-pointer`,
        className,
      )}
      ref={card.ref as React.LegacyRef<HTMLElement>}
      onClick={handleCardClick}
    >
      {/* Image Section - ปรับขนาดให้เล็กลง */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        {!metaImage && (
          <div
            className={`w-full h-full flex items-center justify-center ${
              isDarkTheme ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
            }`}
          >
            <div className="text-center">
              <svg
                className="w-12 h-12 mx-auto mb-2 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs">ไม่มีรูปภาพ</p>
            </div>
          </div>
        )}
        {metaImage && typeof metaImage !== 'string' && (
          <div className="relative w-full h-full">
            <Media
              resource={metaImage}
              size="25vw"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        {/* Category Badge */}
        {showCategories && hasCategories && (
          <div className="absolute top-3 left-3">
            <div className="flex flex-wrap gap-1">
              {categories?.slice(0, 2).map((category, index) => {
                if (typeof category === 'object') {
                  const { title: titleFromCategory } = category
                  const categoryTitle = titleFromCategory || 'Untitled category'

                  return (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                        isDarkTheme ? 'bg-blue-600/80 text-white' : 'bg-blue-600/90 text-white'
                      } shadow-lg`}
                    >
                      {categoryTitle}
                    </span>
                  )
                }
                return null
              })}
              {categories && categories.length > 2 && (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                    isDarkTheme ? 'bg-gray-600/80 text-white' : 'bg-gray-600/90 text-white'
                  } shadow-lg`}
                >
                  +{categories.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {titleToUse && (
          <div className="mb-3">
            <h3
              className={`text-lg font-bold leading-tight transition-colors duration-300 line-clamp-2 whitespace-pre-line ${
                isDarkTheme
                  ? 'text-gray-100 group-hover:text-blue-400'
                  : 'text-gray-800 group-hover:text-blue-600'
              }`}
            >
              <button onClick={handleLinkClick} className="hover:no-underline text-left w-full">
                {titleToUse}
              </button>
            </h3>
          </div>
        )}

        {sanitizedDescription && (
          <div className="mb-4">
            <p
              className={`text-sm leading-relaxed line-clamp-3 ${
                isDarkTheme ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {sanitizedDescription}
            </p>
          </div>
        )}

        {/* Read More Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleLinkClick}
            className={`inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 ${
              isDarkTheme
                ? 'text-blue-400 hover:text-blue-300'
                : 'text-blue-600 hover:text-blue-700'
            } group-hover:gap-3`}
          >
            อ่านเพิ่มเติม
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
          isDarkTheme ? 'ring-2 ring-blue-500/50' : 'ring-2 ring-blue-400/50'
        }`}
      />
    </article>
  )
}
