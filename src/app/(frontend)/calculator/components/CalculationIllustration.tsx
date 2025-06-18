'use client'

import Image from 'next/image'
import type { CalculationType } from '@/types/calculator'

interface CalculationIllustrationProps {
  type: CalculationType
}

const ILLUSTRATION_CONFIG = {
  'total-area': {
    src: '/calculator/room-total-area.webp',
    alt: 'ห้องที่ทาสีทั้งหมด - แสดงการคำนวณจากพื้นที่ทั้งหมด',
    title: 'การคำนวณจากพื้นที่ทั้งหมด',
    description: 'เหมาะสำหรับห้องที่มีรูปทรงเรียบง่าย สามารถวัดพื้นที่ทั้งหมดได้อย่างง่ายดาย'
  },
  'wall-by-wall': {
    src: '/calculator/room-wall-sections.webp', 
    alt: 'ห้องแบ่งเป็นส่วนผนัง - แสดงการคำนวณทีละผนัง',
    title: 'การคำนวณแบบแยกผนัง',
    description: 'เหมาะสำหรับห้องที่มีรูปทรงซับซ้อน หรือต้องการความแม่นยำสูง'
  },
  'ceiling': {
    src: '/calculator/room-ceiling.webp',
    alt: 'เพดานห้อง - แสดงการคำนวณเพดาน', 
    title: 'การคำนวณเพดาน',
    description: 'สำหรับการทาสีเพดาน คำนวณจากขนาดกว้าง × ยาว'
  }
} as const

export function CalculationIllustration({ type }: CalculationIllustrationProps) {
  const config = ILLUSTRATION_CONFIG[type]

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
      <div className="aspect-video relative rounded-xl overflow-hidden bg-white shadow-lg mb-4">
        {/* Main Image */}
        <Image
          src={config.src}
          alt={config.alt}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        {/* Icon overlay */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">i</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">{config.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{config.description}</p>
      </div>
      
      {/* Progress indicator */}
      <div className="mt-4 flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
            style={{ width: '75%' }}
          />
        </div>
        <span className="text-xs text-gray-500 font-medium">ตัวอย่าง</span>
      </div>
    </div>
  )
} 