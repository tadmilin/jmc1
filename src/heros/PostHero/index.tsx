import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* แสดงรูปภาพแยกออกมา */}
        {heroImage && typeof heroImage !== 'string' && (
          <div className="mb-8 flex justify-center">
            <div className="max-w-4xl w-full">
              <Media
                resource={heroImage}
                className="rounded-lg shadow-lg overflow-hidden"
                imgClassName="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* เนื้อหา post */}
        <div className="max-w-4xl mx-auto">
          {/* Categories */}
          <div className="text-sm text-gray-600 mb-4">
            {categories?.map((category, index) => {
              if (typeof category === 'object' && category !== null) {
                const { title: categoryTitle } = category
                const titleToUse = categoryTitle || 'Untitled category'
                const isLast = index === categories.length - 1

                return (
                  <React.Fragment key={index}>
                    {titleToUse}
                    {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
                  </React.Fragment>
                )
              }
              return null
            })}
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {title}
            </h1>
          </div>

          {/* Author and Date */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-16 text-gray-700">
            {hasAuthors && (
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-gray-500">Author</p>
                <p className="text-base">{formatAuthors(populatedAuthors)}</p>
              </div>
            )}
            {publishedAt && (
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-gray-500">Date Published</p>
                <time dateTime={publishedAt} className="text-base">
                  {formatDateTime(publishedAt)}
                </time>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
