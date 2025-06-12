import { Block } from 'payload'

export const ImageSliderBlock: Block = {
  slug: 'imageSlider',
  labels: {
    singular: 'แบรนด์สไลเดอร์',
    plural: 'แบรนด์สไลเดอร์',
  },
  interfaceName: 'ImageSliderBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'หัวข้อ (ไม่บังคับ)',
      required: false,
      defaultValue: 'แบรนด์ของเรา',
    },
    {
      name: 'slides',
      type: 'array',
      label: 'แบรนด์โลโก้',
      minRows: 5,
      maxRows: 20,
      labels: {
        singular: 'แบรนด์',
        plural: 'แบรนด์',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'โลโก้',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'ชื่อแบรนด์',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          label: 'ลิงก์ (ถ้ามี)',
          required: false,
        }
      ],
    },
    {
      name: 'aspectRatio',
      type: 'select',
      label: 'อัตราส่วนโลโก้',
      defaultValue: '1:1',
      options: [
        {
          label: '1:1 (สี่เหลี่ยมจัตุรัส)',
          value: '1:1',
        },
        {
          label: '16:9 (แนวนอน)',
          value: '16:9',
        },
        {
          label: '4:3 (แนวนอน)',
          value: '4:3',
        },
        {
          label: '3:4 (แนวตั้ง)',
          value: '3:4',
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'สีพื้นหลัง (hex code เช่น #000000)',
      defaultValue: '#000000',
    }
  ],
} 