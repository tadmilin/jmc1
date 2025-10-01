import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'

// Import the type from payload-types.ts instead
import type { Catalog } from '../payload-types'
export type { Catalog as ICatalog }

export const Catalogs: CollectionConfig = {
  slug: 'catalogs',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'category', 'createdAt'],
  },
  access: {
    read: anyone,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'ชื่อแคตตาล็อก',
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
      relationTo: 'media',
      required: true,
      label: 'รูปภาพปก',
    },
    {
      name: 'pdfFile',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'ไฟล์ PDF',
      filterOptions: {
        mimeType: {
          contains: 'application/pdf',
        },
      },
    },
  ],
}

export default Catalogs
