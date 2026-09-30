import { site } from './site'

/**
 * Service areas around the shop (ปากซอยชักพระ 6, ตลิ่งชัน).
 * The only area list in the codebase: area pages, the area sitemap, the home map and JSON-LD `areaServed` all read it.
 * `slug` values are live URLs (/service-areas/<slug>) indexed by Google — keep them stable.
 */
export type ServiceArea = {
  slug: string
  name: string
  fullName: string
  /** Approximate road distance from the shop, as the shop quotes it. */
  distanceKm: number
  lat: number
  lng: number
  landmarks: string[]
  intro: string
}

export const serviceAreas: ServiceArea[] = [
  {
    slug: 'talingchan',
    name: 'ตลิ่งชัน',
    fullName: 'เขตตลิ่งชัน',
    distanceKm: 1,
    lat: 13.7766,
    lng: 100.4561,
    landmarks: ['ตลาดน้ำตลิ่งชัน', 'สถานีรถไฟตลิ่งชัน', 'ถนนชักพระ'],
    intro:
      'ร้านอยู่ที่ปากซอยชักพระ 6 ในเขตตลิ่งชัน พื้นที่นี้คือบ้านของเรา รู้จักทุกซอย ส่งของถึงหน้างานได้ตั้งแต่งานซ่อมบ้านเล็กๆ ไปจนถึงงานโครงสร้าง',
  },
  {
    slug: 'suanphak',
    name: 'สวนผัก',
    fullName: 'ถนนสวนผัก',
    distanceKm: 4,
    lat: 13.7862,
    lng: 100.4312,
    landmarks: ['ถนนสวนผัก', 'ถนนบรมราชชนนี'],
    intro:
      'ถนนสวนผักอยู่ใกล้ร้านมาก มีทั้งหมู่บ้านจัดสรรและบ้านเดี่ยว เหมาะกับงานต่อเติมที่ต้องการวัสดุด่วน สั่งทาง LINE แล้วรถออกจากร้านได้เลย',
  },
  {
    slug: 'bangkunnon',
    name: 'บางขุนนนท์',
    fullName: 'แขวงบางขุนนนท์',
    distanceKm: 5,
    lat: 13.7739,
    lng: 100.4727,
    landmarks: ['MRT บางขุนนนท์', 'ถนนบางขุนนนท์'],
    intro:
      'บางขุนนนท์อยู่ติดกับตลิ่งชัน เป็นพื้นที่ที่เราส่งบ่อยที่สุด ทั้งอิฐ หิน ปูน ทราย และเหล็ก เหมาะกับงานที่ขาดของกลางคันและต้องการของเร็ว',
  },
  {
    slug: 'borom',
    name: 'บรมราชชนนี',
    fullName: 'ถนนบรมราชชนนี',
    distanceKm: 6,
    lat: 13.7825,
    lng: 100.445,
    landmarks: ['ถนนบรมราชชนนี', 'ถนนราชพฤกษ์'],
    intro:
      'แนวถนนบรมราชชนนีมีหมู่บ้านและบ้านจัดสรรหนาแน่น เราส่งครอบคลุมทั้งสองฝั่งถนน มีทั้งรถกระบะ รถ 6 ล้อ และรถเครนสำหรับของหนัก',
  },
  {
    slug: 'pinklao',
    name: 'ปิ่นเกล้า',
    fullName: 'ย่านปิ่นเกล้า',
    distanceKm: 8,
    lat: 13.7787,
    lng: 100.4855,
    landmarks: ['เซ็นทรัล ปิ่นเกล้า', 'สะพานสมเด็จพระปิ่นเกล้า', 'โรงพยาบาลศิริราช'],
    intro:
      'ย่านปิ่นเกล้าเป็นที่อยู่อาศัยหนาแน่นและมีงานรีโนเวทต่อเนื่อง ร้านเราอยู่ไม่ไกล ส่งได้ทั้งงานซ่อมแซมบ้านและงานก่อสร้างขนาดใหญ่',
  },
  {
    slug: 'jaran',
    name: 'จรัญสนิทวงศ์',
    fullName: 'ถนนจรัญสนิทวงศ์',
    distanceKm: 7,
    lat: 13.756,
    lng: 100.476,
    landmarks: ['MRT จรัญฯ 13', 'MRT ไฟฉาย', 'MRT บางยี่ขัน'],
    intro:
      'แนวถนนจรัญสนิทวงศ์มีทั้งคอนโด อาคารพาณิชย์ และบ้านในซอยลึก เราส่งวัสดุเข้าซอยได้ด้วยรถกระบะ และใช้รถใหญ่สำหรับงานที่ต้องลงของจำนวนมาก',
  },
  {
    slug: 'bangkoknoi',
    name: 'บางกอกน้อย',
    fullName: 'เขตบางกอกน้อย',
    distanceKm: 6,
    lat: 13.7705,
    lng: 100.475,
    landmarks: ['โรงพยาบาลศิริราช', 'สถานีรถไฟธนบุรี'],
    intro:
      'เขตบางกอกน้อยอยู่ถัดจากตลิ่งชันไปทางแม่น้ำ มีบ้านเก่าที่ซ่อมแซมและรีโนเวทอยู่เสมอ สั่งของทาง LINE พร้อมส่งรูปหน้างาน เราช่วยจัดของให้ตรงงาน',
  },
  {
    slug: 'bangphlat',
    name: 'บางพลัด',
    fullName: 'เขตบางพลัด',
    distanceKm: 6,
    lat: 13.7937,
    lng: 100.505,
    landmarks: ['MRT บางพลัด', 'MRT บางอ้อ'],
    intro:
      'บางพลัดเชื่อมกับตลิ่งชันผ่านถนนบรมราชชนนีและจรัญสนิทวงศ์ ร้านเราส่งได้ทั่วทั้งเขต ทั้งงานบ้านและงานผู้รับเหมา',
  },
  {
    slug: 'thawiwatthana',
    name: 'ทวีวัฒนา',
    fullName: 'เขตทวีวัฒนา',
    distanceKm: 8,
    lat: 13.7727,
    lng: 100.3998,
    landmarks: ['ถนนทวีวัฒนา', 'ถนนพุทธมณฑล สาย 2'],
    intro:
      'เขตทวีวัฒนาอยู่ฝั่งตะวันตกของตลิ่งชัน มีโครงการบ้านใหม่และงานต่อเติมจำนวนมาก เราส่งวัสดุครบทั้งงานโครงสร้างและงานตกแต่ง',
  },
  {
    slug: 'rama5',
    name: 'พระราม 5',
    fullName: 'ถนนพระราม 5',
    distanceKm: 9,
    lat: 13.821,
    lng: 100.492,
    landmarks: ['ถนนพระราม 5', 'สะพานพระราม 5'],
    intro:
      'ย่านพระราม 5 มีหมู่บ้านจัดสรรและโครงการที่อยู่อาศัยขนาดใหญ่ เรารับทั้งออเดอร์ปลีกและออเดอร์งานโครงการ ส่งรายการทาง LINE เพื่อรับใบเสนอราคา',
  },
  {
    slug: 'thonburi',
    name: 'ธนบุรี',
    fullName: 'เขตธนบุรี',
    distanceKm: 10,
    lat: 13.7253,
    lng: 100.4918,
    landmarks: ['วงเวียนใหญ่', 'ถนนอิสรภาพ'],
    intro:
      'เขตธนบุรีมีทั้งอาคารเก่าที่บูรณะและงานก่อสร้างใหม่ เราส่งวัสดุได้ทั้งงานซ่อมแซมและงานโครงสร้าง แจ้งที่อยู่หน้างานทาง LINE เพื่อนัดเวลาส่ง',
  },
  {
    slug: 'bangkruai',
    name: 'บางกรวย',
    fullName: 'อำเภอบางกรวย นนทบุรี',
    distanceKm: 12,
    lat: 13.805,
    lng: 100.473,
    landmarks: ['วัดชลอ', 'ถนนบางกรวย-ไทรน้อย'],
    intro:
      'บางกรวยเป็นพื้นที่ในนนทบุรีที่เราส่งเป็นประจำ มีทั้งชุมชนเก่าและบ้านจัดสรรใหม่ งานไกลหรือของจำนวนมาก แจ้งทาง LINE เพื่อจัดรถให้เหมาะกับงาน',
  },
]

export function getServiceArea(slug: string): ServiceArea | undefined {
  return serviceAreas.find((a) => a.slug === slug)
}

/** Straight-line km offsets (east, north) of a point from the shop, for drawing the service map. */
export function offsetFromShop(lat: number, lng: number): { x: number; y: number } {
  const kmPerDegLat = 110.57
  const kmPerDegLng = 111.32 * Math.cos((site.geo.lat * Math.PI) / 180)
  return {
    x: (lng - site.geo.lng) * kmPerDegLng,
    y: (lat - site.geo.lat) * kmPerDegLat,
  }
}

export function nearbyAreas(slug: string, count = 4): ServiceArea[] {
  const self = getServiceArea(slug)
  if (!self) return serviceAreas.slice(0, count)
  return serviceAreas
    .filter((a) => a.slug !== slug)
    .map((a) => ({ a, d: Math.hypot(a.lat - self.lat, a.lng - self.lng) }))
    .sort((p, q) => p.d - q.d)
    .slice(0, count)
    .map((p) => p.a)
}
