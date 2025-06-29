'use client'

import React, { useEffect, useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { MenuIcon } from '@/components/ui/LucideIcons'

// Helper function สำหรับ navigation
const handleNavigation = (link: any) => {
  if (!link) return

  if (link.type === 'custom' && link.url) {
    if (link.newTab) {
      window.open(link.url, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = link.url
    }
  } else if (link.type === 'reference' && link.reference) {
    // Handle reference links
    const { relationTo, value } = link.reference
    let url = ''

    if (typeof value === 'string') {
      // If value is just an ID, construct URL
      url = `/${relationTo}/${value}`
    } else if (typeof value === 'object' && value.slug) {
      // If value is an object with slug
      url = relationTo === 'pages' ? `/${value.slug}` : `/${relationTo}/${value.slug}`
    }

    if (url) {
      if (link.newTab) {
        window.open(url, '_blank', 'noopener,noreferrer')
      } else {
        window.location.href = url
      }
    }
  }
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const [isClient, setIsClient] = useState(false)

  // Set client-side flag to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Debug information
  if (process.env.NODE_ENV === 'development') {
    console.log('HeaderNav Debug:', {
      data,
      navItems,
      navItemsLength: navItems?.length,
    })
  }

  return (
    <nav className="flex items-center">
      <div className="flex items-center">
        {/* เมนูหลัก */}
        <ul className="hidden md:flex items-center space-x-6 mr-4">
          {navItems.length === 0 && process.env.NODE_ENV === 'development' && (
            <li className="text-red-500 text-sm">[ไม่มี navItems ใน Header]</li>
          )}
          {navItems.map(({ link }, i) => {
            return (
              <li key={i} className="py-1">
                {isClient ? (
                  <button
                    onClick={() => handleNavigation(link)}
                    className="font-medium text-gray-700 hover:text-blue-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300 bg-transparent border-none cursor-pointer"
                  >
                    {link.label}
                  </button>
                ) : (
                  <span className="font-medium text-gray-700">{link.label}</span>
                )}
              </li>
            )
          })}

          {/* เพิ่มลิงก์เกี่ยวกับเรา - ชี้ไป CMS page */}
          <li className="py-1">
            {isClient ? (
              <button
                onClick={() =>
                  handleNavigation({ type: 'reference', url: '/aboutus', label: 'เกี่ยวกับเรา' })
                }
                className="font-medium text-gray-700 hover:text-blue-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300 bg-transparent border-none cursor-pointer"
              >
                เกี่ยวกับเรา
              </button>
            ) : (
              <span className="font-medium text-gray-700">เกี่ยวกับเรา</span>
            )}
          </li>

          {/* เพิ่มลิงก์ติดต่อ - ชี้ไป CMS page */}
          <li className="py-1">
            {isClient ? (
              <button
                onClick={() =>
                  handleNavigation({ type: 'reference', url: '/contactus-', label: 'ติดต่อเรา' })
                }
                className="font-medium text-gray-700 hover:text-blue-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300 bg-transparent border-none cursor-pointer"
              >
                ติดต่อเรา
              </button>
            ) : (
              <span className="font-medium text-gray-700">ติดต่อเรา</span>
            )}
          </li>
        </ul>

        {/* สำหรับมือถือ - Hamburger menu */}
        {isClient ? (
          <button
            className="md:hidden ml-4 text-gray-700 p-2 hover:bg-gray-100 rounded-full"
            aria-label="เมนู"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        ) : (
          <div className="md:hidden ml-4 text-gray-700 p-2">
            <MenuIcon className="w-6 h-6" />
          </div>
        )}
      </div>
    </nav>
  )
}
