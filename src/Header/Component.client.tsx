'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { MobileNavItemsMenu } from './MobileNavItemsMenu'
import { MobileCategoryMenu } from './MobileCategoryMenu'
// SearchIcon, ShoppingCartIcon, UserIcon are no longer needed here as they will be part of HeaderNav or a new right mobile menu

interface HeaderClientProps {
  data: Header
}

// Menu Icons
const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
)

const CategoryIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
)

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const [isLeftMobileMenuOpen, setIsLeftMobileMenuOpen] = useState(false) // Renamed for clarity
  const [isRightMobileMenuOpen, setIsRightMobileMenuOpen] = useState(false) // State for the new right hamburger menu

  // Debug information
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('HeaderClient Debug:', {
        data,
        navItems: data?.navItems,
        navItemsLength: data?.navItems?.length,
        dataKeys: Object.keys(data || {}),
      })
    }
  }, [data])

  // ปิดเมนูเมื่อเปลี่ยนหน้า
  useEffect(() => {
    setIsLeftMobileMenuOpen(false)
    setIsRightMobileMenuOpen(false)
  }, [pathname])

  // ป้องกันการ scroll เมื่อเมนูเปิด
  useEffect(() => {
    if (isLeftMobileMenuOpen || isRightMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup เมื่อ component unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isLeftMobileMenuOpen, isRightMobileMenuOpen])

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  // Contact info can be removed if the entire top bar is removed
  // const contactInfo = {
  //   phone: data?.contactInfo?.phone || '02-123-4567',
  //   email: data?.contactInfo?.email || 'contact@jmc.co.th',
  //   hours: data?.contactInfo?.hours || 'เปิดบริการทุกวัน 8:00 - 17:00 น.'
  // }

  return (
    <header
      className="sticky top-0 z-40 shadow-sm w-full bg-white"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      {/* THE TOP BLUE BAR HAS BEEN REMOVED
      <div className="bg-blue-800 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center">
              <PhoneIcon className="w-4 h-4 mr-1" />
              {contactInfo.phone}
            </span>
            <span className="hidden md:flex items-center">
              <MailIcon className="w-4 h-4 mr-1" />
              {contactInfo.email}
            </span>
          </div>
          <div className="text-sm flex items-center">
            <ClockIcon className="w-4 h-4 mr-1" />
            <span>{contactInfo.hours}</span>
          </div>
        </div>
      </div>
      */}

      {/* ส่วนล่างของ Header - สีพื้นหลังอ่อน พร้อมโลโก้และเมนู */}
      <div className="bg-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Left Section: Hamburger (for Categories) */}
            <div className="lg:hidden flex flex-col items-center justify-center w-14">
              <button
                onClick={() => setIsLeftMobileMenuOpen(!isLeftMobileMenuOpen)}
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 p-1.5 rounded-md transition-colors"
                aria-label="เปิดเมนูหมวดหมู่สินค้า"
                aria-expanded={isLeftMobileMenuOpen}
                title="หมวดหมู่สินค้า"
              >
                <CategoryIcon className="h-5 w-5" />
              </button>
              <span className="text-xs text-gray-500 mt-0.5 leading-tight">หมวดหมู่</span>
            </div>

            {/* Center Section: Logo */}
            <div className="flex-1 flex justify-center lg:justify-start lg:ml-0">
              <button onClick={() => (window.location.href = '/')} className="block">
                <Logo loading="eager" priority="high" logoData={data.logo} />
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-end flex-1">
              <HeaderNav data={data} />

              {/* Debug info in development */}
              {process.env.NODE_ENV === 'development' && (
                <div className="ml-4 text-xs text-red-500">Nav: {data?.navItems?.length || 0}</div>
              )}
            </div>

            {/* Right Section for Mobile: Hamburger (for NavItems) */}
            <div className="lg:hidden flex flex-col items-center justify-center w-14">
              <button
                onClick={() => setIsRightMobileMenuOpen(!isRightMobileMenuOpen)}
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 p-1.5 rounded-md transition-colors"
                aria-label="เปิดเมนูหลัก"
                aria-expanded={isRightMobileMenuOpen}
                title="เมนูหลัก"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
              <span className="text-xs text-gray-500 mt-0.5 leading-tight">เมนู</span>
            </div>
          </div>
        </div>
      </div>

      {/* Left Mobile Menu (Categories) */}
      {isLeftMobileMenuOpen && (
        <MobileCategoryMenu onClose={() => setIsLeftMobileMenuOpen(false)} />
      )}

      {/* Right Mobile Menu (NavItems) */}
      {isRightMobileMenuOpen && (
        <MobileNavItemsMenu
          navItems={data.navItems}
          onClose={() => setIsRightMobileMenuOpen(false)}
        />
      )}
    </header>
  )
}
