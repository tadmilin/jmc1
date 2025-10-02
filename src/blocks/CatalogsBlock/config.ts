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
      name: 'limit',
      type: 'number',
      label: 'จำนวนที่แสดง',
      defaultValue: 6,
    },
  ],
}
