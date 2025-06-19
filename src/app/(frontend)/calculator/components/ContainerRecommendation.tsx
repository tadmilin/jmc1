'use client'

import Image from 'next/image'
import { Package, Info } from 'lucide-react'
import type { ContainerRecommendation as ContainerRecommendationType } from '@/types/calculator'

interface ContainerRecommendationProps {
  title: string
  recommendations: ContainerRecommendationType[]
  totalGallons: number
  className?: string
}

export function ContainerRecommendation({ 
  title, 
  recommendations, 
  totalGallons, 
  className = '' 
}: ContainerRecommendationProps) {
  const totalContainers = recommendations.reduce((sum, rec) => sum + rec.quantity, 0)
  const totalActualGallons = recommendations.reduce((sum, rec) => sum + rec.totalGallons, 0)

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Package className="w-5 h-5 text-blue-600" />
        <h4 className="text-lg font-semibold text-black">{title}</h4>
      </div>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center text-sm">
          <span className="text-blue-700">ปริมาณที่ต้องการ:</span>
          <span className="font-medium text-blue-800">{totalGallons} แกลลอน</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-1">
          <span className="text-blue-700">จำนวนถังรวม:</span>
          <span className="font-medium text-blue-800">{totalContainers} ถัง</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-1">
          <span className="text-blue-700">ปริมาณที่ได้จริง:</span>
          <span className="font-medium text-blue-800">{totalActualGallons} แกลลอน</span>
        </div>
        {totalActualGallons > totalGallons && (
          <div className="flex items-center space-x-1 text-xs text-green-600 mt-2">
            <Info className="w-3 h-3" />
            <span>เหลือไว้ใช้เก็บแต่ง: {(totalActualGallons - totalGallons).toFixed(1)} แกลลอน</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
              <Image
                src={rec.container.image}
                alt={rec.container.name}
                width={60}
                height={60}
                className="object-contain"
                onError={(e) => {
                  // แสดง placeholder ถ้าโหลดรูปไม่ได้
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
              <div className="hidden flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                <Package className="w-8 h-8" />
              </div>
            </div>
            
            <div className="flex-1">
              <h5 className="font-medium text-black">{rec.container.name}</h5>
              <p className="text-sm text-gray-600 mb-1">{rec.container.description}</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-700">
                  <strong>จำนวน:</strong> {rec.quantity} ถัง
                  {rec.container.size === 0.25 && rec.quantity === 4 && (
                    <span className="text-blue-600 ml-1">หรือ = 1 แกลลอน</span>
                  )}
                </span>
                <span className="text-gray-700">
                  <strong>รวม:</strong> {rec.totalGallons} แกลลอน
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                ครอบคลุม: {rec.container.coverage.min}-{rec.container.coverage.max} ตร.ม./ถัง
              </div>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>ไม่มีข้อมูลการแนะนำถัง</p>
        </div>
      )}
    </div>
  )
} 