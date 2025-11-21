import React from 'react'
import NextImage from 'next/image'
import type { StaticImageData } from 'next/image'

import type { Media } from '@/payload-types'

interface Props {
  alt?: string
  className?: string
  fill?: boolean
  height?: number
  imgClassName?: string
  loading?: 'lazy' | 'eager'
  priority?: boolean
  resource?: Media | string | number | StaticImageData
  sizes?: string
  src?: StaticImageData | string
  width?: number
}

const isMedia = (resource: Props['resource']): resource is Media => {
  return resource !== null && typeof resource === 'object' && 'url' in resource
}

export const Image: React.FC<Props> = (props) => {
  const {
    alt: altFromProps,
    className,
    fill,
    height,
    imgClassName,
    loading = 'lazy',
    priority,
    resource,
    sizes,
    src: srcFromProps,
    width,
  } = props

  let width_final = width
  let height_final = height
  let alt = altFromProps
  let src: string = srcFromProps as string

  if (isMedia(resource)) {
    const {
      alt: altFromResource,
      filename,
      height: heightFromResource,
      url,
      width: widthFromResource,
    } = resource

    width_final = width_final || widthFromResource || 1200
    height_final = height_final || heightFromResource || 800
    alt = altFromProps || altFromResource || filename || 'รูปภาพ'

    // ตามเอกสาร PayloadCMS v3: media.url เป็น absolute URL จาก Blob Storage
    if (url) {
      if (url.startsWith('http')) {
        // Absolute URL จาก Vercel Blob Storage (ถูกต้องตามเอกสาร)
        src = url
      } else {
        // Fallback: ในกรณีที่ URL ไม่เป็น absolute (ไม่ควรเกิดขึ้น)
        console.warn('⚠️ PayloadCMS returned non-absolute URL:', url)
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        src = `${baseUrl}/api/media/file/${filename || 'unknown'}`
      }
    } else if (filename) {
      // Fallback: ถ้าไม่มี URL ใช้ API route
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
      src = `${baseUrl}/api/media/file/${filename}`
    } else {
      src = srcFromProps as string
    }
  }

  // ถ้าไม่มี src ใช้ placeholder
  if (!src || src === '') {
    src =
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlmYTZiNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuC4o+C4ueC4m+C4oOC4suC4nuC4quC4oeC4geC4qOC4tDwvdGV4dD4KICA8L3N2Zz4K'
    alt = 'ไม่มีรูปภาพ'
    width_final = width_final || 400
    height_final = height_final || 300
  }

  // จัดการ priority และ loading ให้ไม่ขัดแย้งกัน
  const imageProps: {
    alt: string
    className?: string
    fill?: boolean
    height?: number
    quality: number
    sizes?: string
    src: string
    width?: number
    priority?: boolean
    loading?: 'lazy' | 'eager'
  } = {
    alt: alt || '',
    className: imgClassName,
    fill,
    height: !fill ? height_final : undefined,
    quality: 80,
    sizes,
    src,
    width: !fill ? width_final : undefined,
  }

  // ถ้า priority = true จะไม่ใส่ loading (จะ default เป็น eager)
  if (priority) {
    imageProps.priority = true
  } else {
    imageProps.loading = loading
  }

  return (
    <div className={className}>
      <NextImage {...imageProps} />
    </div>
  )
}
