import React from 'react'
import { Metadata } from 'next'
import { getServerSideURL } from '@/utilities/getURL'
import ProductsPageClient from './page.client'

export default function ProductsPage() {
  return <ProductsPageClient />
}

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getServerSideURL()
  const url = `${baseUrl}/products`

  return {
    title: 'สินค้าทั้งหมด | วัสดุก่อสร้าง ตลิ่งชัน ราคาถูก ส่งฟรี | จงมีชัยค้าวัสดุ',
    description:
      'รวมสินค้าวัสดุก่อสร้างครบวงจร ท่อ PVC อุปกรณ์ประปา เหล็ก ปูน อิฐ ทราย หิน เครื่องมือช่าง ราคาโรงงาน ส่งฟรีถึงไซต์งาน ตลิ่งชัน ปิ่นเกล้า จรัญ บางขุนนนท์ โทร 02-434-8319',
    keywords:
      'สินค้าวัสดุก่อสร้าง, ท่อ PVC ราคาถูก, อุปกรณ์ประปา ตลิ่งชัน, เหล็ก ปูน อิฐ ทราย, เครื่องมือช่าง, วัสดุก่อสร้าง ส่งฟรี',
    openGraph: {
      title: 'สินค้าวัสดุก่อสร้างทั้งหมด | จงมีชัยค้าวัสดุ ตลิ่งชัน',
      description:
        'วัสดุก่อสร้างครบวงจร ราคาโรงงาน ส่งฟรีถึงไซต์งาน ตลิ่งชัน และพื้นที่ใกล้เคียง',
      url,
      type: 'website',
      locale: 'th_TH',
    },
    alternates: {
      canonical: url,
    },
  }
}
