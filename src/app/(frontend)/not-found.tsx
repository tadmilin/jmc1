import Link from 'next/link'
import React from 'react'
import type { Metadata } from 'next'

import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'ไม่พบหน้านี้ | จงมีชัยค้าวัสดุ',
  description: 'ไม่พบหน้าที่คุณต้องการ กรุณากลับไปหน้าหลักหรือค้นหาสินค้าวัสดุก่อสร้างที่ต้องการ',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="container py-28 text-center">
      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">ไม่พบหน้าที่คุณต้องการ</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        หน้านี้อาจถูกลบ เปลี่ยนชื่อ หรือไม่มีอยู่ในระบบ ลองค้นหาสินค้าหรือกลับไปหน้าหลัก
      </p>
      <div className="flex gap-4 justify-center">
        <Button asChild variant="default">
          <Link href="/">หน้าหลัก</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/products">ดูสินค้าทั้งหมด</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">ติดต่อเรา</Link>
        </Button>
      </div>
    </div>
  )
}
