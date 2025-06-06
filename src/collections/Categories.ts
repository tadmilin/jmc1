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
    defaultColumns: ['title', 'slug'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
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
      name: 'description',
      type: 'textarea',
      label: 'คำอธิบาย',
    },
    ...slugField(),
  ],
}
