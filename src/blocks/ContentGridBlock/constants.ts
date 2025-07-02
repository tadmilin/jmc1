export const DEFAULT_VALUES = {
  TITLE: 'รวมเรื่องน่ารู้คู่คนรักบ้าน',
  LIMIT: 6,
  COLUMNS: 'auto' as const,
  CONTENT_TYPE: 'custom' as const,
  SHOW_MORE_BUTTON: false,
  MORE_BUTTON_TEXT: 'ดูทั้งหมด',
  BUTTON_TEXT: {
    CUSTOM: 'อ่านเพิ่มเติม',
    POSTS: 'อ่านบทความ',
    PRODUCTS: 'ดูผลิตภัณฑ์',
  },
} as const

export const API_CONFIG = {
  DEPTH: 2,
  SORT: '-createdAt',
} as const

export const GRID_CLASSES = {
  auto: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
} as const

export const ERROR_MESSAGES = {
  POSTS_FETCH_ERROR: 'ไม่สามารถดึงข้อมูลบทความได้',
  PRODUCTS_FETCH_ERROR: 'ไม่สามารถดึงข้อมูลผลิตภัณฑ์ได้',
  GENERAL_ERROR: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
} as const

export const EMPTY_STATE_MESSAGES = {
  custom: 'กรุณาเพิ่มรายการเนื้อหาในการตั้งค่า',
  posts: 'ไม่พบบทความที่ตรงกับเงื่อนไขที่กำหนด',
  products: 'ไม่พบผลิตภัณฑ์ที่จะแสดง',
} as const
