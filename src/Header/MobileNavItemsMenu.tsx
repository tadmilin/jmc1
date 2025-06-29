'use client'
import React from 'react'
import type { Header } from '@/payload-types'

interface MobileNavItemsMenuProps {
  navItems: Header['navItems']
  onClose: () => void
}

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6.225 4.811a.75.75 0 00-1.06 1.06L10.94 12l-5.775 6.129a.75.75 0 101.06 1.06L12 13.06l5.775 6.129a.75.75 0 101.06-1.06L13.06 12l5.775-6.129a.75.75 0 00-1.06-1.06L12 10.94 6.225 4.811z" />
  </svg>
)

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

export const MobileNavItemsMenu: React.FC<MobileNavItemsMenuProps> = ({ navItems, onClose }) => {
  const currentNavItems = navItems || []

  // Handle keyboard events
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const handleItemClick = (link: any) => {
    handleNavigation(link)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-black bg-opacity-50 lg:hidden animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl p-6 transform transition-transform duration-300 ease-in-out animate-slideInRight"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">เมนู</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 -mr-1 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-label="Close menu"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <nav>
          <ul className="space-y-2">
            {currentNavItems.map(({ link }, i) => {
              return (
                <li key={i}>
                  <button
                    onClick={() => handleItemClick(link)}
                    className="flex items-center justify-between w-full p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 text-lg font-medium border border-transparent hover:border-blue-200 bg-transparent cursor-pointer text-left"
                  >
                    {link.label}
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </li>
              )
            })}

            {/* เพิ่มลิงก์เกี่ยวกับเรา - ชี้ไป CMS page */}
            <li>
              <button
                onClick={() =>
                  handleItemClick({ type: 'reference', url: '/aboutus', label: 'เกี่ยวกับเรา' })
                }
                className="flex items-center justify-between w-full p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 text-lg font-medium border border-transparent hover:border-blue-200 bg-transparent cursor-pointer text-left"
              >
                เกี่ยวกับเรา
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </li>

            {/* เพิ่มลิงก์ติดต่อ - ชี้ไป CMS page */}
            <li>
              <button
                onClick={() =>
                  handleItemClick({ type: 'reference', url: '/contactus-', label: 'ติดต่อเรา' })
                }
                className="flex items-center justify-between w-full p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 text-lg font-medium border border-transparent hover:border-blue-200 bg-transparent cursor-pointer text-left"
              >
                ติดต่อเรา
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
