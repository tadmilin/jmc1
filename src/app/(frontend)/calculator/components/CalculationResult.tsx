'use client'

import { PaintBucket, Palette, Lightbulb, Target } from 'lucide-react'
import { PAINT_CONFIG } from '@/config/paint-calculator'
import type { CalculationResult as CalculationResultType } from '@/types/calculator'

interface CalculationResultProps {
  result: CalculationResultType
}

export function CalculationResult({ result }: CalculationResultProps) {
  const { result: paintResult, breakdown } = result

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-center text-black">ผลการคำนวณ</h3>
      
      {/* ผลลัพธ์หลัก */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border-2 border-blue-200">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center space-x-2">
            <Target className="w-5 h-5 text-gray-600" />
            <h4 className="text-lg font-medium text-gray-800">
              {PAINT_CONFIG.LABELS.TOTAL_AREA}: {paintResult.totalArea.toFixed(2)} ตร.ม.
            </h4>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-orange-100 p-4 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <PaintBucket className="w-5 h-5 text-orange-600" />
              <h5 className="font-medium text-orange-800">
                {PAINT_CONFIG.LABELS.PRIMER}
              </h5>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {paintResult.primerAmount} {PAINT_CONFIG.LABELS.GALLONS}
            </p>
          </div>
          
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Palette className="w-5 h-5 text-blue-600" />
              <h5 className="font-medium text-blue-800">
                {PAINT_CONFIG.LABELS.TOPCOAT}
              </h5>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {paintResult.topcoatAmount} {PAINT_CONFIG.LABELS.GALLONS}
            </p>
          </div>
        </div>
      </div>

      {/* รายละเอียดการแบ่งพื้นที่ */}
      {breakdown && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-black mb-3">รายละเอียดการคำนวณ</h4>
          
          {breakdown.walls && breakdown.walls.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-black">พื้นที่ผนัง:</h5>
              {breakdown.walls.map((wall, index) => (
                                  <div key={index} className="flex justify-between text-sm text-black">
                    <span>{wall.name}</span>
                    <span>{wall.area.toFixed(2)} ตร.ม.</span>
                  </div>
              ))}
            </div>
          )}
          
          {breakdown.ceiling && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-black">พื้นที่เพดาน:</h5>
                              <div className="flex justify-between text-sm text-black">
                  <span>เพดาน</span>
                  <span>{breakdown.ceiling.area.toFixed(2)} ตร.ม.</span>
                </div>
            </div>
          )}
        </div>
      )}

      {/* คำแนะนำ */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <div className="flex items-center space-x-2 mb-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          <h4 className="font-medium text-yellow-800">คำแนะนำ</h4>
        </div>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• ควรซื้อสีเพิ่มขึ้น 10-15% เพื่อใช้เก็บแต่งหรือซ่อมแซมในอนาคต</li>
          <li>• การคำนวณนี้ไม่รวมการลบพื้นที่ประตู-หน้าต่าง</li>
          <li>• ปริมาณสีอาจแตกต่างตามชนิดผิวและวิธีการทา</li>
        </ul>
      </div>
    </div>
  )
} 