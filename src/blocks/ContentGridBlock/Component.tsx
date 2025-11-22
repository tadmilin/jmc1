'use client'

import React, { useEffect, useState } from 'react'
import { Media as MediaComponent } from '@/components/Media'
import RichText from '@/components/RichText'
import Link from 'next/link'
import type { Post, Media } from '@/payload-types'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

interface ContentGridBlockProps {
  title?: string
  subtitle?: DefaultTypedEditorState
  limit?: number
  columns?: '2' | '3' | '4'
  showMoreButton?: boolean
  moreButtonText?: string
  moreButtonLink?: string
}

interface ContentItem {
  id: string
  title: string
  description?: string
  image?: Media
  url: string
}

export const ContentGridBlock: React.FC<{
  block?: ContentGridBlockProps
}> = ({ block }) => {
  const [contentData, setContentData] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const {
    title = 'บทความมีประโยชน์ของคนรักบ้าน',
    subtitle,
    limit = 6,
    columns = '3',
    showMoreButton = true,
    moreButtonText = 'ดูบทความทั้งหมด',
    moreButtonLink = '/posts',
  } = block || {}

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const url = `/api/posts?depth=1&limit=${limit}&sort=-createdAt`
        const response = await fetch(url, {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
          },
        })

        if (!response.ok) throw new Error('Failed to fetch posts')

        const data = await response.json()
        const posts = data.docs.map((post: Post) => ({
          id: post.id,
          title: post.title,
          description: post.excerpt || post.meta?.description || undefined,
          image: post.heroImage || post.meta?.image || undefined,
          url: `/posts/${post.slug}`,
        }))

        setContentData(posts)
      } catch (error) {
        console.error('Error fetching posts:', error)
        setContentData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [limit])

  // Grid CSS classes
  const getGridClasses = () => {
    switch (columns) {
      case '2':
        return 'grid-cols-1 md:grid-cols-2'
      case '3':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case '4':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  const gridClasses = getGridClasses()

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-blue-600 bg-blue-50">
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
              กำลังโหลด...
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Empty state
  if (!isLoading && contentData.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-lg font-medium text-gray-500">ยังไม่มีบทความ</p>
          </div>
        </div>
      </section>
    )
  }

  // Render main content
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
        <div className={`grid ${gridClasses} gap-6 lg:gap-8`}>
          {contentData.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>

        {/* More Button */}
        {showMoreButton && moreButtonLink && (
          <div className="text-center mt-12">
            <Link
              href={moreButtonLink}
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              {moreButtonText}
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            อ่านเพิ่มเติม
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
