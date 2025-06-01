'use client'

import React from 'react'
import type { Footer } from '@/payload-types'

interface FooterClientProps {
  footerData: Footer
}

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

export const FooterClient: React.FC<FooterClientProps> = ({ footerData }) => {
  const navItems = footerData?.navItems || []

  // Debug information
  if (process.env.NODE_ENV === 'development') {
    console.log('FooterClient Debug:', {
      footerData,
      navItems,
      navItemsLength: navItems?.length,
    })
  }

  return (
    <footer className="mt-auto bg-gray-900 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* เมนูลิงก์ */}
          {navItems.length > 0 ? (
            <nav className="flex flex-wrap gap-4 mb-4 md:mb-0">
              {navItems.map(({ link }, i) => (
                <button
                  key={i}
                  onClick={() => handleNavigation(link)}
                  className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer bg-transparent border-none p-0"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          ) : (
            process.env.NODE_ENV === 'development' && (
              <div className="text-red-400 text-sm mb-4 md:mb-0">[ไม่มี navItems ใน Footer]</div>
            )
          )}

          {/* ลิขสิทธิ์ */}
          <p className="text-gray-400 text-sm text-center md:text-right">
            &copy; {new Date().getFullYear()} สงวนลิขสิทธิ์
          </p>
        </div>
      </div>
    </footer>
  )
}
