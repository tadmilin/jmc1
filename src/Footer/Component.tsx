import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Footer } from '@/payload-types'

import { FooterClient } from './Component.client'

export async function Footer() {
  let footerData: Footer | null = null
  try {
    footerData = await getCachedGlobal('footer', 1)()
  } catch {
    /* DB unavailable during build — render with empty data */
  }

  return <FooterClient footerData={footerData as Footer} />
}
