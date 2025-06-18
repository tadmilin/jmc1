// ค่าคงที่สำหรับการคำนวณสี
export const PAINT_CONFIG = {
  // ปริมาณการครอบคลุมของสี (ตร.ม. ต่อ เกลอน)
  PRIMER_COVERAGE: 32,     // สีรองพื้น ครอบคลุม 32 ตร.ม./เกลอน (ทา 1 รอบ)
  TOPCOAT_COVERAGE: 16,    // สีจริง ครอบคลุม 16 ตร.ม./เกลอน (ทา 2 รอบ รวมแล้ว)
  
  // จำนวนรอบการทา
  PRIMER_COATS: 1,
  TOPCOAT_COATS: 2,
  
  // ข้อความแสดงผล
  LABELS: {
    PRIMER: 'สีรองพื้น (ทา 1 รอบ)',
    TOPCOAT: 'สีจริง (ทา 2 รอบ)',
    TOTAL_AREA: 'พื้นที่ทั้งหมด',
    GALLONS: 'เกลอน'
  }
} as const

// ข้อมูลขนาดถังสีและพื้นที่ที่ครอบคลุม
export const PAINT_CONTAINERS = {
  sizes: [
    { 
      size: 0.25, 
      name: '1/4 แกลลอน (ควอร์ต)', 
      coverage: { min: 8, max: 9 },
      image: '/calculator/paint-container-quarter.webp',
      description: 'เหมาะสำหรับงานเล็กๆ หรือซ่อมแซม'
    },
    { 
      size: 1, 
      name: '1 แกลลอน', 
      coverage: { min: 30, max: 35 },
      image: '/calculator/paint-container-1gallon.webp',
      description: 'ขนาดมาตรฐาน เหมาะสำหรับห้องขนาดกลาง'
    },
    { 
      size: 2.5, 
      name: '2.5 แกลลอน (ถังกลาง)', 
      coverage: { min: 75, max: 80 },
      image: '/calculator/paint-container-2.5gallon.webp',
      description: 'เหมาะสำหรับงานขนาดใหญ่'
    },
    { 
      size: 5, 
      name: '5 แกลลอน (ถังใหญ่)', 
      coverage: { min: 150, max: 160 },
      image: '/calculator/paint-container-5gallon.webp',
      description: 'ประหยัดที่สุด สำหรับงานขนาดใหญ่มาก'
    }
  ]
} as const

export const CALCULATION_TYPES = {
  'total-area': {
    id: 'total-area',
    label: 'คำนวณจากพื้นที่ทั้งหมด',
    description: 'ใส่ค่าพื้นที่ทั้งหมดที่ต้องการทาสี'
  },
  'wall-by-wall': {
    id: 'wall-by-wall',
    label: 'คำนวณแบบผนัง',
    description: 'คำนวณกว้าง × สูง (สามารถเพิ่มจำนวนผนังได้)'
  },
  'ceiling': {
    id: 'ceiling',
    label: 'คำนวณเพดาน',
    description: 'คำนวณกว้าง × สูง สำหรับเพดาน'
  }
} as const 