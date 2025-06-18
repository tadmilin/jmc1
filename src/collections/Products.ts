import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { authenticated } from '../access/authenticated'
import { anyone } from '../access/anyone'
import { slugField } from '@/fields/slug'
import { link } from '@/fields/link'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'categories', 'stock', 'variants', 'updatedAt'],
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
          min: 0,
          admin: {
            width: '50%',
            step: 0.01,
          },
        },
        {
          name: 'salePrice',
          type: 'number',
          label: 'ราคาลดพิเศษ (บาท)',
          min: 0,
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
          min: 0,
          label: 'จำนวนสต็อก',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'sku',
          type: 'text',
          label: 'รหัสสินค้า (SKU)',
          index: true,
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
      name: 'variants',
      type: 'array',
      label: 'ตัวเลือกย่อยของสินค้า',
      admin: {
        description: 'เพิ่มตัวเลือกย่อยเช่น ขนาด สี หรือประเภทต่างๆ ของสินค้า',
      },
      fields: [
        {
          name: 'variantName',
          type: 'text',
          required: true,
          label: 'ชื่อ/ขนาด/ประเภท',
          admin: {
            description: 'เช่น "4 หุน", "6 หุน", "สีแดง", "ขนาด L" เป็นต้น',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'variantPrice',
              type: 'number',
              required: true,
              min: 0,
              label: 'ราคา (บาท)',
              admin: {
                width: '50%',
                step: 0.01,
                description: 'ราคาเฉพาะของตัวเลือกนี้',
              },
            },
            {
              name: 'variantSalePrice',
              type: 'number',
              label: 'ราคาลดพิเศษ (บาท)',
              min: 0,
              admin: {
                width: '50%',
                step: 0.01,
                description: 'ราคาลดพิเศษของตัวเลือกนี้ (ถ้ามี)',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'variantStock',
              type: 'number',
              defaultValue: 0,
              min: 0,
              label: 'จำนวนสต็อก',
              admin: {
                width: '50%',
                description: 'จำนวนสินค้าคงเหลือของตัวเลือกนี้',
              },
            },
            {
              name: 'variantSku',
              type: 'text',
              label: 'รหัสสินค้า (SKU)',
              index: true,
              admin: {
                width: '50%',
                description: 'รหัสสินค้าเฉพาะของตัวเลือกนี้',
              },
            },
          ],
        },
        {
          name: 'variantImages',
          type: 'array',
          label: 'รูปภาพเฉพาะตัวเลือกนี้',
          maxRows: 5,
          admin: {
            description: 'รูปภาพที่แสดงเฉพาะตัวเลือกนี้ (ถ้าไม่มีจะใช้รูปหลักของสินค้า)',
          },
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
          name: 'variantStatus',
          type: 'select',
          label: 'สถานะตัวเลือก',
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
          ],
          admin: {
            description: 'สถานะของตัวเลือกนี้',
          },
        },
        {
          name: 'isDefault',
          type: 'checkbox',
          label: 'ตัวเลือกหลัก',
          defaultValue: false,
          admin: {
            description: 'กำหนดให้ตัวเลือกนี้เป็นตัวเลือกหลักที่แสดงก่อน',
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
    {
      type: 'collapsible',
      label: 'ปุ่มติดต่อ',
      admin: {
        initCollapsed: true,
        description: 'จัดการปุ่มต่างๆ ในหน้ารายละเอียดสินค้า',
      },
      fields: [
        {
          name: 'addLineButton',
          type: 'group',
          label: 'ปุ่ม Add LINE',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'เปิดใช้งาน',
              defaultValue: true,
            },
            {
              name: 'label',
              type: 'text',
              label: 'ข้อความบนปุ่ม',
              defaultValue: 'Add LINE',
              admin: {
                condition: (data, siblingData) => siblingData?.enabled,
              },
            },
            {
              name: 'lineUrl',
              type: 'text',
              label: 'LINE URL',
              defaultValue: 'https://line.me/R/ti/p/@308aoxno',
              admin: {
                condition: (data, siblingData) => siblingData?.enabled,
                description: 'ลิงก์ LINE Official Account เช่น https://line.me/R/ti/p/@yourlineID',
              },
            },
          ],
        },
        {
          name: 'callButton',
          type: 'group',
          label: 'ปุ่มโทร',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'เปิดใช้งาน',
              defaultValue: true,
            },
            {
              name: 'label',
              type: 'text',
              label: 'ข้อความบนปุ่ม',
              defaultValue: 'โทรหาเรา',
              admin: {
                condition: (data, siblingData) => siblingData?.enabled,
              },
            },
            {
              name: 'phoneNumber',
              type: 'text',
              label: 'เบอร์โทรศัพท์',
              defaultValue: '02-434-8319',
              admin: {
                condition: (data, siblingData) => siblingData?.enabled,
                description: 'เบอร์โทรศัพท์ เช่น 02-434-8319 หรือ 081-234-5678',
              },
            },
          ],
        },
        {
          name: 'quoteButton',
          type: 'group',
          label: 'ปุ่มขอเสนอราคา',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'เปิดใช้งาน',
              defaultValue: true,
            },
            {
              name: 'label',
              type: 'text',
              label: 'ข้อความบนปุ่ม',
              defaultValue: 'ขอเสนอราคา',
              admin: {
                condition: (data, siblingData) => siblingData?.enabled,
              },
            },
            link({
              disableLabel: true,
              overrides: {
                name: 'quoteLink',
                label: 'ลิงก์หน้าขอเสนอราคา',
                admin: {
                  condition: (data, siblingData) => siblingData?.enabled,
                  description: 'เลือกหน้าหรือใส่ลิงก์สำหรับหน้าขอเสนอราคา',
                },
              },
            }),
          ],
        },
      ],
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
    // ลบ hooks ทั้งหมดเพื่อแก้ API error 500
  },
  versions: false,
}