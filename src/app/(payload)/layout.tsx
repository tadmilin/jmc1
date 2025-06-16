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
    console.error('Payload server function error:', error)
    throw error
  }
}

const Layout = ({ children }: Args) => {
  try {
    return (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)
  } catch (error) {
    console.error('Payload layout error:', error)
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>เกิดข้อผิดพลาดในการโหลด Admin Panel</h1>
        <p>กรุณาลองรีเฟรชหน้าใหม่หรือติดต่อผู้ดูแลระบบ</p>
        <details style={{ marginTop: '20px', textAlign: 'left' }}>
          <summary>รายละเอียดข้อผิดพลาด</summary>
          <pre>{error instanceof Error ? error.message : 'Unknown error'}</pre>
        </details>
      </div>
    )
  }
}

export default Layout
