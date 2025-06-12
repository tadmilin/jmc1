import { Block } from 'payload';

export const GoogleMapBlock: Block = {
  slug: 'googleMap',
  labels: {
    singular: 'แผนที่ร้าน',
    plural: 'แผนที่ร้าน',
  },
  interfaceName: 'GoogleMapBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'หัวข้อ',
      defaultValue: 'ที่ตั้งร้านของเรา',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'คำอธิบาย',
    },
    {
      name: 'mapEmbedUrl',
      type: 'text',
      label: 'Google Maps Embed URL',
      required: true,
      defaultValue: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.4650290896626!2d100.52599237523058!3d13.750127997585802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ec7c571b34b%3A0xed43e783d7eec5ae!2z4Liq4LiB4Liy4Lir4Lie4Liy4Lij4Liy4LiT!5e0!3m2!1sth!2sth!4v1717058343895!5m2!1sth!2sth',
      admin: {
        description: 'URL จาก Google Maps (ใช้ Share > Embed a map แล้วคัดลอก URL จาก iframe src)',
      },
    },
    {
      name: 'height',
      type: 'number',
      label: 'ความสูงของแผนที่ (หน่วย: pixels)',
      defaultValue: 450,
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'ที่อยู่',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'เบอร์โทร',
    },
    {
      name: 'email',
      type: 'text',
      label: 'อีเมล',
    },
    {
      name: 'openingHours',
      type: 'textarea',
      label: 'เวลาทำการ',
    },
  ],
}; 