import React from 'react'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Header, Footer } from '@/payload-types'

export default async function DebugPage() {
  const headerData = (await getCachedGlobal('header', 2)()) as Header
  const footerData = (await getCachedGlobal('footer', 2)()) as Footer

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Debug Global Data</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Header Debug */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Header Data</h2>
          <div className="space-y-4">
            <div>
              <strong>Raw Data:</strong>
              <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-auto">
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
          </div>
        </div>

        {/* Footer Debug */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-green-600">Footer Data</h2>
          <div className="space-y-4">
            <div>
              <strong>Raw Data:</strong>
              <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-auto">
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
    </div>
  )
}
