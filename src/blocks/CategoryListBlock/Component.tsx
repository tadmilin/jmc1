'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import type { Category } from '@/payload-types'
import Image from 'next/image'
// Remove Payload imports as data fetching is moved
// import configPromise from '@payload-config'
// import { getPayload } from 'payload'

// Add some basic CSS for styling the category list
const categoryListStyles = `
  .category-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); /* Adjust column width as needed */
    gap: 20px;
    padding: 20px;
  }
  .category-item {
    text-align: center;
    text-decoration: none;
    color: inherit;
  }
  .category-image-container {
    width: 100%;
    height: 100px; /* Adjust height as needed */
    position: relative;
    margin-bottom: 10px;
  }
  .category-image {
    object-fit: cover;
    border-radius: 8px;
  }
  .category-title {
    font-size: 0.9em;
    font-weight: bold;
  }
`

// Define proper interface for block props
interface CategoryListBlockProps {
  title?: string
  subtitle?: string
}

// Update component to accept categories data as a prop
export const CategoryListBlock: React.FC<{
  block: CategoryListBlockProps
  categories: Category[] // Expect categories data as a prop
}> = (props) => {
  const { block: _block, categories } = props // Destructure block data and categories
  const router = useRouter()

  // No data fetching logic needed here anymore

  return (
    <div className="category-list-block">
      {/* Add style tag for the basic CSS */}
      <style dangerouslySetInnerHTML={{ __html: categoryListStyles }} />
      <h2>หมวดหมู่สินค้า</h2> {/* Add a title for the block */}
      {categories && categories.length > 0 ? (
        <div className="category-list">
          {categories.map((category) => {
            if (typeof category !== 'object' || category === null) return null

            const slug = category.slug || ''
            const handleCategoryClick = () => {
              if (slug) router.push(`/categories/${slug}`)
            }

            const hasImage =
              typeof category.image === 'object' &&
              category.image !== null &&
              'url' in category.image &&
              !!category.image.url

            return (
              <button
                onClick={handleCategoryClick}
                key={category.id}
                className="category-item cursor-pointer"
              >
                <div className="category-image-container">
                  {hasImage ? (
                    <Image
                      src={(category.image as { url: string }).url}
                      alt={category.title || 'Category Image'}
                      fill
                      className="category-image"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="category-title">{category.title}</p>
              </button>
            )
          })}
        </div>
      ) : (
        <p>No categories found.</p>
      )}
    </div>
  )
}
