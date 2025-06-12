import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardPostData } from '@/components/Card'

export type Props = {
  posts: CardPostData[]
  colorTheme?: string
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts, colorTheme = 'light' } = props

  if (!posts || posts.length === 0) {
    const isDarkTheme = colorTheme === 'dark';
    
    return (
      <div className={cn('container mx-auto px-4')}>
        <div className={`text-center py-16 ${
          isDarkTheme 
            ? 'bg-gray-800 text-gray-300' 
            : 'bg-gray-50 text-gray-600'
        } rounded-2xl border ${
          isDarkTheme ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="max-w-md mx-auto">
            <svg className="w-20 h-20 mx-auto mb-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className={`text-2xl font-bold mb-4 ${
              isDarkTheme ? 'text-gray-100' : 'text-gray-800'
            }`}>
              ยังไม่มีบทความ
            </h3>
            <p className="text-lg">
              เรากำลังเตรียมเนื้อหาที่น่าสนใจสำหรับคุณ กรุณาติดตามอัปเดตใหม่ๆ
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('container mx-auto px-4')}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {posts.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return (
              <div key={index} className="w-full">
                <Card 
                  className="h-full" 
                  doc={result} 
                  relationTo="posts" 
                  showCategories 
                  colorTheme={colorTheme}
                />
              </div>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
