import { Block } from 'payload'

export const CatalogsBlock: Block = {
  slug: 'catalogsBlock',
  labels: {
    singular: 'Catalogs Block',
    plural: 'Catalogs Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'หัวข้อ',
      admin: {
        description: 'หัวข้อที่จะแสดงด้านบนของแคตตาล็อก',
      },
    },
    {
      name: 'layout',
      type: 'select',
      label: 'รูปแบบการแสดงผล',
      defaultValue: 'grid',
      options: [
        {
          label: 'Grid (แสดงเป็นตาราง)',
          value: 'grid',
        },
        {
          label: 'List (แสดงเป็นรายการ)',
          value: 'list',
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'รายการแคตตาล็อก',
      minRows: 1,
      admin: {
        description: 'เพิ่มรายการแคตตาล็อกที่ต้องการแสดง',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'ชื่อแคตตาล็อก',
          required: true,
          admin: {
            description: 'ชื่อของแคตตาล็อกที่จะแสดง',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'รายละเอียด',
          admin: {
            description: 'รายละเอียดเกี่ยวกับแคตตาล็อก (ไม่บังคับ)',
          },
        },
        {
          name: 'category',
          type: 'text',
          label: 'หมวดหมู่',
          admin: {
            description: 'หมวดหมู่ของแคตตาล็อก (ไม่บังคับ)',
          },
        },
        {
          name: 'thumbnailImage',
          type: 'upload',
          label: 'รูปภาพปก',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'รูปภาพที่จะแสดงเป็นปกของแคตตาล็อก',
          },
        },
        {
          name: 'pdfFile',
          type: 'upload',
          label: 'ไฟล์ PDF',
          relationTo: 'media',
          required: true,
          filterOptions: {
            mimeType: {
              contains: 'application/pdf',
            },
          },
          admin: {
            description: 'ไฟล์ PDF ที่ลูกค้าสามารถดาวน์โหลดได้',
          },
        },
      ],
    },
  ],
}
