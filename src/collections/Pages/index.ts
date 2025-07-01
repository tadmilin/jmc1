import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Code } from '../../blocks/Code/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { ImageSliderBlock } from '../../blocks/ImageSliderBlock/config'
import { CategoryGridBlock } from '../../blocks/CategoryGridBlock/config'
import { ContentGridBlock } from '../../blocks/ContentGridBlock/config'
import { GoogleMapBlock } from '../../blocks/GoogleMapBlock/config'
import { ServiceFeaturesBlock } from '../../blocks/ServiceFeaturesBlock/config'
import { ProductsBlock } from '../../blocks/ProductsBlock/config'
import { QuoteRequestFormBlock } from '../../blocks/QuoteRequestFormBlock/config'
import { hero } from '@/heros/config'
import { slugField } from '@/fields/slug'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

// SEO plugin imports removed - using manual SEO fields instead

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const slug = typeof data?.slug === 'string' && data.slug ? data.slug : 'draft-preview'

        const path = generatePreviewPath({
          slug,
          collection: 'pages',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) => {
      const slug = typeof data?.slug === 'string' && data.slug ? data.slug : 'draft-preview'

      return generatePreviewPath({
        slug,
        collection: 'pages',
        req,
      })
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                CallToAction,
                Code,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
                ImageSliderBlock,
                CategoryGridBlock,
                ContentGridBlock,
                GoogleMapBlock,
                ServiceFeaturesBlock,
                ProductsBlock,
                QuoteRequestFormBlock,
              ],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'SEO Title',
              admin: {
                description: 'หัวข้อที่จะแสดงใน Google Search (ควรไม่เกิน 60 ตัวอักษร)',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'SEO Description',
              admin: {
                description: 'คำอธิบายที่จะแสดงใน Google Search (ควรไม่เกิน 160 ตัวอักษร)',
              },
            },
            {
              name: 'keywords',
              type: 'text',
              label: 'SEO Keywords',
              admin: {
                description: 'คำค้นหาสำคัญ (คั่นด้วยเครื่องหมายจุลภาค)',
              },
            },
            {
              name: 'image',
              type: 'relationship',
              relationTo: 'media',
              label: 'SEO Image หลัก',
              admin: {
                description: 'รูปภาพหลักที่จะแสดงเมื่อแชร์ในโซเชียล',
              },
            },
            {
              name: 'images',
              type: 'relationship',
              relationTo: 'media',
              hasMany: true,
              label: 'รูปภาพเพิ่มเติม (สำหรับ Google Images)',
              admin: {
                description:
                  'เพิ่มรูปภาพหลายรูปเพื่อให้ Google แสดงใน Search Results (แนะนำ 3-8 รูป)',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
