import type {
  CollectionConfig,
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from 'payload'

import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

// Safe revalidation function to avoid server-only import errors
const safeRevalidate = async (path?: string, tag?: string) => {
  try {
    if (typeof window === 'undefined') {
      const { revalidatePath, revalidateTag } = await import('next/cache')
      if (path) revalidatePath(path)
      if (tag) revalidateTag(tag)
    }
  } catch (error) {
    console.warn('Revalidation failed:', error)
  }
}

// Revalidation hook for categories
const revalidateCategory: CollectionAfterChangeHook = async ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    // Revalidate the specific category page
    const path = `/categories/${doc.slug}`
    await safeRevalidate(path)

    // Revalidate the main categories page
    await safeRevalidate('/categories')

    // Revalidate any other pages that might use categories
    await safeRevalidate(undefined, 'categories')
  }
}

const revalidateDeleteCategory: CollectionAfterDeleteHook = async ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    // Revalidate the specific category page
    const path = `/categories/${doc.slug}`
    await safeRevalidate(path)

    // Revalidate the main categories page
    await safeRevalidate('/categories')

    // Revalidate any other pages that might use categories
    await safeRevalidate(undefined, 'categories')
  }
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true, // อนุญาตให้ทุกคนอ่านได้
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
