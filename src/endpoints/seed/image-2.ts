import type { Media } from '@/payload-types'

export const image2: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: 'Curving abstract shapes with an orange and blue gradient',
  caption: {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'This is a caption for the image.',
              version: 1,
              format: 0,
              detail: 0,
              mode: 'normal',
              style: '',
            },
          ],
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  },
  url: '/images/image-2.jpg',
  filename: 'image-2.jpg',
  mimeType: 'image/jpeg',
  filesize: 1024,
  width: 800,
  height: 600,
  sizes: {
    thumbnail: {
      url: '/images/image-2-thumbnail.jpg',
      width: 100,
      height: 75,
      mimeType: 'image/jpeg',
      filesize: 256,
      filename: 'image-2-thumbnail.jpg'
    },
    og: {
      url: '/images/image-2-og.jpg',
      width: 1200,
      height: 630,
      mimeType: 'image/jpeg',
      filesize: 2048,
      filename: 'image-2-og.jpg'
    }
  }
}
