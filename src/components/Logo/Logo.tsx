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
  const companyName = logoData?.companyName || 'JMC'
  const companySubtitle = logoData?.companySubtitle || 'จงมั่นคงค้าวัสดุ'
  const logoBackgroundColor = logoData?.logoBackgroundColor || '#1E40AF'
  const companyNameColor = logoData?.companyNameColor || '#1E40AF'
  const logoImage = logoData?.logoImage

  return (
    <div className={className}>
      {/* แสดงรูปโลโก้ที่อัปโหลด หรือ SVG เริ่มต้น */}
      <div className="relative w-10 h-10 md:w-12 md:h-12 mr-2">
        {logoImage && typeof logoImage === 'object' ? (
          <Image
            src={logoImage.url || ''}
            alt={logoImage.alt || companyName}
            fill
            className="object-contain"
            priority={priority === 'high'}
            loading={loading}
          />
        ) : (
          <svg
            className="w-full h-full"
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="40" height="40" rx="8" fill={logoBackgroundColor} />
            <path
              d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M20 28H12V20"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
