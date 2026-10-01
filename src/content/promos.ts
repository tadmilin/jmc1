/**
 * Promo posters (the shop's Facebook ad creatives, 1:1). Files live in /public/images/promos.
 * The text is baked into the images, so they are always shown whole (never cropped) and the
 * alt text repeats the poster copy. Each tile opens a LINE chat prefilled with `lineText`.
 */
export type Promo = {
  src: string
  alt: string
  title: string
  lineText: string
}

export const promos: Promo[] = [
  {
    src: '/images/promos/materials-delivery.webp',
    alt: 'วัสดุก่อสร้าง พร้อมส่งถึงหน้างาน เสาเข็มคอนกรีต ปูนซีเมนต์ เหล็กทุกชนิด ส่งไวใกล้ตลิ่งชันและไกลกว่า 10 กม. จงมีชัยค้าวัสดุ ปากซอยชักพระ 6',
    title: 'วัสดุก่อสร้าง พร้อมส่งถึงหน้างาน',
    lineText: 'สนใจสั่งวัสดุก่อสร้าง ส่งถึงหน้างาน',
  },
  {
    src: '/images/promos/tpi-cement.webp',
    alt: 'ปูน TPI พร้อมส่ง ปูนปอร์ตแลนด์ประเภท 1 และปูนผสม TPI 197 ของแท้ สต็อกแน่น รถส่งถึงหน้างาน จงมีชัยค้าวัสดุ ปากซอยชักพระ 6',
    title: 'ปูน TPI พร้อมส่ง',
    lineText: 'สนใจปูน TPI ขอราคาหน่อยครับ',
  },
  {
    src: '/images/promos/boards-plywood.webp',
    alt: 'แผ่นบอร์ด ไม้หน้าสาม พร้อมส่ง ยิปซัมบอร์ด SHERA Board ไม้แบบแดง ไม้หน้าสาม ไม้ดำ จงมีชัยค้าวัสดุ ศูนย์สี TOA Color World ปากซอยชักพระ 6',
    title: 'แผ่นบอร์ด ไม้หน้าสาม พร้อมส่ง',
    lineText: 'สนใจแผ่นบอร์ด / ไม้หน้าสาม ขอราคาหน่อยครับ',
  },
]
