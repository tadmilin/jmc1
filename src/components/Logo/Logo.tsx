'use client'

import React from 'react'
import Image from 'next/image'
import type { Header } from '@/payload-types'

// Add a type for the props that allows passing CSS classes and logo data
interface LogoProps {
  className?: string
  loading?: 'eager' | 'lazy'
  priority?: 'high' | 'low'
  logoData?: Header['logo']
}

export const Logo: React.FC<LogoProps> = ({
  className,
  loading = 'lazy',
  priority = 'low',
  logoData,
}) => {
  // ใช้ข้อมูลจาก logoData หรือค่าเริ่มต้น
  const companyName = logoData?.companyName || 'จงมีชัยค้าวัสดุ'
  const companySubtitle = logoData?.companySubtitle || 'ร้านวัสดุก่อสร้าง ตลิ่งชัน'
  const logoBackgroundColor = logoData?.logoBackgroundColor || '#1E40AF'
  const companyNameColor = logoData?.companyNameColor || '#1E40AF'
  const logoImage = logoData?.logoImage

  // ใช้ favicon.svg เป็น fallback image
  const fallbackLogoUrl = '/favicon.svg'

  return (
    <div className={`flex items-center ${className || ''}`}>
      {/* แสดงรูปโลโก้ที่อัปโหลด หรือใช้ favicon.svg */}
      <div className="relative w-10 h-10 md:w-12 md:h-12 mr-3">
        {logoImage && typeof logoImage === 'object' && logoImage.url ? (
          <Image
            src={logoImage.url}
            alt={logoImage.alt || companyName}
            fill
            className="object-contain"
            priority={priority === 'high'}
            loading={loading}
          />
        ) : (
          <Image
            src={fallbackLogoUrl}
            alt={companyName}
            width={48}
            height={48}
            className="w-full h-full object-contain"
            priority={priority === 'high'}
            loading={loading}
          />
        )}
      </div>

      <div className="flex flex-col">
        <span className="font-bold text-lg md:text-xl" style={{ color: companyNameColor }}>
          {companyName}
        </span>
        <span className="text-xs md:text-sm text-gray-600">{companySubtitle}</span>
      </div>
    </div>
  )
}
