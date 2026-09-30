/**
 * Single source of truth for the shop's contact facts and site-level copy.
 * Everything that shows NAP (name, address, phone), hours, LINE or map data imports from here.
 */

export const site = {
  name: 'จงมีชัยค้าวัสดุ',
  shortName: 'JMC',
  tagline: 'ร้านวัสดุก่อสร้าง ตลิ่งชัน',
  domain: 'jongmeechai.com',

  phone: {
    display: '02-434-8319',
    href: 'tel:024348319',
    e164: '+6624348319',
  },

  line: {
    id: '@308aoxno',
    /** Add-friend short link (redirects to line.me/R/ti/p/@308aoxno). */
    addUrl: 'https://lin.ee/uSpo9iT',
    qrSrc: '/images/line-qr.svg',
  },

  facebook: 'https://www.facebook.com/jmc1990lekmor',

  address: {
    street: '38,40 ปากซอยชักพระ 6 ถนนชักพระ',
    subdistrict: 'แขวงตลิ่งชัน',
    district: 'เขตตลิ่งชัน',
    province: 'กรุงเทพมหานคร',
    postalCode: '10170',
    short: 'ปากซอยชักพระ 6 ตลิ่งชัน',
  },

  geo: { lat: 13.780839074740534, lng: 100.4622982337261 },

  hours: {
    label: 'เปิดทุกวัน 07:00–17:00',
    opens: '07:00',
    closes: '17:00',
    /** 0 = Sunday … 6 = Saturday */
    days: [0, 1, 2, 3, 4, 5, 6],
  },

  maps: {
    shareUrl: 'https://share.google/TxjtGXd6tcJBmaMCd',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=13.780839074740534,100.4622982337261',
    /** Place embed of the shop's Google Business profile. */
    embedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.9682244285186!2d100.45917647485648!3d13.780789086614172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e299f52b7ca1a7%3A0x1267449fe77cc72!2z4LiI4LiH4Lih4Li14LiK4Lix4Lii4LiE4LmJ4Liy4Lin4Lix4Liq4LiU4Li4!5e0!3m2!1sth!2sth!4v1749179140985!5m2!1sth!2sth',
  },

  facts: {
    years: 35,
    deliveryRadiusKm: 10,
  },

  seo: {
    title: 'วัสดุก่อสร้างใกล้ฉัน ตลิ่งชัน ปากซอยชักพระ 6 | จงมีชัยค้าวัสดุ',
    description:
      'ร้านวัสดุก่อสร้างใกล้ฉัน ตลิ่งชัน ปากซอยชักพระ 6 อิฐ หิน ปูน ทราย เหล็ก ประปา ไฟฟ้า สี ส่งถึงหน้างานด้วยรถของร้าน บริการตลิ่งชัน ปิ่นเกล้า จรัญฯ บางขุนนนท์ บรมราชชนนี สวนผัก บางพลัด พระราม 5 บางกรวย แอดไลน์ @308aoxno โทร 02-434-8319',
    keywords:
      'ร้านวัสดุก่อสร้างใกล้ฉัน, วัสดุก่อสร้างใกล้ฉัน, ร้านวัสดุก่อสร้าง ตลิ่งชัน, วัสดุก่อสร้าง ตลิ่งชัน, วัสดุก่อสร้าง ชักพระ, จงมีชัยค้าวัสดุ, อิฐ หิน ปูน ทราย, เหล็กเส้น, เสาเข็ม, ท่อ PVC, สีทาบ้าน TOA, ส่งวัสดุถึงหน้างาน, วัสดุก่อสร้าง ปิ่นเกล้า, วัสดุก่อสร้าง บางขุนนนท์, วัสดุก่อสร้าง จรัญสนิทวงศ์, วัสดุก่อสร้าง บรมราชชนนี, วัสดุก่อสร้าง บางพลัด, วัสดุก่อสร้าง บางกรวย',
    ogImage: '/images/deliveries/steel-rebar-pickup-shop.webp',
  },
} as const

export type Site = typeof site

/** Primary navigation. Code-owned; the CMS `header` global is no longer read. */
export const mainNav = [
  { label: 'สินค้า', href: '/products' },
  { label: 'พื้นที่จัดส่ง', href: '/#service-area' },
  { label: 'คำนวณสี', href: '/calculator' },
  { label: 'บทความ', href: '/posts' },
  { label: 'ติดต่อ', href: '/contact' },
] as const

/**
 * LINE "oaMessage" deep link: opens a chat with the shop's official account with `text` prefilled.
 * Format per LINE URL scheme docs: https://line.me/R/oaMessage/{LINE ID}/?{url-encoded text}
 */
export function lineMessageUrl(text: string): string {
  return `https://line.me/R/oaMessage/${encodeURIComponent(site.line.id)}/?${encodeURIComponent(text)}`
}

export const fullAddress = `${site.address.street} ${site.address.subdistrict} ${site.address.district} ${site.address.province} ${site.address.postalCode}`
