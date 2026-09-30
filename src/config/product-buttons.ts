// Configuration for product contact buttons
export const PRODUCT_BUTTON_CONFIG = {
  // Default fallback URLs
  defaults: {
    quoteUrl: '/quotation',
    lineUrl: 'https://line.me/R/ti/p/@308aoxno',
    phoneNumber: '02-434-8319',
  },
  
  // Button labels
  labels: {
    addLine: 'ทักไลน์ ถามราคา',
    call: 'โทรหาเรา',
    quote: 'ขอเสนอราคา',
    share: 'แชร์สินค้า',
  },
  
  // CSS classes for buttons
  buttonStyles: {
    line: 'h-12 gap-2 rounded-full border-transparent bg-line font-semibold text-white hover:bg-line-dark hover:text-white',
    call: 'h-12 gap-2 rounded-full border-hairline bg-white font-semibold text-ink hover:bg-concrete',
    quote: 'h-12 gap-2 rounded-full border-transparent bg-signal font-semibold text-white hover:bg-signal-600 hover:text-white',
    share: 'w-full gap-2 rounded-full',
  },
  
  // External URL patterns for detecting external links
  externalUrlPatterns: ['http://', 'https://', '//'],
} as const

export type ProductButtonConfig = typeof PRODUCT_BUTTON_CONFIG 