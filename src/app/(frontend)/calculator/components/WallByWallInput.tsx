'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { WallData } from '@/types/calculator'
import { generateWallId } from '@/utils/paint-calculator'

interface WallByWallInputProps {
  walls: WallData[]
  onChange: (walls: WallData[]) => void
}

export function WallByWallInput({ walls, onChange }: WallByWallInputProps) {
  const addWall = () => {
    const newWall: WallData = {
      id: generateWallId(),
      name: `ผนังที่ ${walls.length + 1}`,
      width: 0,
      height: 0
    }
    onChange([...walls, newWall])
  }

  const removeWall = (id: string) => {
    onChange(walls.filter(wall => wall.id !== id))
  }

  const updateWall = (id: string, field: keyof Omit<WallData, 'id'>, value: string | number) => {
    onChange(walls.map(wall => 
      wall.id === id ? { ...wall, [field]: value } : wall
    ))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-black">ข้อมูลผนัง</h3>
        <button
          onClick={addWall}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          suppressHydrationWarning
        >
          <Plus size={16} />
          <span>เพิ่มผนัง</span>
        </button>
      </div>

      {walls.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p className="text-black">ยังไม่มีข้อมูลผนัง กรุณาเพิ่มผนังเพื่อเริ่มการคำนวณ</p>
        </div>
      )}

      <div className="space-y-4">
        {walls.map((wall) => (
          <div key={wall.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <input
                type="text"
                value={wall.name}
                onChange={(e) => updateWall(wall.id, 'name', e.target.value)}
                className="font-medium bg-transparent border-none outline-none text-lg text-black"
                placeholder="ชื่อผนัง"
                suppressHydrationWarning
              />
              <button
                onClick={() => removeWall(wall.id)}
                className="text-red-600 hover:text-red-800 p-1"
                title="ลบผนัง"
                suppressHydrationWarning
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  ความกว้าง (ม.)
                </label>
                <input
                  type="number"
                  value={wall.width || ''}
                  onChange={(e) => updateWall(wall.id, 'width', Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  min="0"
                  step="0.01"
                  suppressHydrationWarning
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  ความสูง (ม.)
                </label>
                <input
                  type="number"
                  value={wall.height || ''}
                  onChange={(e) => updateWall(wall.id, 'height', Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  min="0"
                  step="0.01"
                  suppressHydrationWarning
                />
              </div>
            </div>
            
            {wall.width > 0 && wall.height > 0 && (
              <div className="mt-2 text-sm text-black">
                พื้นที่: {(wall.width * wall.height).toFixed(2)} ตร.ม.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 