'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

export const LowImpactHero: React.FC<Page['hero']> = ({
  colorTheme = 'light',
  richText,
  links,
  media,
}) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme(colorTheme === 'dark' ? 'dark' : 'light')
  }, [colorTheme, setHeaderTheme])

  // ถ้าไม่มีเนื้อหาใดๆ ให้แสดงแค่ขนาดเล็กหรือไม่แสดงเลย
  const hasContent = richText || (links && links.length > 0) || media

  if (!hasContent) {
    // หากไม่มีเนื้อหา ให้แสดงเพียงแค่ส่วนเล็กๆ หรือไม่แสดงเลย
    return (
      <div className="relative h-4 bg-transparent">
        {/* Minimal space placeholder - แทบจะไม่เห็น */}
      </div>
    )
  }

  return (
    <div className="relative min-h-[20vh] flex flex-col justify-center bg-transparent">
      <div className="container mx-auto px-4 py-4">
        <div className="text-center">
          {richText && (
            <RichText
              className="text-lg md:text-xl text-gray-800"
              data={richText}
              enableGutter={false}
            />
          )}
          {links && links.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              {links.map(({ link }, i) => (
                <CMSLink key={i} {...link} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
