import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
  HeadingFeature,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../access/authenticated'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated, // เฉพาะ Admin upload ได้
    delete: authenticated, // เฉพาะ Admin ลบได้
    read: () => true, // Public read - ให้ทุกคนดูรูปได้ (ตามมาตรฐาน CMS)
    update: authenticated, // เฉพาะ Admin แก้ไขได้
  },
  admin: {
    useAsTitle: 'alt',
    group: 'สื่อ',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'คำอธิบายภาพ',
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          ]
        },
      }),
    },
  ],
  upload: {
    mimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    filesRequiredOnCreate: false,
    adminThumbnail: 'thumbnail',
    focalPoint: false,
    crop: false,
    formatOptions: {
      format: 'webp',
      options: {
        quality: 80,
      },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        formatOptions: {
          format: 'webp',
          options: {
            quality: 80,
          },
        },
      },
      {
        name: 'card',
        width: 768,
        height: 576,
        formatOptions: {
          format: 'webp',
          options: {
            quality: 80,
          },
        },
      },
      {
        name: 'feature',
        width: 1024,
        height: 768,
        formatOptions: {
          format: 'webp',
          options: {
            quality: 80,
          },
        },
      },
    ],
    resizeOptions: {
      width: 1920,
      height: 1080,
      fit: 'inside',
      withoutEnlargement: true,
    },
  },
}
