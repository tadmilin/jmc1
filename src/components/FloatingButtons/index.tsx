'use client'

import React, { useEffect, useState } from 'react'
import { getServerSideURL } from '@/utilities/getURL'

// Site Settings Interface
interface SiteSettings {
  phone?: string
  line?: string
  facebook?: string
  companyName?: string
}

const FloatingButtons: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show buttons after component mounts (avoid hydration issues)
    setIsVisible(true)

    // Fetch site settings
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${getServerSideURL()}/api/globals/site-settings`, {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
          },
        })
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        }
      } catch (error) {
        console.error('Failed to fetch site settings:', error)
        // Fallback values
        setSettings({
          phone: '02-434-8319',
          line: '@308aoxno',
          facebook: 'https://www.facebook.com/jmc1990lekmor',
        })
      }
    }

    fetchSettings()
  }, [])

  if (!isVisible) return null

  const handlePhoneCall = () => {
    const phone = settings?.phone || '02-434-8319'
    window.location.href = `tel:${phone}`
  }

  const handleLineChat = () => {
    const lineId = settings?.line || '@308aoxno'
    // Clean LINE ID (remove @ if exists)
    const cleanLineId = lineId.startsWith('@') ? lineId.substring(1) : lineId
    window.open(`https://line.me/ti/p/@${cleanLineId}`, '_blank', 'noopener,noreferrer')
  }

  const handleFacebookPage = () => {
    const facebookUrl = settings?.facebook || 'https://www.facebook.com/jmc1990lekmor'
    window.open(facebookUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {/* Floating Buttons Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">
        {/* Phone Button */}
        <button
          onClick={handlePhoneCall}
          className="group relative flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label={`โทรหาเรา ${settings?.phone || '02-434-8319'}`}
          title={`โทรหาเรา ${settings?.phone || '02-434-8319'}`}
        >
          {/* Phone Icon */}
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>

          {/* Phone Number Tooltip */}
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            📞 {settings?.phone || '02-434-8319'}
            <div className="absolute top-1/2 left-full transform -translate-y-1/2 border-l-4 border-l-gray-900 border-y-4 border-y-transparent"></div>
          </div>
        </button>

        {/* LINE Button */}
        <button
          onClick={handleLineChat}
          className="group relative flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300"
          aria-label={`LINE Chat ${settings?.line || '@308aoxno'}`}
          title={`LINE Chat ${settings?.line || '@308aoxno'}`}
        >
          {/* LINE Icon - Official Logo */}
          <svg className="w-6 h-6" viewBox="0 0 195 195">
            <defs>
              <clipPath id="line-logo-clip">
                <path d="M0 0h195v195H0z" />
              </clipPath>
            </defs>
            <g clipPath="url(#line-logo-clip)">
              <path
                fill="#00B900"
                d="M97.5 0C43.65 0 0 43.65 0 97.5S43.65 195 97.5 195 195 151.35 195 97.5 151.35 0 97.5 0"
              />
              <g fill="#fff">
                <path d="M97.5 33.15c-35.6 0-64.35 23.4-64.35 52.35 0 26 20.8 48.45 49.4 51.9l19.5 12.35c1.95 1.3 4.55.65 5.2-1.3l3.9-15.6c35.1-5.85 61.35-31.85 61.35-47.35 0-28.95-28.75-52.35-64.35-52.35" />
                <path d="M129.87 102.53c1.11 0 2.01-.9 2.01-2.01V79.34c0-1.11-.9-2.01-2.01-2.01s-2.01.9-2.01 2.01v19.16l-14.22-20.24c-.44-.63-1.16-1.01-1.93-1.01-1.11 0-2.01.9-2.01 2.01v21.18c0 1.11.9 2.01 2.01 2.01s2.01-.9 2.01-2.01V81.28l14.27 20.29c.45.64 1.17 1.01 1.94 1.01" />
                <path d="M156.19 77.33c-1.11 0-2.01.9-2.01 2.01v17.18h-11.67c-1.11 0-2.01.9-2.01 2.01s.9 2.01 2.01 2.01h13.68c1.11 0 2.01-.9 2.01-2.01V79.34c0-1.11-.9-2.01-2.01-2.01" />
                <path d="M73.56 77.33c-1.11 0-2.01.9-2.01 2.01v17.18H59.88c-1.11 0-2.01.9-2.01 2.01s.9 2.01 2.01 2.01h13.68c1.11 0 2.01-.9 2.01-2.01V79.34c0-1.11-.9-2.01-2.01-2.01" />
                <path d="M97.5 77.33c-1.11 0-2.01.9-2.01 2.01v21.18c0 1.11.9 2.01 2.01 2.01s2.01-.9 2.01-2.01V79.34c0-1.11-.9-2.01-2.01-2.01" />
              </g>
            </g>
          </svg>

          {/* LINE ID Tooltip */}
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            💬 LINE: {settings?.line || '@308aoxno'}
            <div className="absolute top-1/2 left-full transform -translate-y-1/2 border-l-4 border-l-gray-900 border-y-4 border-y-transparent"></div>
          </div>
        </button>

        {/* Facebook Button */}
        <button
          onClick={handleFacebookPage}
          className="group relative flex items-center justify-center w-14 h-14 bg-blue-700 hover:bg-blue-800 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Facebook Page"
          title="Facebook Page"
        >
          {/* Facebook Icon */}
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>

          {/* Facebook Tooltip */}
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            📘 Facebook Page
            <div className="absolute top-1/2 left-full transform -translate-y-1/2 border-l-4 border-l-gray-900 border-y-4 border-y-transparent"></div>
          </div>
        </button>
      </div>

      {/* Mobile Optimization Styles */}
      <style jsx>{`
        @media (max-width: 640px) {
          .fixed.bottom-6.right-6 {
            bottom: 1rem;
            right: 1rem;
          }
          .w-14.h-14 {
            width: 3.5rem;
            height: 3.5rem;
          }
        }
      `}</style>
    </>
  )
}

export default FloatingButtons
