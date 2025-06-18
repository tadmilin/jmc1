import { PAINT_CONFIG, PAINT_CONTAINERS } from '@/config/paint-calculator'
import type { 
  CalculationInput, 
  CalculationResult, 
  PaintResult, 
  WallData, 
  PaintContainer, 
  ContainerRecommendation 
} from '@/types/calculator'

/**
 * คำนวณพื้นที่ของผนัง
 */
export function calculateWallArea(width: number, height: number): number {
  return width * height
}

/**
 * คำนวณการผสมผสานถังสีที่เหมาะสม
 */
export function calculateOptimalContainers(requiredGallons: number): ContainerRecommendation[] {
  const containers = [...PAINT_CONTAINERS.sizes].sort((a, b) => b.size - a.size) // เรียงจากใหญ่ไปเล็ก
  const recommendations: ContainerRecommendation[] = []
  let remainingGallons = requiredGallons

  for (const container of containers) {
    if (remainingGallons >= container.size) {
      const quantity = Math.floor(remainingGallons / container.size)
      if (quantity > 0) {
        recommendations.push({
          container,
          quantity,
          totalGallons: quantity * container.size
        })
        remainingGallons -= quantity * container.size
        remainingGallons = Number(remainingGallons.toFixed(2))
      }
    }
  }

  // หากยังเหลือ ให้เลือกถังที่เล็กที่สุดที่ครอบคลุมได้
  if (remainingGallons > 0) {
    const smallestSuitable = containers
      .reverse() // เรียงจากเล็กไปใหญ่
      .find(container => container.size >= remainingGallons)
    
    if (smallestSuitable) {
      const existing = recommendations.find(r => r.container.size === smallestSuitable.size)
      if (existing) {
        existing.quantity += 1
        existing.totalGallons += smallestSuitable.size
      } else {
        recommendations.push({
          container: smallestSuitable,
          quantity: 1,
          totalGallons: smallestSuitable.size
        })
      }
    }
  }

  return recommendations.sort((a, b) => b.container.size - a.container.size)
}

/**
 * คำนวณปริมาณสีที่ต้องใช้
 */
export function calculatePaintAmount(totalArea: number): PaintResult {
  const primerAmount = Number((totalArea / PAINT_CONFIG.PRIMER_COVERAGE).toFixed(1))
  const topcoatAmount = Number((totalArea / PAINT_CONFIG.TOPCOAT_COVERAGE).toFixed(1))
  
  const primerContainers = calculateOptimalContainers(primerAmount)
  const topcoatContainers = calculateOptimalContainers(topcoatAmount)
  
  return {
    totalArea,
    primerAmount,
    topcoatAmount,
    primerContainers,
    topcoatContainers
  }
}

/**
 * คำนวณพื้นที่รวมจากผนังหลายหน้า
 */
export function calculateTotalWallsArea(walls: WallData[]): number {
  return walls.reduce((total, wall) => {
    return total + calculateWallArea(wall.width, wall.height)
  }, 0)
}

/**
 * คำนวณผลลัพธ์ตามประเภทการคำนวณ
 */
export function calculatePaint(input: CalculationInput): CalculationResult {
  let totalArea = 0
  let breakdown: CalculationResult['breakdown'] = {}

  switch (input.type) {
    case 'total-area':
      totalArea = input.totalArea || 0
      break

    case 'wall-by-wall':
      if (input.walls && input.walls.length > 0) {
        totalArea = calculateTotalWallsArea(input.walls)
        breakdown.walls = input.walls.map(wall => ({
          name: wall.name,
          area: calculateWallArea(wall.width, wall.height)
        }))
      }
      break

    case 'ceiling':
      if (input.ceiling) {
        totalArea = calculateWallArea(input.ceiling.width, input.ceiling.height)
        breakdown.ceiling = {
          area: totalArea
        }
      }
      break

    default:
      throw new Error(`Unsupported calculation type: ${input.type}`)
  }

  const result = calculatePaintAmount(totalArea)

  return {
    input,
    result,
    breakdown
  }
}

/**
 * สร้าง ID สำหรับผนังใหม่
 */
export function generateWallId(): string {
  return `wall-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * ตรวจสอบข้อมูลการคำนวณ
 */
export function validateCalculationInput(input: CalculationInput): string | null {
  switch (input.type) {
    case 'total-area':
      if (!input.totalArea || input.totalArea <= 0) {
        return 'กรุณาใส่พื้นที่ทั้งหมดที่มากกว่า 0'
      }
      break

    case 'wall-by-wall':
      if (!input.walls || input.walls.length === 0) {
        return 'กรุณาเพิ่มข้อมูลผนังอย่างน้อย 1 หน้า'
      }
      for (const wall of input.walls) {
        if (wall.width <= 0 || wall.height <= 0) {
          return `กรุณาใส่ขนาดของ${wall.name}ให้ถูกต้อง`
        }
      }
      break

    case 'ceiling':
      if (!input.ceiling || input.ceiling.width <= 0 || input.ceiling.height <= 0) {
        return 'กรุณาใส่ขนาดเพดานให้ถูกต้อง'
      }
      break

    default:
      return 'ประเภทการคำนวณไม่ถูกต้อง'
  }

  return null
} 