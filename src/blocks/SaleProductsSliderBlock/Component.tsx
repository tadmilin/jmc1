import React from 'react'
import { SaleProductsSlider } from '@/components/SaleProductsSlider'

interface SaleProductsSliderBlockProps {
  title?: string
  subtitle?: string
  limit?: number
  colorTheme?: string
  showViewAllButton?: boolean
  viewAllLink?: string
}

export const SaleProductsSliderBlock: React.FC<SaleProductsSliderBlockProps> = (props) => {
  const {
    title = 'สินค้าลดราคาพิเศษ 🔥',
    subtitle = 'สินค้าคุณภาพดีราคาพิเศษ จำกัดเวลา อย่าพลาด!',
    limit = 12,
    colorTheme = 'light',
    showViewAllButton = true,
    viewAllLink = '/products?sale=true',
  } = props

  return (
    <SaleProductsSlider
      title={title}
      subtitle={subtitle}
      limit={limit}
      colorTheme={colorTheme}
      showViewAllButton={showViewAllButton}
      viewAllLink={viewAllLink}
    />
  )
} 