'use client'

interface TotalAreaInputProps {
  value: number
  onChange: (value: number) => void
}

export function TotalAreaInput({ value, onChange }: TotalAreaInputProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">พื้นที่ทั้งหมดที่ต้องการทาสี</h3>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder="ใส่พื้นที่ (ตร.ม.)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          min="0"
          step="0.01"
          suppressHydrationWarning
        />
        <span className="text-gray-600 font-medium">ตร.ม.</span>
      </div>
    </div>
  )
} 