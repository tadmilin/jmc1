import { Block } from 'payload'
import {
  lexicalEditor,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  LinkFeature,
  HeadingFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'

export const ContentGridBlock: Block = {
  slug: 'contentGrid',
  labels: {
    singular: 'บทความกริด',
    plural: 'บทความกริด',
  },
  interfaceName: 'ContentGridBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'หัวข้อหลัก',
      defaultValue: 'รวมเรื่องน่ารู้คู่คนรักบ้าน',
      admin: {
        description: 'หัวข้อหลักที่จะแสดงด้านบนของ grid',
      },
    },
    {
      name: 'subtitle',
      type: 'richText',
      editor: lexicalEditor({
        features: [
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          LinkFeature({
            enabledCollections: ['pages', 'posts'],
          }),
        ],
      }),
      label: 'คำอธิบายใต้หัวข้อ',
      admin: {
        description: 'คำอธิบายเพิ่มเติมใต้หัวข้อหลัก (ตัวเลือก)',
      },
    },
    {
      name: 'contentType',
      type: 'radio',
      label: 'ประเภทเนื้อหา',
      defaultValue: 'custom',
      required: true,
      options: [
        {
          label: 'เนื้อหาที่กำหนดเอง',
          value: 'custom',
        },
        {
          label: 'ดึงจากบทความล่าสุด',
          value: 'posts',
        },
        {
          label: 'ดึงจากผลิตภัณฑ์',
          value: 'products',
        },
      ],
      admin: {
        description: 'เลือกประเภทของเนื้อหาที่ต้องการแสดง',
        layout: 'vertical',
      },
    },
    {
      name: 'customItems',
      type: 'array',
      label: 'รายการเนื้อหา',
      minRows: 1,
      maxRows: 12,
      admin: {
        condition: (data, siblingData) => {
          // Check both data and siblingData for contentType
          const contentType = data?.contentType || siblingData?.contentType
          console.log('CustomItems condition check:', { contentType, data, siblingData })
          return contentType === 'custom'
        },
        description: 'เพิ่มรายการเนื้อหาที่ต้องการแสดงใน grid',
        initCollapsed: false,
        components: {
          RowLabel: ({ data, index }) => {
            return data?.title || `รายการที่ ${index + 1}`
          },
        },
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'หัวข้อ',
          required: true,
          admin: {
            description: 'หัวข้อของเนื้อหา',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'คำอธิบายสั้นๆ',
          admin: {
            description: 'คำอธิบายย่อของเนื้อหา (ตัวเลือก)',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'รูปภาพ',
          required: true,
          admin: {
            description: 'รูปภาพที่จะแสดงในการ์ด',
          },
        },
        {
          name: 'linkType',
          type: 'radio',
          label: 'ประเภทลิงก์',
          defaultValue: 'internal',
          required: true,
          options: [
            {
              label: 'ลิงก์ภายใน',
              value: 'internal',
            },
            {
              label: 'ลิงก์ภายนอก',
              value: 'external',
            },
          ],
          admin: {
            layout: 'horizontal',
          },
        },
        {
          name: 'internalLink',
          type: 'relationship',
          relationTo: ['pages', 'posts'],
          label: 'เลือกหน้าที่ต้องการลิงก์',
          admin: {
            condition: (_, siblingData) => {
              return siblingData?.linkType === 'internal'
            },
            description: 'เลือกหน้าหรือบทความที่ต้องการลิงก์ไป',
          },
        },
        {
          name: 'externalLink',
          type: 'text',
          label: 'URL ภายนอก',
          admin: {
            condition: (_, siblingData) => {
              return siblingData?.linkType === 'external'
            },
            description: 'ใส่ URL เต็ม เช่น https://example.com',
          },
          validate: (value, { siblingData }) => {
            if (siblingData?.linkType === 'external' && !value) {
              return 'กรุณาใส่ URL ภายนอก'
            }
            if (siblingData?.linkType === 'external' && value && !value.startsWith('http')) {
              return 'URL ต้องขึ้นต้นด้วย http:// หรือ https://'
            }
            return true
          },
        },
        {
          name: 'buttonText',
          type: 'text',
          label: 'ข้อความปุ่ม',
          defaultValue: 'อ่านเพิ่มเติม',
          admin: {
            description: 'ข้อความที่แสดงบนปุ่ม',
          },
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'เลือกหมวดหมู่ (สำหรับดึงจากบทความ)',
      admin: {
        condition: (data, siblingData) => {
          const contentType = data?.contentType || siblingData?.contentType
          return contentType === 'posts'
        },
        description: 'กรองบทความตามหมวดหมู่ที่เลือก (ถ้าไม่เลือกจะแสดงทุกหมวดหมู่)',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'จำนวนรายการที่แสดง',
      defaultValue: 6,
      min: 1,
      max: 12,
      admin: {
        condition: (data, siblingData) => {
          const contentType = data?.contentType || siblingData?.contentType
          return contentType !== 'custom'
        },
        description: 'จำนวนรายการสูงสุดที่จะแสดงใน grid',
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
      ],
      admin: {
        description: 'จำนวนคอลัมน์ที่จะแสดงในแต่ละแถว',
      },
    },
    {
      name: 'showMoreButton',
      type: 'checkbox',
      label: 'แสดงปุ่ม "ดูทั้งหมด"',
      defaultValue: false,
      admin: {
        description: 'แสดงปุ่มลิงก์ไปหน้าอื่นที่ด้านล่าง grid',
      },
    },
    {
      name: 'moreButtonText',
      type: 'text',
      label: 'ข้อความปุ่ม "ดูทั้งหมด"',
      defaultValue: 'ดูทั้งหมด',
      admin: {
        condition: (data, siblingData) => {
          const showMore = data?.showMoreButton || siblingData?.showMoreButton
          return showMore === true
        },
        description: 'ข้อความที่แสดงบนปุ่ม "ดูทั้งหมด"',
      },
    },
    {
      name: 'moreButtonLink',
      type: 'relationship',
      relationTo: ['pages', 'posts'],
      label: 'ลิงก์ปุ่ม "ดูทั้งหมด"',
      admin: {
        condition: (data, siblingData) => {
          const showMore = data?.showMoreButton || siblingData?.showMoreButton
          return showMore === true
        },
        description: 'หน้าที่จะลิงก์ไปเมื่อคลิกปุ่ม "ดูทั้งหมด"',
      },
    },
  ],
}

export default ContentGridBlock
