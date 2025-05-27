'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { MenuIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []



  return (
    <nav className="flex items-center">
      <div className="flex items-center">
        {/* เมนูหลัก */}
        <ul className="hidden md:flex items-center space-x-6 mr-4">
          {navItems.map(({ link }, i) => {
            return (
              <li key={i} className="py-1">
                <CMSLink 
                  {...link} 
                  appearance="link" 
                  className="font-medium text-gray-700 hover:text-blue-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300"
                />
              </li>
            )
          })}
        </ul>
        
 
        
        {/* สำหรับมือถือ - Hamburger menu */}
        <button className="md:hidden ml-4 text-gray-700 p-2 hover:bg-gray-100 rounded-full" aria-label="เมนู">
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>
    </nav>
  )
}
