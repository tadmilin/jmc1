import { Block } from 'payload'
import {
  lexicalEditor,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  LinkFeature
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
      defaultValue: 'บทความมีประโยชน์ของคนรักบ้าน',
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
      name: 'limit',
      type: 'number',
      label: 'จำนวนบทความที่แสดง',
      defaultValue: 6,
      min: 1,
      max: 12,
      admin: {
        description: 'จำนวนบทความสูงสุดที่จะแสดงใน grid',
      },
    },
    {
      name: 'columns',
      type: 'select',
      label: 'จำนวนคอลัมน์',
      defaultValue: '3',
      options: [
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
      label: 'แสดงปุ่ม "ดูบทความทั้งหมด"',
      defaultValue: true,
      admin: {
        description: 'แสดงปุ่มลิงก์ไปหน้าบทความที่ด้านล่าง grid',
      },
    },
    {
      name: 'moreButtonText',
      type: 'text',
      label: 'ข้อความปุ่ม',
      defaultValue: 'ดูบทความทั้งหมด',
      admin: {
        condition: (data, siblingData) => {
          const showMore = data?.showMoreButton || siblingData?.showMoreButton
          return showMore === true
        },
        description: 'ข้อความที่แสดงบนปุ่ม',
      },
    },
    {
      name: 'moreButtonLink',
      type: 'text',
      label: 'ลิงก์ปุ่ม',
      defaultValue: '/posts',
      admin: {
        condition: (data, siblingData) => {
          const showMore = data?.showMoreButton || siblingData?.showMoreButton
          return showMore === true
        },
        description: 'URL ที่จะลิงก์ไปเมื่อคลิกปุ่ม เช่น /posts',
      },
    },
  ],
}

export default ContentGridBlock
