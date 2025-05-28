/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'
import './custom.scss'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  try {
    return handleServerFunctions({
      ...args,
      config,
      importMap,
    })
  } catch (error) {
    console.error('Server function error:', error)
    throw error
  }
}

const Layout = ({ children }: Args) => {
  // เพิ่ม error boundary
  try {
    return (
      <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
        {children}
      </RootLayout>
    )
  } catch (error) {
    console.error('Layout error:', error)
    return (
      <html>
        <head>
          <title>Admin Panel - จงมีชัยค้าวัสดุ</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>กำลังโหลด Admin Panel</h1>
            <p>กรุณารอสักครู่...</p>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  console.log('Layout error, attempting reload...');
                  setTimeout(() => window.location.reload(), 3000);
                `,
              }}
            />
          </div>
        </body>
      </html>
    )
  }
}

export default Layout
