import React from 'react'
import { Metadata } from 'next'
import { CatalogsBlock } from '@/blocks/CatalogsBlock/Component'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'แคตตาล็อกสินค้า - จงมีชัยค้าวัสดุ',
  description: 'ดูแคตตาล็อกสินค้าทั้งหมดของจงมีชัยค้าวัสดุ',
}

export default function CatalogPage() {
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
        <CatalogsBlock heading="" layout="grid" limit={12} />
      </Suspense>
    </div>
  )
}
