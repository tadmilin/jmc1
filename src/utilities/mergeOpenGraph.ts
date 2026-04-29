import type { Metadata } from 'next'

import type { Media } from '../payload-types'

import { getServerSideURL } from './getURL'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Type for site settings
interface SiteSettings {
  siteName?: string
  siteTagline?: string
  siteDescription?: string
  ogImage?: Media | string
}

// Helper function to get image URL from media object
const getImageURL = (image?: Media | string | null, fallbackUrl?: string): string => {
  if (!image) return fallbackUrl || getServerSideURL() + '/jmc-og-image.svg'

  if (typeof image === 'string') return image

  if (typeof image === 'object' && 'url' in image && image.url) {
    return image.url.startsWith('http') ? image.url : getServerSideURL() + image.url
  }

  return fallbackUrl || getServerSideURL() + '/jmc-og-image.svg'
}

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'บริษัท เจเอ็มซี จำกัด ผู้จำหน่ายท่อ PVC ข้อต่อ ปั๊มน้ำ และอุปกรณ์ประปาคุณภาพสูง ราคาย่อมเยา',
  images: [
    {
      url: getServerSideURL() + '/jmc-og-image.svg',
      width: 1200,
      height: 630,
      alt: 'JMC Company - ท่อ PVC ข้อต่อ ปั๊มน้ำ และอุปกรณ์ประปา',
    },
  ],
  siteName: 'JMC Company',
  title: 'JMC Company - ท่อ PVC ข้อต่อ ปั๊มน้ำ และอุปกรณ์ประปา',
}

export const mergeOpenGraph = async (
  og?: Metadata['openGraph'],
): Promise<Metadata['openGraph']> => {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.findGlobal({
      slug: 'site-settings' as unknown as 'header',
      depth: 1,
    })

    const siteSettings = result as SiteSettings

    if (siteSettings) {
      const siteName = siteSettings.siteName || defaultOpenGraph.siteName
      const siteTagline = siteSettings.siteTagline || 'ท่อ PVC ข้อต่อ ปั๊มน้ำ และอุปกรณ์ประปา'
      const siteDescription = siteSettings.siteDescription || defaultOpenGraph.description

      const ogImageUrl = getImageURL(siteSettings.ogImage)

      return {
        ...defaultOpenGraph,
        ...og,
        siteName,
        title: og?.title || `${siteName} - ${siteTagline}`,
        description: og?.description || siteDescription,
        images: og?.images || [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: (og?.title || `${siteName} - ${siteTagline}`) as string,
          },
        ],
      }
    }
  } catch (error) {
    console.error('❌ Failed to load site settings for OpenGraph:', error)
  }

  return {
    ...defaultOpenGraph,
    ...og,
  }
}

export const mergeOpenGraphSync = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
  }
}
