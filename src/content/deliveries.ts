/**
 * Real delivery photos from the shop (Facebook page, 2026). Files live in /public/images/deliveries.
 * Alt text names the material and the area so image search picks up the local context.
 */
export type Delivery = {
  src: string
  alt: string
  material: string
  vehicle: string
}

export const deliveries: Delivery[] = [
  {
    src: '/images/deliveries/steel-rebar-pickup-shop.webp',
    alt: 'รถกระบะของร้านบรรทุกเหล็กเส้นและเหล็กรูปพรรณ เตรียมส่งจากร้านจงมีชัยค้าวัสดุ ตลิ่งชัน',
    material: 'เหล็กเส้น · เหล็กรูปพรรณ',
    vehicle: 'กระบะแร็คเหล็ก',
  },
  {
    src: '/images/deliveries/concrete-piles-crane-loading.webp',
    alt: 'รถเครนยกเสาเข็มคอนกรีตขึ้นรถกระบะ ส่งถึงหน้างาน ย่านตลิ่งชัน',
    material: 'เสาเข็มคอนกรีต',
    vehicle: 'เครนยก + กระบะ',
  },
  {
    src: '/images/deliveries/cement-dump-truck.webp',
    alt: 'รถ 6 ล้อบรรทุกปูนจิงโจ้และปูนซีเมนต์เต็มคัน ส่งวัสดุก่อสร้างถึงหน้างาน',
    material: 'ปูนซีเมนต์ · ปูนสำเร็จรูป',
    vehicle: 'รถ 6 ล้อ',
  },
  {
    src: '/images/deliveries/pvc-pipe-blocks-to-site.webp',
    alt: 'ส่งท่อ PVC อิฐบล็อก และเหล็กเส้นถึงหน้างานรีโนเวทบ้าน',
    material: 'ท่อ PVC · อิฐบล็อก · เหล็ก',
    vehicle: 'กระบะส่งหน้างาน',
  },
  {
    src: '/images/deliveries/concrete-piles-at-site.webp',
    alt: 'เสาเข็มคอนกรีตหกเหลี่ยมและอิฐบล็อกส่งถึงไซต์งานก่อสร้าง',
    material: 'เสาเข็ม · อิฐบล็อก',
    vehicle: 'กระบะ',
  },
  {
    src: '/images/deliveries/steel-box-section-pickup.webp',
    alt: 'เหล็กกล่องจำนวนมากบนแร็ครถกระบะหน้าร้าน ศูนย์สี TOA Color World',
    material: 'เหล็กกล่อง',
    vehicle: 'กระบะแร็คเหล็ก',
  },
  {
    src: '/images/deliveries/concrete-piles-crane-truck.webp',
    alt: 'รถบรรทุกติดเครนขนเสาเข็มคอนกรีตเต็มคัน',
    material: 'เสาเข็มคอนกรีต',
    vehicle: 'รถ 6 ล้อติดเครน',
  },
  {
    src: '/images/deliveries/water-tank-blocks-pickup.webp',
    alt: 'ถังบำบัดน้ำเสียและอิฐบล็อกบนรถกระบะพร้อมส่ง',
    material: 'ถังบำบัด · อิฐบล็อก',
    vehicle: 'กระบะ',
  },
  {
    src: '/images/deliveries/concrete-pipes-pickup.webp',
    alt: 'ท่อระบายน้ำคอนกรีตและบ่อพักสำเร็จรูปขึ้นรถส่งลูกค้า',
    material: 'ท่อคอนกรีต · บ่อพัก',
    vehicle: 'กระบะ',
  },
  {
    src: '/images/deliveries/boards-pickup.webp',
    alt: 'แผ่นบอร์ดซีเมนต์ซ้อนบนรถกระบะ เตรียมส่งงานฝ้าและผนัง',
    material: 'แผ่นบอร์ดซีเมนต์',
    vehicle: 'กระบะ',
  },
]
