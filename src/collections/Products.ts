import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import React from 'react'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'categories', 'stock', 'updatedAt'],
    group: 'เนื้อหา',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'ชื่อสินค้า',
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({}),
      label: 'คำอธิบายสินค้า',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'คำอธิบายสั้น',
      admin: {
        description: 'คำอธิบายสั้นๆ สำหรับแสดงในรายการสินค้า (แนะนำ 100-150 ตัวอักษร)',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          required: true,
          label: 'ราคา (บาท)',
          admin: {
            width: '50%',
            step: 0.01,
          },
        },
        {
          name: 'salePrice',
          type: 'number',
          label: 'ราคาลดพิเศษ (บาท)',
          admin: {
            width: '50%',
            step: 0.01,
            description: 'ใส่ราคาลดพิเศษ (ถ้ามี)',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'stock',
          type: 'number',
          defaultValue: 0,
          label: 'จำนวนสต็อก',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'sku',
          type: 'text',
          label: 'รหัสสินค้า (SKU)',
          admin: {
            width: '50%',
            description: 'รหัสสินค้าเฉพาะ (ถ้ามี)',
          },
        },
      ],
    },
    {
      name: 'images',
      type: 'array',
      label: 'รูปภาพสินค้า',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          label: 'ข้อความ Alt',
          admin: {
            description: 'คำอธิบายรูปภาพสำหรับ SEO และผู้พิการทางสายตา',
          },
        },
      ],

    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      required: true,
      label: 'หมวดหมู่สินค้า',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'สินค้าแนะนำ',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'แสดงในหน้าแรกและหมวดสินค้าแนะนำ',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'สถานะสินค้า',
      defaultValue: 'active',
      options: [
        {
          label: 'พร้อมขาย',
          value: 'active',
        },
        {
          label: 'ไม่พร้อมขาย',
          value: 'inactive',
        },
        {
          label: 'สินค้าหมด',
          value: 'out_of_stock',
        },
        {
          label: 'เลิกจำหน่าย',
          value: 'discontinued',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'specifications',
      type: 'array',
      label: 'รายละเอียดสินค้า',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'หัวข้อ',
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'ข้อมูล',
        },
      ],

    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'สินค้าที่เกี่ยวข้อง',
      admin: {
        position: 'sidebar',
      },
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        }
      },
    },
    ...slugField(),
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-set status based on stock
        if (typeof data.stock === 'number' && data.stock <= 0 && data.status === 'active') {
          data.status = 'out_of_stock'
        }
        return data
      },
    ],
  },
  versions: {
    drafts: true,
  },
} 