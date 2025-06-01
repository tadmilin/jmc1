import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'

export default async function AdminCheckPage() {
  let databaseConnection = false
  let headerExists = false
  let footerExists = false
  let pagesCount = 0
  let productsCount = 0
  let error = ''

  try {
    const payload = await getPayload({ config: configPromise })
    databaseConnection = true

    // Check if Header global exists
    try {
      const header = await payload.findGlobal({
        slug: 'header',
        depth: 0,
      })
      headerExists = !!header
    } catch (e) {
      console.error('Header check error:', e)
    }

    // Check if Footer global exists
    try {
      const footer = await payload.findGlobal({
        slug: 'footer',
        depth: 0,
      })
      footerExists = !!footer
    } catch (e) {
      console.error('Footer check error:', e)
    }

    // Check pages count
    try {
      const pages = await payload.find({
        collection: 'pages',
        limit: 1,
      })
      pagesCount = pages.totalDocs
    } catch (e) {
      console.error('Pages check error:', e)
    }

    // Check products count
    try {
      const products = await payload.find({
        collection: 'products',
        limit: 1,
      })
      productsCount = products.totalDocs
    } catch (e) {
      console.error('Products check error:', e)
    }
  } catch (e) {
    error = `Database connection failed: ${e instanceof Error ? e.message : 'Unknown error'}`
    console.error('Database check error:', e)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin & Database Check</h1>

      <div className="space-y-6">
        {/* Database Connection */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Database Connection</h2>
          <div
            className={`p-4 rounded ${databaseConnection ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
          >
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${databaseConnection ? 'bg-green-500' : 'bg-red-500'}`}
              ></div>
              {databaseConnection ? 'Connected ✅' : 'Failed ❌'}
            </div>
            {error && <div className="mt-2 text-sm">{error}</div>}
          </div>
        </div>

        {/* Globals Check */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Globals Check</h2>
          <div className="space-y-2">
            <div
              className={`p-3 rounded flex items-center ${headerExists ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
            >
              <div
                className={`w-3 h-3 rounded-full mr-2 ${headerExists ? 'bg-green-500' : 'bg-yellow-500'}`}
              ></div>
              Header Global: {headerExists ? 'Exists ✅' : 'Not found ⚠️'}
            </div>
            <div
              className={`p-3 rounded flex items-center ${footerExists ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
            >
              <div
                className={`w-3 h-3 rounded-full mr-2 ${footerExists ? 'bg-green-500' : 'bg-yellow-500'}`}
              ></div>
              Footer Global: {footerExists ? 'Exists ✅' : 'Not found ⚠️'}
            </div>
          </div>
        </div>

        {/* Collections Check */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Collections Check</h2>
          <div className="space-y-2">
            <div className="p-3 bg-blue-100 text-blue-800 rounded">
              Pages: {pagesCount} documents
            </div>
            <div className="p-3 bg-blue-100 text-blue-800 rounded">
              Products: {productsCount} documents
            </div>
          </div>
        </div>

        {/* Environment Info */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Environment Info</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>NODE_ENV:</strong> {process.env.NODE_ENV}
            </div>
            <div>
              <strong>Database URL:</strong> {process.env.DATABASE_URI ? 'Set' : 'Not set'}
            </div>
            <div>
              <strong>Payload Secret:</strong> {process.env.PAYLOAD_SECRET ? 'Set' : 'Not set'}
            </div>
            <div>
              <strong>Server URL:</strong> {process.env.NEXT_PUBLIC_SERVER_URL || 'Not set'}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/admin"
              className="block p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-center"
            >
              Open Admin Panel
            </Link>
            <Link
              href="/debug"
              className="block p-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-center"
            >
              View Debug Page
            </Link>
            <Link
              href="/test-navigation"
              className="block p-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-center"
            >
              Test Navigation
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
