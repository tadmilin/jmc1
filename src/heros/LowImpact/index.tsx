'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

export const LowImpactHero: React.FC<Page['hero']> = ({ colorTheme = 'light' }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme(colorTheme === 'dark' ? 'dark' : 'light')
  }, [colorTheme, setHeaderTheme])

  // สร้างคลาสสำหรับพื้นหลังตามธีมสี
  const getBgClasses = () => {
    switch (colorTheme) {
      case 'dark':
        return 'bg-white text-gray-900' // เปลี่ยนเป็นสีขาว
      case 'lightBlue':
        return 'bg-white text-gray-900' // เปลี่ยนเป็นสีขาว
      case 'gradient':
        return 'bg-white text-gray-900' // เปลี่ยนเป็นสีขาว
      case 'light':
      default:
        return 'bg-white text-gray-900' // เปลี่ยนเป็นสีขาว
    }
  }

  return (
    <div className={`relative min-h-[40vh] flex flex-col justify-center ${getBgClasses()}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold">Low Impact Hero</h1>
          <p className="text-gray-600 mt-4">This is a simple hero section</p>
        </div>
      </div>
    </div>
  )
}
