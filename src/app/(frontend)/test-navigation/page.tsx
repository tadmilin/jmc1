import React from 'react'
import Link from 'next/link'

export default function TestNavigationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Test Navigation</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Test Next.js Link */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Next.js Link</h2>
          <div className="space-y-2">
            <Link
              href="/"
              className="block p-2 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
            >
              หน้าแรก
            </Link>
            <Link
              href="/products"
              className="block p-2 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
            >
              สินค้าทั้งหมด
            </Link>
            <Link
              href="/categories"
              className="block p-2 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
            >
              หมวดหมู่
            </Link>
            <Link
              href="/debug"
              className="block p-2 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
            >
              Debug Page
            </Link>
          </div>
        </div>

        {/* Test Button Navigation */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-green-600">Button Navigation</h2>
          <div className="space-y-2">
            <button
              onClick={() => (window.location.href = '/')}
              className="block w-full text-left p-2 bg-green-100 rounded hover:bg-green-200 transition-colors"
            >
              หน้าแรก (Button)
            </button>
            <button
              onClick={() => (window.location.href = '/products')}
              className="block w-full text-left p-2 bg-green-100 rounded hover:bg-green-200 transition-colors"
            >
              สินค้าทั้งหมด (Button)
            </button>
            <button
              onClick={() => (window.location.href = '/categories')}
              className="block w-full text-left p-2 bg-green-100 rounded hover:bg-green-200 transition-colors"
            >
              หมวดหมู่ (Button)
            </button>
          </div>
        </div>

        {/* Test Window Open */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-purple-600">Window Open</h2>
          <div className="space-y-2">
            <button
              onClick={() => window.open('/', '_self')}
              className="block w-full text-left p-2 bg-purple-100 rounded hover:bg-purple-200 transition-colors"
            >
              หน้าแรก (Window Open)
            </button>
            <button
              onClick={() => window.open('/products', '_self')}
              className="block w-full text-left p-2 bg-purple-100 rounded hover:bg-purple-200 transition-colors"
            >
              สินค้าทั้งหมด (Window Open)
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-100 rounded-lg">
        <h3 className="font-bold text-yellow-800">Test Results:</h3>
        <p className="text-yellow-700 mt-2">
          ทดสอบวิธีการ navigation ต่างๆ เพื่อดูว่าวิธีไหนทำงานได้ดีที่สุด
        </p>
      </div>
    </div>
  )
}
