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
    },
    {
      name: 'contentType',
      type: 'radio',
      label: 'ประเภทเนื้อหา',
      defaultValue: 'custom',
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
    },
    {
      name: 'customItems',
      type: 'array',
      label: 'รายการเนื้อหา',
      minRows: 1,
      maxRows: 12,
      admin: {
        condition: (data) => data?.contentType === 'custom',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'หัวข้อ',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'คำอธิบายสั้นๆ',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'รูปภาพ',
          required: true,
        },
        {
          name: 'linkType',
          type: 'radio',
          label: 'ประเภทลิงก์',
          defaultValue: 'internal',
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
        },
        {
          name: 'internalLink',
          type: 'relationship',
          relationTo: ['pages', 'posts'],
          label: 'เลือกหน้าที่ต้องการลิงก์',
          admin: {
            condition: (_, siblingData) => siblingData?.linkType === 'internal',
          },
        },
        {
          name: 'externalLink',
          type: 'text',
          label: 'URL ภายนอก',
          admin: {
            condition: (_, siblingData) => siblingData?.linkType === 'external',
          },
        },
        {
          name: 'buttonText',
          type: 'text',
          label: 'ข้อความปุ่ม',
          defaultValue: 'อ่านเพิ่มเติม',
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
        condition: (data) => data?.contentType === 'posts',
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
        condition: (data) => data?.contentType !== 'custom',
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
    },
    {
      name: 'showMoreButton',
      type: 'checkbox',
      label: 'แสดงปุ่ม "ดูทั้งหมด"',
      defaultValue: false,
    },
    {
      name: 'moreButtonText',
      type: 'text',
      label: 'ข้อความปุ่ม "ดูทั้งหมด"',
      defaultValue: 'ดูทั้งหมด',
      admin: {
        condition: (data) => data?.showMoreButton === true,
      },
    },
    {
      name: 'moreButtonLink',
      type: 'relationship',
      relationTo: ['pages', 'posts'],
      label: 'ลิงก์ปุ่ม "ดูทั้งหมด"',
      admin: {
        condition: (data) => data?.showMoreButton === true,
      },
    },
  ],
}

export default ContentGridBlock
