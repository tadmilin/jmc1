import type { Block } from 'payload'

export const SaleProductsSliderBlock: Block = {
  slug: 'saleProductsSliderBlock',
  interfaceName: 'SaleProductsSliderBlock',
  labels: {
    singular: 'บล็อกสไลเดอร์สินค้าลดราคา',
    plural: 'บล็อกสไลเดอร์สินค้าลดราคา',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'หัวข้อ',
      defaultValue: 'สินค้าลดราคาพิเศษ 🔥',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'คำอธิบาย',
      defaultValue: 'สินค้าคุณภาพดีราคาพิเศษ จำกัดเวลา อย่าพลาด!',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'limit',
          type: 'number',
          label: 'จำนวนสินค้าที่แสดง',
          defaultValue: 12,
          min: 4,
          max: 20,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'colorTheme',
          type: 'select',
          label: 'ธีมสี',
          defaultValue: 'light',
          options: [
            {
              label: 'สีอ่อน',
              value: 'light',
            },
            {
              label: 'สีเข้ม',
              value: 'dark',
            },
            {
              label: 'ไล่เฉดสี',
              value: 'gradient',
            },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'showViewAllButton',
          type: 'checkbox',
          label: 'แสดงปุ่ม "ดูทั้งหมด"',
          defaultValue: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'viewAllLink',
          type: 'text',
          label: 'ลิงก์ปุ่ม "ดูทั้งหมด"',
          defaultValue: '/products?sale=true',
          admin: {
            width: '50%',
            condition: (data) => data.showViewAllButton,
          },
        },
      ],
    },
  ],
} 