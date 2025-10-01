import React from 'react'
import payload from 'payload'
import { CatalogsClient } from './Component.client'

interface CatalogsBlockProps {
  heading?: string
  layout?: 'grid' | 'list'
  limit?: number
}

export const CatalogsBlock = async ({
  heading,
  layout = 'grid',
  limit = 6,
}: CatalogsBlockProps) => {
  const catalogs = await payload.find({
    collection: 'catalogs',
    depth: 1,
    sort: '-createdAt',
    limit,
  })

  return <CatalogsClient catalogs={catalogs.docs} heading={heading} layout={layout} />
}
