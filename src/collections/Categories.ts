import type { CollectionConfig } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

// Revalidation hook for categories
const revalidateCategory = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    // Revalidate the specific category page
    const path = `/categories/${doc.slug}`
    revalidatePath(path)
    
    // Revalidate the main categories page
    revalidatePath('/categories')
    
    // Revalidate any other pages that might use categories
    revalidateTag('categories')
  }
}

const revalidateDeleteCategory = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    // Revalidate the specific category page
    const path = `/categories/${doc.slug}`
    revalidatePath(path)
    
    // Revalidate the main categories page
    revalidatePath('/categories')
    
    // Revalidate any other pages that might use categories
    revalidateTag('categories')
  }
}

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
  hooks: {
    afterChange: [revalidateCategory],
    afterDelete: [revalidateDeleteCategory],
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
      name: 'displayOrder',
      type: 'number',
      label: 'ลำดับแสดงผลหน้าเว็บ',
      defaultValue: 999,
      admin: {
        description: 'ลำดับที่จะแสดงในหน้าเว็บ (เลขน้อยแสดงก่อน) - ใช้สำหรับจัดลำดับเฉพาะหน้าเว็บ',
        position: 'sidebar',
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
  defaultSort: 'displayOrder',
}
