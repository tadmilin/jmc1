import { Block } from 'payload';

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';

export const RelatedPostsBlock: Block = {
  slug: 'relatedPosts',
  interfaceName: 'RelatedPostsBlock',
  labels: {
    singular: 'Related Posts',
    plural: 'Related Posts',
  },
  fields: [
    {
      name: 'introContent',
      type: 'richText',
      label: 'Intro Content',
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
    },
    {
      name: 'docs',
      type: 'relationship',
      label: 'Posts to Show',
      relationTo: 'posts',
      hasMany: true,
      required: true,
    },
  ],
}; 