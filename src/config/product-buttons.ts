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
    addLine: 'Add LINE',
    call: 'โทรหาเรา',
    quote: 'ขอเสนอราคา',
    share: 'แชร์สินค้า',
  },
  
  // CSS classes for buttons
  buttonStyles: {
    line: 'gap-2 bg-green-50 border-green-500 text-green-700 hover:bg-green-100',
    call: 'gap-2 bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-100',
    quote: 'gap-2 bg-orange-50 border-orange-500 text-orange-700 hover:bg-orange-100',
    share: 'w-full gap-2',
  },
  
  // External URL patterns for detecting external links
  externalUrlPatterns: ['http://', 'https://', '//'],
} as const

export type ProductButtonConfig = typeof PRODUCT_BUTTON_CONFIG 