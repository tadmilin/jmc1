import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { CategoryShowcase as CategoryShowcaseType } from '@/payload-types'

import { CategoryShowcaseClient } from './Component.client'

export async function CategoryShowcase() {
  const showcaseData: CategoryShowcaseType = await getCachedGlobal('category-showcase', 1)()

  return <CategoryShowcaseClient showcaseData={showcaseData} />
} 