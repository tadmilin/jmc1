import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'sortOrder'],
    group: 'เนื้อหา',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'ชื่อหมวดหมู่',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'คำอธิบาย',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'รูปภาพหมวดหมู่',
      admin: {
        description: 'ขนาดแนะนำ 400x400 พิกเซล',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'ลำดับการแสดง',
      defaultValue: 0,
      admin: {
        description: 'กำหนดลำดับการแสดง (เลขน้อยแสดงก่อน)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'เปิดใช้งาน',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  defaultSort: 'sortOrder',
}
