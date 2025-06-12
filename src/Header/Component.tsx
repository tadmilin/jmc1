import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { HeaderClient } from './Component.client'

export async function Header() {
  const headerData = await getCachedGlobal('header', 2)() as HeaderType

  return <HeaderClient data={headerData} />
}
