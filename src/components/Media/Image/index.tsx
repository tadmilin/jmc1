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
  if (resource === null || typeof resource !== 'object') return false
  const obj = resource as unknown as Record<string, unknown>
  return 'url' in obj || 'filename' in obj
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
      sizes,
      prefix,
    } = resource

    // พยายามคำนวณขนาดจากตัวไฟล์จริงก่อน ถ้าไม่มีค่อยไปดูจาก sizes
    let computedWidth = widthFromResource || undefined
    let computedHeight = heightFromResource || undefined
    let candidateURL: string | undefined = undefined

    // ลำดับความสำคัญในการเลือก URL:
    // 1) url หลักจาก Payload/Storage
    // 2) ขนาดย่อยที่มี (feature > card > thumbnail)
    // 3) prefix + filename (Vercel Blob / adapter อื่น)
    // 4) สุดท้าย fallback เป็น serverURL + collections path (กรณี local dev)

    if (url) {
      candidateURL = url
    } else if (sizes?.feature?.url) {
      candidateURL = sizes.feature.url
      computedWidth = computedWidth || sizes.feature.width || undefined
      computedHeight = computedHeight || sizes.feature.height || undefined
    } else if (sizes?.card?.url) {
      candidateURL = sizes.card.url
      computedWidth = computedWidth || sizes.card.width || undefined
      computedHeight = computedHeight || sizes.card.height || undefined
    } else if (sizes?.thumbnail?.url) {
      candidateURL = sizes.thumbnail.url
      computedWidth = computedWidth || sizes.thumbnail.width || undefined
      computedHeight = computedHeight || sizes.thumbnail.height || undefined
    } else if (prefix && filename) {
      candidateURL = `${prefix}/${filename}`
    } else if (filename) {
      const base = process.env.NEXT_PUBLIC_SERVER_URL || ''
      candidateURL = `${base}/api/collections/media/file/${filename}`
    }

    width_final = width_final || computedWidth || 1200
    height_final = height_final || computedHeight || 800
    alt = altFromProps || altFromResource || filename || 'รูปภาพ'

    if (candidateURL) {
      src = candidateURL
    } else {
      // ถ้าไม่มี URL ใดๆ เลย ให้ลองใช้ src จาก props และแจ้งเตือน
      console.warn('⚠️ Media object missing URL and sizes:', { filename, resource })
      src = (srcFromProps as string) || ''
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
