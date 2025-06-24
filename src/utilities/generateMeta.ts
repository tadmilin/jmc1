import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { getCachedGlobal } from './getGlobals'

// Helper function to get image URL from media object
const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null, fallbackUrl?: string) => {
  const serverUrl = getServerSideURL()

  let url = fallbackUrl || serverUrl + '/jmc-og-image.svg'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = (image as any).sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  // Default fallback values
  let defaultTitle = 'JMC Company - ท่อ PVC ข้อต่อ ปั๊มน้ำ และอุปกรณ์ประปา'
  let defaultDescription = 'บริษัท เจเอ็มซี จำกัด ผู้จำหน่ายท่อ PVC ข้อต่อ ปั๊มน้ำ และอุปกรณ์ประปาคุณภาพสูง ราคาย่อมเยา'
  let defaultSiteName = 'JMC Company'
  let defaultOgImageUrl = getServerSideURL() + '/jmc-og-image.svg'

  try {
    // Try to get site settings from database
    const siteSettings = await getCachedGlobal('site-settings', 2)()
    
    if (siteSettings) {
      defaultSiteName = siteSettings.siteName || defaultSiteName
      const siteTagline = siteSettings.siteTagline
      defaultDescription = siteSettings.siteDescription || defaultDescription
      
      if (siteTagline) {
        defaultTitle = `${defaultSiteName} - ${siteTagline}`
      } else {
        defaultTitle = defaultSiteName
      }
      
      // Get OG image from site settings
      if (siteSettings.ogImage) {
        defaultOgImageUrl = getImageURL(siteSettings.ogImage, defaultOgImageUrl)
      }
    }
  } catch (error) {
    console.warn('Failed to load site settings for meta generation, using defaults:', error)
  }

  const ogImage = getImageURL(doc?.meta?.image, defaultOgImageUrl)

  const title = doc?.meta?.title
    ? doc?.meta?.title + ` | ${defaultSiteName}`
    : defaultTitle

  return {
    description: doc?.meta?.description || defaultDescription,
    openGraph: await mergeOpenGraph({
      description: doc?.meta?.description || defaultDescription,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: doc?.meta?.title || defaultTitle,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
