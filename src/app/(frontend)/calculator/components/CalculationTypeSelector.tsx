'use client'

import { Calculator, Home, Building } from 'lucide-react'
import { CALCULATION_TYPES } from '@/config/paint-calculator'
import type { CalculationType } from '@/types/calculator'

interface CalculationTypeSelectorProps {
  selectedType: CalculationType
  onTypeChange: (type: CalculationType) => void
}

const TYPE_ICONS = {
  'total-area': Calculator,
  'wall-by-wall': Building,
  'ceiling': Home,
} as const

export function CalculationTypeSelector({ selectedType, onTypeChange }: CalculationTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-black">เลือกประเภทการคำนวณ</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(CALCULATION_TYPES).map((type) => {
          const IconComponent = TYPE_ICONS[type.id as keyof typeof TYPE_ICONS]
          return (
            <button
              key={type.id}
              onClick={() => onTypeChange(type.id as CalculationType)}
              className={`p-6 rounded-lg border-2 text-left transition-all ${
                selectedType === type.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-black'
              }`}
              suppressHydrationWarning
            >
              <div className="flex items-center space-x-3 mb-3">
                <IconComponent 
                  size={24} 
                  className={selectedType === type.id ? 'text-blue-600' : 'text-gray-500'}
                />
                <h3 className="font-medium">{type.label}</h3>
              </div>
              <p className={`text-sm ${selectedType === type.id ? 'text-blue-600' : 'text-gray-600'}`}>{type.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
} 