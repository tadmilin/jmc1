import type { Field, Block } from 'payload'
// import type { Block } from 'payload/types' // Comment out or remove incorrect path
// import type { Block } from 'payload/dist/fields/config/types' 

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

// Define Blocks for framedHeroContent
const HeroContentTextBlock: Block = {
  slug: 'heroContentText',
  labels: {
    singular: 'เนื้อหาข้อความ',
    plural: 'เนื้อหาข้อความ',
  },
  fields: [
    {
      name: 'text',
      type: 'richText',
      label: 'ข้อความ',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h3', 'h4', 'h5'] }),
          InlineToolbarFeature(),
        ],
      }),
    },
  ],
}

const HeroContentImageBlock: Block = {
  slug: 'heroContentImage',
  labels: {
    singular: 'รูปภาพ',
    plural: 'รูปภาพ',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'รูปภาพ',
    },
    {
      name: 'caption',
      type: 'text',
      label: 'คำอธิบายภาพ (ไม่บังคับ)',
    },
  ],
}

const HeroContentSpacerBlock: Block = {
  slug: 'heroContentSpacer',
  labels: {
    singular: 'ตัวเว้นระยะ',
    plural: 'ตัวเว้นระยะ',
  },
  fields: [
    {
      name: 'height',
      type: 'number',
      label: 'ความสูง (px)',
      defaultValue: 20,
      admin: {
        description: 'กำหนดความสูงของตัวเว้นระยะเป็นพิกเซล',
        step: 1,
      }
    },
  ],
}

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'colorTheme',
      type: 'select',
      defaultValue: 'light',
      label: 'ธีมสี',
      options: [
        {
          label: 'สว่าง (พื้นหลังขาว)',
          value: 'light',
        },
        {
          label: 'สว่างพร้อมเฉดสีฟ้า',
          value: 'lightBlue',
        },
        {
          label: 'มืด (พื้นหลังเข้ม)',
          value: 'dark',
        },
        {
          label: 'แบบไล่ระดับ',
          value: 'gradient',
        },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      label: 'รูปพื้นหลัง',
      relationTo: 'media',
      admin: {
        description: 'รูปพื้นหลังสำหรับ Hero Section',
      },
    },
    {
      name: 'layoutVariant',
      type: 'select',
      defaultValue: 'standard',
      label: 'รูปแบบการจัดวาง',
      options: [
        {
          label: 'มาตรฐาน',
          value: 'standard',
        },
        {
          label: 'สลับด้าน',
          value: 'reversed',
        },
        {
          label: 'แบบกึ่งกลาง',
          value: 'centered',
        },
      ],
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
    },
    {
      name: 'showDecorations',
      type: 'checkbox',
      label: 'แสดงองค์ประกอบตกแต่ง',
      defaultValue: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'slideImages',
      type: 'array',
      label: 'รูปภาพสไลด์โชว์',
      admin: {
        description: 'เพิ่มรูปภาพหลายรูปเพื่อแสดงเป็นสไลด์โชว์',
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'รูปภาพ',
        },
        {
          name: 'caption',
          type: 'text',
          label: 'คำอธิบายภาพ',
        },
      ],
    },
    {
      name: 'showCategoriesDropdown',
      type: 'checkbox',
      label: 'แสดงเมนูหมวดหมู่แบบ Dropdown',
      defaultValue: true,
      admin: {
        description: 'เปิด/ปิดการแสดงเมนูหมวดหมู่แบบ Dropdown',
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
    },
    {
      name: 'categoriesLimit',
      type: 'number',
      label: 'จำนวนหมวดหมู่ที่แสดง',
      defaultValue: 10,
      admin: {
        description: 'จำนวนหมวดหมู่สูงสุดที่จะแสดงในเมนู',
        condition: (_, { type, showCategoriesDropdown } = {}) => 
          ['highImpact', 'mediumImpact'].includes(type) && showCategoriesDropdown === true,
      },
    },
    {
      name: 'featuredText',
      type: 'text',
      label: 'ข้อความเด่น (แสดงในแบนเนอร์พิเศษ)',
      admin: {
        condition: (_, { type, showDecorations } = {}) => 
          ['highImpact', 'mediumImpact'].includes(type) && showDecorations === true,
      },
    },
    // New fields for framed content
    {
      name: 'displayFrame',
      type: 'checkbox',
      label: 'แสดงกรอบเนื้อหาเสริม',
      defaultValue: false,
      admin: {
        description: 'เลือกเพื่อแสดงกรอบเนื้อหาเพิ่มเติมทางด้านขวาของ Hero (สำหรับ High/Medium Impact)',
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      }
    },
    {
      name: 'framedHeroContent',
      label: 'เนื้อหาในกรอบ (ถ้าเปิดใช้งาน)',
      type: 'blocks',
      minRows: 0,
      maxRows: 5, // สามารถปรับเปลี่ยนได้ตามความเหมาะสม
      blocks: [
        HeroContentTextBlock,
        HeroContentImageBlock,
        HeroContentSpacerBlock,
      ],
      admin: {
        condition: (_, { type, displayFrame } = {}) => 
          ['highImpact', 'mediumImpact'].includes(type) && displayFrame === true,
        description: 'เพิ่มเนื้อหาต่างๆ ที่จะแสดงในกรอบด้านขวา (เมื่อเปิดใช้งาน)'
      }
    },
    {
      name: 'heroActionSlots',
      label: 'ช่องแอ็คชันฮีโร่ (Hero Action Slots)',
      type: 'array',
      minRows: 0,
      maxRows: 6, // เปลี่ยนจาก 4 เป็น 6 ช่อง
      labels: {
        singular: 'ช่องแอ็คชัน',
        plural: 'ช่องแอ็คชัน',
      },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'ไอคอน/รูปภาพประกอบ',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'หัวข้อหลัก',
        },
        {
          name: 'description',
          type: 'text',
          label: 'คำอธิบาย (ไม่บังคับ)',
        },
        linkGroup({
          overrides: {
            name: 'slotLink', // ตั้งชื่อ field link group ให้ไม่ซ้ำกับ link group อื่น
            label: 'ลิงก์สำหรับช่องนี้',
            maxRows: 1, // แต่ละ slot มีได้ 1 link
          },
          appearances: false, // ไม่ต้องการให้มี appearance options สำหรับ link นี้
        }),
      ],
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact', 'lowImpact'].includes(type), // ให้แสดงในทุก type ของ Hero ที่เหมาะสม
        description: 'เพิ่มช่องที่มีไอคอน, หัวข้อ, คำอธิบาย และลิงก์ (แสดงผลด้านล่าง Hero หลัก)'
      }
    },
    {
      name: 'socialMediaButtons',
      label: 'ปุ่มโซเชียลมีเดีย',
      type: 'array',
      minRows: 0,
      maxRows: 5,
      labels: {
        singular: 'ปุ่มโซเชียล',
        plural: 'ปุ่มโซเชียล',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'ชื่อปุ่ม',
          admin: {
            description: 'เช่น "Line", "Facebook", "โทรศัพท์"'
          }
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'ไอคอน/โลโก้',
          admin: {
            description: 'รูปไอคอนสำหรับปุ่ม (แนะนำขนาด 32x32px หรือ 64x64px)'
          }
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'ลิงก์ URL',
          admin: {
            description: 'เช่น https://line.me/ti/p/your-line-id, https://www.facebook.com/your-page, tel:0801234567'
          }
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'เปิดในแท็บใหม่',
          defaultValue: true,
          admin: {
            description: 'เปิดลิงก์ในแท็บใหม่หรือไม่'
          }
        }
      ],
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
        description: 'เพิ่มปุ่มโซเชียลมีเดีย (Line, Facebook, เบอร์โทร) ที่จะแสดงใต้หมวดหมู่สินค้า'
      }
    }
  ],
  label: false,
}
