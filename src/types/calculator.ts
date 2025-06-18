export type CalculationType = 'total-area' | 'wall-by-wall' | 'ceiling'

export interface WallData {
  id: string
  name: string
  width: number
  height: number
}

export interface CalculationInput {
  type: CalculationType
  totalArea?: number
  walls?: WallData[]
  ceiling?: {
    width: number
    height: number
  }
}

export interface PaintResult {
  totalArea: number
  primerAmount: number  // เกลอน สีรองพื้น ทา 1 รอบ
  topcoatAmount: number // เกลอน สีจริง ทา 2 รอบ
}

export interface CalculationResult {
  input: CalculationInput
  result: PaintResult
  breakdown?: {
    walls?: Array<{
      name: string
      area: number
    }>
    ceiling?: {
      area: number
    }
  }
} 