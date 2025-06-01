import React from 'react'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Header, Footer } from '@/payload-types'

export default async function DebugPage() {
  let headerData: Header | null = null
  let footerData: Footer | null = null
  let headerError = ''
  let footerError = ''

  try {
    headerData = (await getCachedGlobal('header', 2)()) as Header
  } catch (error) {
    headerError = `Header Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    console.error('Header fetch error:', error)
  }

  try {
    footerData = (await getCachedGlobal('footer', 2)()) as Footer
  } catch (error) {
    footerError = `Footer Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    console.error('Footer fetch error:', error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Debug Global Data</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Header Debug */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Header Data</h2>
          <div className="space-y-4">
            {headerError ? (
              <div className="p-4 bg-red-100 border border-red-400 rounded text-red-700">
                {headerError}
              </div>
            ) : (
              <>
                <div>
                  <strong>Raw Data:</strong>
                  <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-auto max-h-64">
                    {JSON.stringify(headerData, null, 2)}
                  </pre>
                </div>

                <div>
                  <strong>Nav Items Count:</strong> {headerData?.navItems?.length || 0}
                </div>

                {headerData?.navItems && headerData.navItems.length > 0 && (
                  <div>
                    <strong>Nav Items:</strong>
                    <ul className="mt-2 space-y-2">
                      {headerData.navItems.map((item, index) => (
                        <li key={index} className="p-2 bg-gray-50 rounded">
                          <div>
                            <strong>Label:</strong> {item.link?.label}
                          </div>
                          <div>
                            <strong>Type:</strong> {item.link?.type}
                          </div>
                          <div>
                            <strong>URL:</strong> {item.link?.url}
                          </div>
                          <div>
                            <strong>Reference:</strong> {JSON.stringify(item.link?.reference)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer Debug */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-green-600">Footer Data</h2>
          <div className="space-y-4">
            {footerError ? (
              <div className="p-4 bg-red-100 border border-red-400 rounded text-red-700">
                {footerError}
              </div>
            ) : (
              <>
                <div>
                  <strong>Raw Data:</strong>
                  <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-auto max-h-64">
                    {JSON.stringify(footerData, null, 2)}
                  </pre>
                </div>

                <div>
                  <strong>Nav Items Count:</strong> {footerData?.navItems?.length || 0}
                </div>

                {footerData?.navItems && footerData.navItems.length > 0 && (
                  <div>
                    <strong>Nav Items:</strong>
                    <ul className="mt-2 space-y-2">
                      {footerData.navItems.map((item, index) => (
                        <li key={index} className="p-2 bg-gray-50 rounded">
                          <div>
                            <strong>Label:</strong> {item.link?.label}
                          </div>
                          <div>
                            <strong>Type:</strong> {item.link?.type}
                          </div>
                          <div>
                            <strong>URL:</strong> {item.link?.url}
                          </div>
                          <div>
                            <strong>Reference:</strong> {JSON.stringify(item.link?.reference)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-100 rounded-lg">
        <h3 className="font-bold text-yellow-800">Instructions:</h3>
        <p className="text-yellow-700 mt-2">
          1. ตรวจสอบข้อมูลข้างต้น
          <br />
          2. ถ้าไม่มี navItems ให้ไปที่ Admin Panel → Globals → Header/Footer
          <br />
          3. เพิ่ม Nav Items และ Save
          <br />
          4. Refresh หน้านี้เพื่อดูข้อมูลใหม่
        </p>
      </div>

      {/* Additional Debug Info */}
      <div className="mt-8 p-4 bg-blue-100 rounded-lg">
        <h3 className="font-bold text-blue-800">Environment Info:</h3>
        <div className="text-blue-700 mt-2 space-y-1">
          <div>
            <strong>Node ENV:</strong> {process.env.NODE_ENV}
          </div>
          <div>
            <strong>Server URL:</strong> {process.env.NEXT_PUBLIC_SERVER_URL || 'Not set'}
          </div>
          <div>
            <strong>Current Time:</strong> {new Date().toISOString()}
          </div>
        </div>
      </div>
    </div>
  )
}
