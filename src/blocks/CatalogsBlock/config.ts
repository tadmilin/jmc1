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
    },
    {
      name: 'layout',
      type: 'select',
      label: 'รูปแบบการแสดงผล',
      defaultValue: 'grid',
      options: [
        {
          label: 'Grid',
          value: 'grid',
        },
        {
          label: 'List',
          value: 'list',
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'รายการแคตตาล็อก',
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'ชื่อแคตตาล็อก',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'รายละเอียด',
        },
        {
          name: 'category',
          type: 'text',
          label: 'หมวดหมู่',
        },
        {
          name: 'thumbnailImage',
          type: 'upload',
          label: 'รูปภาพปก',
          relationTo: 'media',
          required: true,
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
        },
      ],
    },
  ],
}
