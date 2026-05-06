import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { HeaderClient } from './Component.client'

export async function Header() {
  let headerData: HeaderType | null = null
  try {
    headerData = await getCachedGlobal('header', 2)() as HeaderType
  } catch {
    /* DB unavailable during build — render with empty data */
  }

  return <HeaderClient data={headerData as HeaderType} />
}
