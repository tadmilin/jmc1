/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: Args) => {
  // เพิ่ม error boundary และ debugging
  try {
    return RootPage({ config, params, searchParams, importMap })
  } catch (error) {
    console.error('Admin page error:', error)
    // Return a fallback UI
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Admin Panel Loading...</h1>
        <p>กำลังโหลด Admin Panel กรุณารอสักครู่</p>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('Admin page mounted');
              setTimeout(() => {
                if (window.location.pathname.includes('/admin')) {
                  window.location.reload();
                }
              }, 2000);
            `,
          }}
        />
      </div>
    )
  }
}

export default Page
