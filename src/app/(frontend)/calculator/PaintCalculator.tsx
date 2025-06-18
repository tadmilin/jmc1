'use client'

import { useState } from 'react'
import { Calculator } from 'lucide-react'
import type { CalculationType, CalculationInput, CalculationResult as CalculationResultType, WallData } from '@/types/calculator'
import { calculatePaint, validateCalculationInput } from '@/utils/paint-calculator'
import { CalculationTypeSelector } from './components/CalculationTypeSelector'
import { TotalAreaInput } from './components/TotalAreaInput'
import { WallByWallInput } from './components/WallByWallInput'
import { CeilingInput } from './components/CeilingInput'
import { CalculationResult } from './components/CalculationResult'
import { CalculationIllustration } from './components/CalculationIllustration'

export function PaintCalculator() {
  const [calculationType, setCalculationType] = useState<CalculationType>('total-area')
  const [totalArea, setTotalArea] = useState<number>(0)
  const [walls, setWalls] = useState<WallData[]>([])
  const [ceiling, setCeiling] = useState({ width: 0, height: 0 })
  const [result, setResult] = useState<CalculationResultType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = () => {
    setError(null)
    
    const input: CalculationInput = {
      type: calculationType,
      totalArea: calculationType === 'total-area' ? totalArea : undefined,
      walls: calculationType === 'wall-by-wall' ? walls : undefined,
      ceiling: calculationType === 'ceiling' ? ceiling : undefined
    }

    // ตรวจสอบข้อมูล
    const validationError = validateCalculationInput(input)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      const calculationResult = calculatePaint(input)
      setResult(calculationResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการคำนวณ')
    }
  }

  const renderInputForm = () => {
    switch (calculationType) {
      case 'total-area':
        return <TotalAreaInput value={totalArea} onChange={setTotalArea} />
      
      case 'wall-by-wall':
        return <WallByWallInput walls={walls} onChange={setWalls} />
      
      case 'ceiling':
        return (
          <CeilingInput 
            width={ceiling.width} 
            height={ceiling.height} 
            onChange={setCeiling} 
          />
        )
    }
  }

  return (
    <div className="space-y-8">
      {/* เลือกประเภทการคำนวณ */}
      <CalculationTypeSelector 
        selectedType={calculationType}
        onTypeChange={(type) => {
          setCalculationType(type)
          setResult(null)
          setError(null)
        }}
      />

      {/* แบบฟอร์มใส่ข้อมูล + รูปประกอบ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ฟอร์มใส่ข้อมูล */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          {renderInputForm()}
        </div>
        
        {/* รูปประกอบ */}
        <div className="order-first lg:order-last">
          <CalculationIllustration type={calculationType} />
        </div>
      </div>

      {/* ปุ่มคำนวณ */}
      <div className="text-center">
        <button
          onClick={handleCalculate}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          suppressHydrationWarning
        >
          <Calculator size={20} />
          <span>คำนวณปริมาณสี</span>
        </button>
      </div>

      {/* แสดงข้อผิดพลาด */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">⚠️ {error}</p>
        </div>
      )}

      {/* แสดงผลลัพธ์ */}
      {result && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <CalculationResult result={result} />
        </div>
      )}
    </div>
  )
} 