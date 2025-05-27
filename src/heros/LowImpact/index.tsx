'use client'

import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
      links?: never
      colorTheme?: never
      showDecorations?: never
      backgroundImage?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
      links?: Page['hero']['links']
      colorTheme?: Page['hero']['colorTheme']
      showDecorations?: Page['hero']['showDecorations']
      backgroundImage?: Page['hero']['backgroundImage']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ 
  children, 
  richText, 
  links,
  colorTheme = 'light',
  showDecorations = true,
  backgroundImage
}) => {
  // สร้างคลาสสำหรับพื้นหลังตามธีมสี
  const getBgClasses = () => {
    switch (colorTheme) {
      case 'dark':
        return 'bg-gray-900 text-white';
      case 'lightBlue':
        return 'bg-blue-50 text-gray-900';
      case 'gradient':
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-900';
      case 'light':
      default:
        return 'bg-white text-gray-900';
    }
  }

  return null
}
