import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Page, Post } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props

  // Build href based on type
  let href = ''

  if (type === 'reference' && reference) {
    if (typeof reference.value === 'object' && reference.value && 'slug' in reference.value) {
      const slug = reference.value.slug
      if (slug) {
        href = reference.relationTo === 'pages' ? `/${slug}` : `/${reference.relationTo}/${slug}`
      }
    }
  } else if (type === 'custom' && url) {
    href = url
  }

  // Debug information (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('CMSLink Debug:', {
      type,
      reference,
      url,
      href,
      label,
      referenceValue: reference?.value,
    })
  }

  // If no href, try to fallback to a default URL or show debug info
  if (!href) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <span className={cn(className, 'text-red-500 cursor-not-allowed text-xs')}>
          [ลิงก์ไม่สมบูรณ์: {label || 'ไม่มี label'}]
        </span>
      )
    }
    // In production, just return null if no href
    return null
  }

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn(className)} href={href} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}
