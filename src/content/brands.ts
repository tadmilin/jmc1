/**
 * Brands the shop sells ("แบรนด์ที่เรามีจำหน่าย").
 * `logo` is a file in /public/brands; entries without one render as a text wordmark tile.
 * To add a brand: drop its logo (SVG preferred, transparent background) into /public/brands and add a row here.
 */
export type Brand = {
  name: string
  logo?: string
  /** Category shown under the wordmark when there is no logo. */
  note?: string
}

export const brands: Brand[] = [
  { name: 'TOA', logo: '/brands/toa.webp' },
  { name: 'TPI Polene', logo: '/brands/tpi.webp' },
  { name: 'SCG', note: 'ปูน · หลังคา · ท่อ' },
  { name: 'ตราช้าง', note: 'ปูนซีเมนต์ SCG' },
  { name: 'ตราเสือ', note: 'ปูนสำเร็จรูป' },
  { name: 'ปูนจิงโจ้', logo: '/brands/jingjo.webp' },
  { name: 'Denzo', logo: '/brands/denzo.webp' },
  { name: 'Jotun', logo: '/brands/jotun.svg' },
  { name: 'Nippon Paint', logo: '/brands/nippon-paint.svg' },
  { name: 'Beger', note: 'สีทาบ้าน' },
  { name: 'จระเข้', note: 'กาวซีเมนต์ · กันซึม' },
  { name: 'Sika', logo: '/brands/sika.svg' },
  { name: 'SHERA', note: 'ไม้ไฟเบอร์ซีเมนต์' },
  { name: 'GypLine', note: 'แผ่นยิปซัม' },
  { name: 'Sanwa', logo: '/brands/sanwa.webp' },
  { name: 'ท่อน้ำไทย', note: 'ท่อ PVC' },
  { name: 'American Standard', logo: '/brands/american-standard.svg' },
  { name: 'Kohler', logo: '/brands/kohler.svg' },
  { name: 'Grohe', logo: '/brands/grohe.svg' },
  { name: 'Panasonic', logo: '/brands/panasonic.svg' },
  { name: 'Philips', logo: '/brands/philips.svg' },
  { name: 'Toshiba', logo: '/brands/toshiba.svg' },
  { name: 'Mitsubishi Electric', logo: '/brands/mitsubishi-electric.svg' },
  { name: 'Hitachi', logo: '/brands/hitachi.svg' },
  { name: 'Bosch', logo: '/brands/bosch.svg' },
  { name: 'Makita', logo: '/brands/makita.svg' },
  { name: 'Stanley', logo: '/brands/stanley.svg' },
  { name: '3M', logo: '/brands/3m.svg' },
  { name: 'WD-40', logo: '/brands/wd40.svg' },
]
