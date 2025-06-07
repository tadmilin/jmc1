import type { Metadata } from 'next'
import type { Media } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | string | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'
  if (image && typeof image === 'object' && 'url' in image) {
    url = serverUrl + image.url
  }

  return url
}

export const generateMeta = (args: {
  title?: string | null
  description?: string | null
  image?: Media | string | null
}): Metadata => {
  const { title, description, image } = args

  const serverUrl = getServerSideURL()

  const ogImage = getImageURL(image)

  const titleText = title
    ? title + ' | Payload Website Template'
    : 'Payload Website Template'

  return {
    description,
    openGraph: mergeOpenGraph({
      description: description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title: titleText,
      url: '/',
    }),
    title: titleText,
  }
}
