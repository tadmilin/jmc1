'use client'
import React from 'react'

// Client component สำหรับปุ่ม breadcrumb
export const NavigationButtons = ({ productTitle }: { productTitle: string }) => {
  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center space-x-2 text-sm">
          <button
            onClick={() => (window.location.href = '/')}
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            หน้าแรก
          </button>
          <span className="text-gray-400">/</span>
          <button
            onClick={() => (window.location.href = '/products')}
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            สินค้าทั้งหมด
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{productTitle}</span>
        </nav>
      </div>
    </div>
  )
}

// Client component สำหรับ footer buttons
export const FooterButtons = () => {
  return (
    <div className="container mx-auto px-4 pb-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={() => (window.location.href = '/')}
          className="flex-1 sm:flex-none px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center min-w-[200px]"
        >
          กลับหน้าหลัก
        </button>
        <button
          onClick={() => (window.location.href = '/quote-request-standalone')}
          className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center min-w-[200px]"
        >
          ขอใบเสนอราคา
        </button>
      </div>
    </div>
  )
}
