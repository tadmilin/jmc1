'use client'

import React, { useEffect, useState } from 'react'
import { Media as MediaComponent } from '@/components/Media'
import RichText from '@/components/RichText'
import Link from 'next/link'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Media, Post, Product, Page } from '@/payload-types'

interface CustomItem {
  title: string
  description?: string
  image: string | Media
  linkType: 'internal' | 'external'
  internalLink?: {
    relationTo: 'pages' | 'posts'
    value: string | Page | Post
  }
  externalLink?: string
  buttonText?: string
}

interface ContentGridBlockProps {
  title?: string
  subtitle?: DefaultTypedEditorState
  contentType?: 'custom' | 'posts' | 'products'
  customItems?: CustomItem[]
  categories?: string[]
  limit?: number
  columns?: 'auto' | '2' | '3' | '4'
  showMoreButton?: boolean
  moreButtonText?: string
  moreButtonLink?: {
    relationTo: 'pages' | 'posts'
    value: string | Page | Post
  }
}

interface ContentItem {
  id: string
  title: string
  description?: string
  image?: string | Media
  url: string
  buttonText: string
}

export const ContentGridBlock: React.FC<{
  block?: ContentGridBlockProps
}> = ({ block }) => {
  const [contentData, setContentData] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Default values
  const {
    title = 'รวมเรื่องน่ารู้คู่คนรักบ้าน',
    subtitle,
    contentType = 'custom',
    customItems = [],
    categories = [],
    limit = 6,
    columns = 'auto',
    showMoreButton = false,
    moreButtonText = 'ดูทั้งหมด',
    moreButtonLink,
  } = block || {}

  // Helper function to get URL from internal link
  const getInternalUrl = (link: any): string => {
    if (!link) return '#'

    const relationTo = link.relationTo
    const value = typeof link.value === 'string' ? link.value : link.value?.slug

    if (relationTo === 'pages') {
      return value === 'home' ? '/' : `/${value}`
    } else if (relationTo === 'posts') {
      return `/posts/${value}`
    }

    return '#'
  }

  // Fetch content based on contentType
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true)

      try {
        let items: ContentItem[] = []

        if (contentType === 'custom') {
          // Use custom items
          items = customItems.map((item, index) => ({
            id: `custom-${index}`,
            title: item.title,
            description: item.description,
            image: item.image,
            url:
              item.linkType === 'internal'
                ? getInternalUrl(item.internalLink)
                : item.externalLink || '#',
            buttonText: item.buttonText || 'อ่านเพิ่มเติม',
          }))
        } else if (contentType === 'posts') {
          // Fetch from posts
          let url = `/api/posts?depth=1&limit=${limit}`

          if (categories.length > 0) {
            url += `&where[categories][in]=${categories.join(',')}`
          }

          const response = await fetch(url)
          if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลบทความได้')

          const data = await response.json()
          items = data.docs.map((post: Post) => ({
            id: post.id,
            title: post.title,
            description: post.meta?.description,
            image: post.meta?.image,
            url: `/posts/${post.slug}`,
            buttonText: 'อ่านบทความ',
          }))
        } else if (contentType === 'products') {
          // Fetch from products
          const response = await fetch(`/api/products?depth=1&limit=${limit}`)
          if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลผลิตภัณฑ์ได้')

          const data = await response.json()
          items = data.docs.map((product: Product) => ({
            id: product.id,
            title: product.title,
            description: product.meta?.description,
            image: product.meta?.image,
            url: `/products/${product.slug}`,
            buttonText: 'ดูผลิตภัณฑ์',
          }))
        }

        setContentData(items)
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error)
        setContentData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [contentType, customItems, categories, limit])

  // Get grid classes based on columns setting
  const getGridClasses = () => {
    switch (columns) {
      case '2':
        return 'grid-cols-1 sm:grid-cols-2'
      case '3':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      case '4':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      case 'auto':
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          {title && <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>}
          {subtitle && (
            <div className="text-gray-600 max-w-3xl mx-auto text-lg">
              <RichText data={subtitle} />
            </div>
          )}
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center px-6 py-3 font-semibold leading-6 text-sm shadow rounded-lg text-blue-600 bg-white">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              กำลังโหลดข้อมูล...
            </div>
          </div>
        ) : contentData && contentData.length > 0 ? (
          <>
            <div className={`grid ${getGridClasses()} gap-6 lg:gap-8`}>
              {contentData.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>

            {/* More Button */}
            {showMoreButton && moreButtonLink && (
              <div className="text-center mt-12">
                <Link
                  href={getInternalUrl(moreButtonLink)}
                  className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  {moreButtonText}
                  <svg
                    className="ml-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">ไม่มีเนื้อหาที่จะแสดง</p>
          </div>
        )}
      </div>
    </section>
  )
}

// Individual Content Card Component
const ContentCard: React.FC<{ item: ContentItem }> = ({ item }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {item.image ? (
          <MediaComponent
            resource={item.image}
            fill
            imgClassName="object-cover group-hover:scale-105 transition-transform duration-300"
            size="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {item.title}
        </h3>

        {item.description && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {item.description}
          </p>
        )}

        {/* Read More Button */}
        <Link
          href={item.url}
          className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors group-hover:translate-x-1 duration-200"
        >
          <span className="flex items-center">
            {item.buttonText}
            <svg
              className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  )
}

export default ContentGridBlock
