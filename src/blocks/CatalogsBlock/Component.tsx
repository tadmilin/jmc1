'use client'

import React, { useEffect, useState } from 'react'
import type { Catalog } from '@/payload-types'
import { CatalogsClient } from './Component.client'

interface CatalogsBlockProps {
  heading?: string
  layout?: 'grid' | 'list'
  limit?: number
}

export const CatalogsBlock: React.FC<CatalogsBlockProps> = ({
  heading,
  layout = 'grid',
  limit = 6,
}) => {
  const [catalogs, setCatalogs] = useState<Catalog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await fetch(`/api/catalogs?limit=${limit}`)
        const data = await response.json()
        setCatalogs(data.docs || [])
      } catch (error) {
        console.error('Error fetching catalogs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCatalogs()
  }, [limit])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="loading">กำลังโหลด...</div>
      </div>
    )
  }

  return <CatalogsClient catalogs={catalogs} heading={heading} layout={layout} />
}
