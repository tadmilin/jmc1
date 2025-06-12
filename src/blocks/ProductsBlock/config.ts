import type { Block } from 'payload'

export const ProductsBlock: Block = {
  slug: 'productsBlock',
  interfaceName: 'ProductsBlock',
  labels: {
    singular: 'บล็อกสินค้า',
    plural: 'บล็อกสินค้า',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'หัวข้อ',
      defaultValue: 'สินค้าลดราคาพิเศษ',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'คำอธิบาย',
      defaultValue: 'สินค้าคุณภาพดีราคาพิเศษ จำกัดเวลา',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'limit',
          type: 'number',
          label: 'จำนวนสินค้าที่แสดง',
          defaultValue: 8,
          min: 1,
          max: 20,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'showOnlyOnSale',
          type: 'checkbox',
          label: 'แสดงเฉพาะสินค้าลดราคา',
          defaultValue: true,
          admin: {
            width: '50%',
            description: 'แสดงเฉพาะสินค้าที่มีราคาลดพิเศษ',
          },
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'กรองตามหมวดหมู่',
      admin: {
        description: 'เลือกหมวดหมู่ที่ต้องการแสดง (ไม่เลือก = แสดงทุกหมวดหมู่)',
      },
    },
    {
      name: 'layout',
      type: 'select',
      label: 'รูปแบบการแสดงผล',
      defaultValue: 'grid',
      options: [
        {
          label: 'แบบตาราง',
          value: 'grid',
        },
        {
          label: 'แบบสไลเดอร์',
          value: 'slider',
        },
      ],
    },
    {
      name: 'showViewAllButton',
      type: 'checkbox',
      label: 'แสดงปุ่ม "ดูทั้งหมด"',
      defaultValue: true,
    },
    {
      name: 'viewAllLink',
      type: 'text',
      label: 'ลิงก์ปุ่ม "ดูทั้งหมด"',
      defaultValue: '/products',
      admin: {
        condition: (data) => data.showViewAllButton,
      },
    },
  ],
} 