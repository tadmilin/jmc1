import type { GlobalConfig } from 'payload'
import { link } from '@/fields/link'
import { revalidateCategoryShowcase } from './hooks/revalidateCategoryShowcase'

export const CategoryShowcase: GlobalConfig = {
  slug: 'category-showcase',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'categories',
      type: 'array',
      label: 'หมวดหมู่สินค้าที่ต้องการแสดง',
      admin: {
        description: 'หมวดหมู่สินค้าที่จะแสดงในส่วนแนะนำของหน้าแรก (แนะนำให้แสดง 4 หมวดหมู่)',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'หัวข้อ',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'คำอธิบายย่อย',
        },
        {
          name: 'image',
          type: 'upload',
          label: 'รูปภาพ',
          relationTo: 'media',
          required: true,
        },
        link({
          appearances: false,
        }),
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateCategoryShowcase],
  },
} 