'use client'

import React from 'react'
import type { Footer } from '@/payload-types'
import { CMSLink } from '@/components/Link'

interface FooterClientProps {
  footerData: Footer
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
                <CMSLink
                  key={i}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                  {...link}
                />
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
