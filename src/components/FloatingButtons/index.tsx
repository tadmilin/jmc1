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
        const response = await fetch(`${getServerSideURL()}/api/globals/site-settings`)
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
          {/* LINE Icon */}
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.017 0C5.396 0 .029 4.285.029 9.567c0 4.715 4.153 8.677 9.583 9.459.4-.003.8-.085 1.188-.253.373-.161.724-.377 1.034-.645.028-.024.063-.051.063-.051s.029-.024.029-.024c1.667-1.495 2.662-3.649 2.662-6.036C14.588 4.285 18.639.001 12.017 0zm-4.659 6.892c.274 0 .496.222.496.496v3.299c0 .274-.222.497-.496.497s-.496-.223-.496-.497V7.388c0-.274.222-.496.496-.496zm1.184 0c.274 0 .496.222.496.496v3.299c0 .274-.222.497-.496.497s-.496-.223-.496-.497V7.388c0-.274.222-.496.496-.496zm1.482 0h1.482c.274 0 .496.222.496.496s-.222.496-.496.496H9.528c-.274 0-.496-.222-.496-.496V7.388c0-.274.222-.496.496-.496zm2.462 0c.274 0 .496.222.496.496v2.304l1.65-1.953c.193-.228.537-.253.764-.059s.252.537.059.764L13.709 9.94l1.482 1.755c.193.228.168.571-.059.764-.227.193-.571.168-.764-.059l-1.482-1.755v1.555c0 .274-.222.497-.496.497s-.496-.223-.496-.497V7.388c0-.274.222-.496.496-.496z" />
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
