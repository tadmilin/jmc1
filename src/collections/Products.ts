import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'
import { link } from '@/fields/link'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    read: () => true, // อนุญาตให้ทุกคนอ่านได้
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
    {
      type: 'collapsible',
      label: 'การตั้งค่า SEO',
      admin: {
        initCollapsed: true,
        description: 'จัดการข้อมูล SEO สำหรับการค้นหาใน Google และโซเชียลมีเดีย',
        position: 'sidebar',
      },
      fields: [
        {
          name: 'meta',
          type: 'group',
          label: 'Meta Tags',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'SEO Title',
              maxLength: 60,
              admin: {
                description: 'หัวข้อที่แสดงใน Google Search (แนะนำ 50-60 ตัวอักษร)',
                placeholder: 'จะใช้ชื่อสินค้าหากไม่ได้กรอก',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Meta Description',
              maxLength: 160,
              admin: {
                description: 'คำอธิบายที่แสดงใน Google Search (แนะนำ 150-160 ตัวอักษร)',
                placeholder: 'จะใช้คำอธิบายสั้นหากไม่ได้กรอก',
              },
            },
            {
              name: 'keywords',
              type: 'text',
              label: 'Keywords',
              admin: {
                description: 'คำสำคัญสำหรับการค้นหา (คั่นด้วยเครื่องหมายจุลภาค)',
                placeholder: 'เช่น ท่อ PVC, ข้อต่อ, ปั๊มน้ำ',
              },
            },
          ],
        },
        {
          name: 'openGraph',
          type: 'group',
          label: 'Open Graph (Facebook/LINE)',
          admin: {
            description: 'ข้อมูลที่แสดงเมื่อแชร์ลิงก์ใน Facebook, LINE, หรือโซเชียลอื่นๆ',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'OG Title',
              maxLength: 95,
              admin: {
                description: 'หัวข้อที่แสดงเมื่อแชร์ (จะใช้ SEO Title หากไม่ได้กรอก)',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'OG Description',
              maxLength: 300,
              admin: {
                description: 'คำอธิบายที่แสดงเมื่อแชร์ (จะใช้ Meta Description หากไม่ได้กรอก)',
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'OG Image',
              admin: {
                description:
                  'รูปภาพที่แสดงเมื่อแชร์ (แนะนำ 1200x630px) จะใช้รูปแรกของสินค้าหากไม่ได้เลือก',
              },
            },
          ],
        },
        {
          name: 'structuredData',
          type: 'group',
          label: 'Structured Data (JSON-LD)',
          admin: {
            description: 'ข้อมูลโครงสร้างสำหรับ Google Rich Snippets',
          },
          fields: [
            {
              name: 'brand',
              type: 'text',
              label: 'ยี่ห้อ/ผู้ผลิต',
              admin: {
                description: 'ชื่อยี่ห้อหรือผู้ผลิตสินค้า',
                placeholder: 'เช่น Panasonic, SCG, Thai Pipe',
              },
            },
            {
              name: 'model',
              type: 'text',
              label: 'รุ่น/Model',
              admin: {
                description: 'รุ่นหรือโมเดลของสินค้า',
              },
            },
            {
              name: 'gtin',
              type: 'text',
              label: 'GTIN/Barcode',
              admin: {
                description: 'รหัส GTIN, UPC, หรือ EAN ของสินค้า (ถ้ามี)',
              },
            },
            {
              name: 'mpn',
              type: 'text',
              label: 'MPN (Manufacturer Part Number)',
              admin: {
                description: 'รหัสชิ้นส่วนจากผู้ผลิต',
              },
            },
            {
              name: 'condition',
              type: 'select',
              label: 'สภาพสินค้า',
              defaultValue: 'new',
              options: [
                {
                  label: 'ใหม่',
                  value: 'new',
                },
                {
                  label: 'มือสอง - สภาพดี',
                  value: 'used',
                },
                {
                  label: 'มือสอง - สภาพดีมาก',
                  value: 'refurbished',
                },
                {
                  label: 'สินค้าเสียหาย',
                  value: 'damaged',
                },
              ],
            },
            {
              name: 'availability',
              type: 'select',
              label: 'สถานะความพร้อม',
              defaultValue: 'in_stock',
              options: [
                {
                  label: 'มีสินค้า',
                  value: 'in_stock',
                },
                {
                  label: 'สินค้าหมด',
                  value: 'out_of_stock',
                },
                {
                  label: 'สั่งซื้อล่วงหน้า',
                  value: 'preorder',
                },
                {
                  label: 'เลิกจำหน่าย',
                  value: 'discontinued',
                },
              ],
            },
            {
              name: 'priceValidUntil',
              type: 'date',
              label: 'ราคาใช้ได้ถึงวันที่',
              admin: {
                description: 'วันที่ราคานี้จะหมดอายุ (สำหรับ Google)',
                date: {
                  pickerAppearance: 'dayOnly',
                },
              },
            },
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
