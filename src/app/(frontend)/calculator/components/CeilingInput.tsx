'use client'

interface CeilingInputProps {
  width: number
  height: number
  onChange: (dimensions: { width: number; height: number }) => void
}

export function CeilingInput({ width, height, onChange }: CeilingInputProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-black">ขนาดเพดาน</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            ความกว้าง (ม.)
          </label>
          <input
            type="number"
            value={width || ''}
            onChange={(e) => onChange({ width: Number(e.target.value), height })}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            min="0"
            step="0.01"
            suppressHydrationWarning
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            ความยาว (ม.)
          </label>
          <input
            type="number"
            value={height || ''}
            onChange={(e) => onChange({ width, height: Number(e.target.value) })}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            min="0"
            step="0.01"
            suppressHydrationWarning
          />
        </div>
      </div>
      
      {width > 0 && height > 0 && (
        <div className="p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            <strong>พื้นที่เพดาน:</strong> {(width * height).toFixed(2)} ตร.ม.
          </p>
        </div>
      )}
    </div>
  )
} 