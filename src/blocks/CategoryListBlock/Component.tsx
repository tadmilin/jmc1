'use client';

import React from 'react'
import type { Category } from '@/payload-types'
import Image from 'next/image'
import Link from 'next/link'
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
`;

// Update component to accept categories data as a prop
export const CategoryListBlock: React.FC<{
  block: any; // Use any for now since CategoryListBlockProps doesn't exist
  categories: Category[]; // Expect categories data as a prop
}> = (props) => {
  const { block, categories } = props; // Destructure block data and categories

  // No data fetching logic needed here anymore

  return (
    <div className="category-list-block">
       {/* Add style tag for the basic CSS */}
      <style dangerouslySetInnerHTML={{ __html: categoryListStyles }} />
      <h2>หมวดหมู่สินค้า</h2> {/* Add a title for the block */}
      {categories && categories.length > 0 ? (
        <div className="category-list">
          {categories.map((category) => {
            // Ensure category and image data exist and are populated
            if (typeof category === 'object' && category !== null && typeof category.image === 'object' && category.image !== null && 'url' in category.image && category.image.url && category.slug) {
              return (
                <Link href={`/categories/${category.slug}`} key={category.id} className="category-item">
                  <div className="category-image-container">
                    {/* @ts-ignore */}
                    <Image
                      src={category.image.url}
                      alt={category.title || 'Category Image'}
                      fill // Use fill to cover the container
                      className="category-image"
                    />
                  </div>
                  <p className="category-title">{category.title}</p>
                </Link>
              );
            } else {
              // Log if category or image data is invalid
              console.warn('Invalid category or image data:', category);
              return null;
            }
          })}
        </div>
      ) : (
        <p>No categories found.</p>
      )}
    </div>
  );
}; 