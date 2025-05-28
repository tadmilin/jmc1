'use client'

import { Suspense } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <Suspense
          fallback={
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px',
              }}
            >
              กำลังโหลด Admin Panel...
            </div>
          }
        >
          {children}
        </Suspense>
      </body>
    </html>
  )
}
