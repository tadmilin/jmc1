'use client'

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { Media as MediaComponent } from '@/components/Media'
import RichText from '@/components/RichText'
import Link from 'next/link'
import type { Post, Product, Category } from '@/payload-types'
import type { ContentGridBlockProps, ContentItem, ApiResponse, ContentCardProps } from './types'
import { DEFAULT_VALUES, API_CONFIG, ERROR_MESSAGES, EMPTY_STATE_MESSAGES } from './constants'
import {
  getInternalUrl as getUrl,
  getCategoryIds as getIds,
  getGridClasses as getGridCss,
  createCategoriesWhereClause,
} from './utils'

export const ContentGridBlock: React.FC<{
  block?: ContentGridBlockProps
}> = ({ block }) => {
  const [contentData, setContentData] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Default values
  const {
    title = DEFAULT_VALUES.TITLE,
    subtitle,
    contentType = DEFAULT_VALUES.CONTENT_TYPE,
    customItems = [],
    categories = [],
    limit = DEFAULT_VALUES.LIMIT,
    columns = DEFAULT_VALUES.COLUMNS,
    showMoreButton = DEFAULT_VALUES.SHOW_MORE_BUTTON,
    moreButtonText = DEFAULT_VALUES.MORE_BUTTON_TEXT,
    moreButtonLink,
  } = block || {}

  // Memoize processed custom items to prevent re-computation
  const processedCustomItems = useMemo((): ContentItem[] => {
    if (contentType !== 'custom') return []

    return customItems.map((item, index) => ({
      id: `custom-${index}`,
      title: item.title,
      description: item.description,
      image: item.image,
      url: item.linkType === 'internal' ? getUrl(item.internalLink) : item.externalLink || '#',
      buttonText: item.buttonText || DEFAULT_VALUES.BUTTON_TEXT.CUSTOM,
    }))
  }, [customItems, contentType])

  // Memoize category IDs to prevent re-computation
  const categoryIds = useMemo(() => getIds(categories), [categories])

  // Fetch posts from API
  const fetchPosts = useCallback(
    async (signal: AbortSignal): Promise<ContentItem[]> => {
      try {
        let url = `/api/posts?depth=${API_CONFIG.DEPTH}&limit=${limit}&sort=${API_CONFIG.SORT}`
        url += createCategoriesWhereClause(categoryIds)

        const response = await fetch(url, { signal })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data: ApiResponse<Post> = await response.json()

        return data.docs.map((post: Post) => ({
          id: post.id,
          title: post.title,
          description: post.meta?.description || post.excerpt,
          image: post.meta?.image || post.featuredImage,
          url: `/posts/${post.slug}`,
          buttonText: DEFAULT_VALUES.BUTTON_TEXT.POSTS,
        }))
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          throw err
        }
        console.error('Error fetching posts:', err)
        throw new Error(ERROR_MESSAGES.POSTS_FETCH_ERROR)
      }
    },
    [categoryIds, limit],
  )

  // Fetch products from API
  const fetchProducts = useCallback(
    async (signal: AbortSignal): Promise<ContentItem[]> => {
      try {
        const url = `/api/products?depth=${API_CONFIG.DEPTH}&limit=${limit}&sort=${API_CONFIG.SORT}`
        const response = await fetch(url, { signal })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data: ApiResponse<Product> = await response.json()

        return data.docs.map((product: Product) => ({
          id: product.id,
          title: product.title,
          description: product.meta?.description || product.summary,
          image: product.meta?.image || product.image,
          url: `/products/${product.slug}`,
          buttonText: DEFAULT_VALUES.BUTTON_TEXT.PRODUCTS,
        }))
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          throw err
        }
        console.error('Error fetching products:', err)
        throw new Error(ERROR_MESSAGES.PRODUCTS_FETCH_ERROR)
      }
    },
    [limit],
  )

  // Main fetch function with abort controller
  const fetchContent = useCallback(async () => {
    // Abort any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    setIsLoading(true)
    setError(null)

    try {
      let items: ContentItem[] = []

      switch (contentType) {
        case 'custom':
          items = processedCustomItems
          break
        case 'posts':
          items = await fetchPosts(signal)
          break
        case 'products':
          items = await fetchProducts(signal)
          break
        default:
          items = processedCustomItems
      }

      if (!signal.aborted) {
        setContentData(items)
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return // Request was aborted, don't set error
      }

      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.GENERAL_ERROR
      console.error('Content fetch error:', err)

      if (!signal.aborted) {
        setError(errorMessage)
        setContentData([])
      }
    } finally {
      if (!signal.aborted) {
        setIsLoading(false)
      }
    }
  }, [contentType, processedCustomItems, fetchPosts, fetchProducts])

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Fetch content when key dependencies change (NOT fetchContent itself)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchContent()
    }, 100) // Small debounce to prevent rapid calls

    return () => {
      clearTimeout(timeoutId)
    }
  }, [
    contentType,
    customItems.length,
    categories.length,
    limit,
    // For posts/products, only track relevant dependencies
    ...(contentType === 'posts' ? [categoryIds.join(',')] : []),
    // For custom content, track customItems more carefully
    ...(contentType === 'custom'
      ? [customItems.map((item) => `${item.title}-${item.linkType}`).join(',')]
      : []),
  ])

  // Get grid classes based on columns setting
  const gridClasses = getGridCss(columns)

  // Render loading state
  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
            )}
            {subtitle && (
              <div className="text-gray-600 max-w-3xl mx-auto text-lg">
                <RichText data={subtitle} />
              </div>
            )}
          </div>

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
        </div>
      </section>
    )
  }

  // Render error state
  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
            )}
            {subtitle && (
              <div className="text-gray-600 max-w-3xl mx-auto text-lg">
                <RichText data={subtitle} />
              </div>
            )}
          </div>

          <div className="text-center py-16">
            <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">เกิดข้อผิดพลาด</h3>
              <p className="text-red-700 text-sm mb-4">{error}</p>
              <button
                onClick={() => fetchContent()}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                ลองใหม่
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Render empty state
  if (!contentData || contentData.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
            )}
            {subtitle && (
              <div className="text-gray-600 max-w-3xl mx-auto text-lg">
                <RichText data={subtitle} />
              </div>
            )}
          </div>

          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ไม่มีเนื้อหาที่จะแสดง</h3>
              <p className="text-gray-500">{EMPTY_STATE_MESSAGES[contentType]}</p>
            </div>
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
              href={getUrl(moreButtonLink)}
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
const ContentCard: React.FC<ContentCardProps> = ({ item }) => {
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
