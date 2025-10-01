import React from 'react'
import { Metadata } from 'next'
import payload from 'payload'
import { Suspense } from 'react'
import CatalogsClient from './client'

export const metadata: Metadata = {
  title: 'แคตตาล็อกสินค้า - จงมีชัยค้าวัสดุ',
  description: 'ดูแคตตาล็อกสินค้าทั้งหมดของจงมีชัยค้าวัสดุ',
}

async function getCatalogs() {
  try {
    const catalogs = await payload.find({
      collection: 'catalogs',
      depth: 1,
      limit: 12,
      sort: '-createdAt',
    })
    return catalogs
  } catch (error) {
    if ((error as Error)?.message?.includes("can't be found")) {
      return { docs: [] }
    }
    throw error
  }
}

export default async function CatalogPage() {
  const initialData = await getCatalogs()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">แคตตาล็อกสินค้า</h1>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="loading">กำลังโหลด...</div>
          </div>
        }
      >
        <CatalogsClient initialData={initialData} />
      </Suspense>
    </div>
  )
}
