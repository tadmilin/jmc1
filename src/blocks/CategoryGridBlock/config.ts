import { Block } from 'payload'
import {
  lexicalEditor,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  LinkFeature
} from '@payloadcms/richtext-lexical'

export const CategoryGridBlock: Block = {
  slug: 'categoryGrid',
  labels: {
    singular: 'หมวดหมู่สินค้า',
    plural: 'หมวดหมู่สินค้า',
  },
  interfaceName: 'CategoryGridBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'หัวข้อ',
      defaultValue: 'หมวดหมู่สินค้า',
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        features: [
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          LinkFeature({
            enabledCollections: ['pages', 'posts']
          })
        ],
      }),
      label: 'คำอธิบาย (ถ้ามี)',
    },
    {
      name: 'categorySelection',
      type: 'radio',
      label: 'วิธีการเลือกหมวดหมู่',
      defaultValue: 'all',
      options: [
        {
          label: 'แสดงทุกหมวดหมู่',
          value: 'all',
        },
        {
          label: 'เลือกหมวดหมู่เอง',
          value: 'select',
        }
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'เลือกหมวดหมู่ที่ต้องการแสดง',
      admin: {
        condition: (data) => data?.categorySelection === 'select',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'จำนวนหมวดหมู่ที่แสดง (สูงสุด)',
      defaultValue: 12,
      admin: {
        condition: (data) => data?.categorySelection === 'all',
      },
    },
    {
      name: 'columns',
      type: 'select',
      label: 'จำนวนคอลัมน์',
      defaultValue: 'auto',
      options: [
        {
          label: 'อัตโนมัติ (Responsive)',
          value: 'auto',
        },
        {
          label: '2 คอลัมน์',
          value: '2',
        },
        {
          label: '3 คอลัมน์',
          value: '3',
        },
        {
          label: '4 คอลัมน์',
          value: '4',
        },
        {
          label: '6 คอลัมน์',
          value: '6',
        },
      ],
    },
    {
      name: 'showCategoryNames',
      type: 'checkbox',
      label: 'แสดงชื่อหมวดหมู่',
      defaultValue: true,
    },
  ],
}

export default CategoryGridBlock; 