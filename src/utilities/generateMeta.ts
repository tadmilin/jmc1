import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { getCachedGlobal } from './getGlobals'

// Helper function to get image URL from media object
const getImageURL = (
  image?: Media | Config['db']['defaultIDType'] | null,
  fallbackUrl?: string,
) => {
  const serverUrl = getServerSideURL()

  let url = fallbackUrl || serverUrl + '/jmc-og-image.svg'

  if (image && typeof image === 'object' && 'url' in image) {
    // ใช้ feature size ถ้ามี (1024x768) หรือ card size (768x576) สำหรับ OG
    const featureUrl = (image as any).sizes?.feature?.url
    const cardUrl = (image as any).sizes?.card?.url
    const originalUrl = image.url

    let finalUrl = null

    if (featureUrl) {
      finalUrl = featureUrl
    } else if (cardUrl) {
      finalUrl = cardUrl
    } else if (originalUrl) {
      finalUrl = originalUrl
    }

    if (finalUrl) {
      // ถ้า URL เป็น absolute URL แล้ว ใช้เลย
      if (finalUrl.startsWith('http')) {
        url = finalUrl
      } else {
        // ถ้าเป็น relative URL ให้เพิ่ม server URL (อย่าลืมลบ slash ซ้ำ)
        const cleanUrl = finalUrl.startsWith('/') ? finalUrl : `/${finalUrl}`
        url = `${serverUrl}${cleanUrl}`
      }
    }

    console.log('🖼️ Image URL processed:', {
      hasFeature: !!featureUrl,
      hasCard: !!cardUrl,
      hasOriginal: !!originalUrl,
      finalUrl: url,
    })
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  // Default fallback values
  let defaultTitle = 'JMC Company - ท่อ PVC ข้อต่อ ปั๊มน้ำ และอุปกรณ์ประปา'
  let defaultDescription =
    'บริษัท เจเอ็มซี จำกัด ผู้จำหน่ายท่อ PVC ข้อต่อ ปั๊มน้ำ และอุปกรณ์ประปาคุณภาพสูง ราคาย่อมเยา'
  let defaultSiteName = 'JMC Company'
  let defaultOgImageUrl = getServerSideURL() + '/jmc-og-image.svg'

  try {
    // Try to get site settings from database
    const siteSettings = await getCachedGlobal('site-settings', 2)()

    console.log('📋 Generate Meta - Site Settings:', {
      exists: !!siteSettings,
      siteName: siteSettings?.siteName,
      hasOgImage: !!siteSettings?.ogImage,
    })

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
        console.log('🎯 Using OG image from settings:', defaultOgImageUrl)
      }
    }
  } catch (error) {
    console.error('❌ Failed to load site settings for meta generation:', error)
  }

  const ogImage = getImageURL(doc?.meta?.image, defaultOgImageUrl)

  const title = doc?.meta?.title ? doc?.meta?.title + ` | ${defaultSiteName}` : defaultTitle

  console.log('🏁 Final Meta:', {
    title,
    description: doc?.meta?.description || defaultDescription,
    ogImage,
  })

  const canonicalUrl = Array.isArray(doc?.slug)
    ? `${getServerSideURL()}/${doc?.slug.join('/')}`
    : getServerSideURL()

  return {
    description: doc?.meta?.description || defaultDescription,
    alternates: {
      canonical: canonicalUrl,
    },
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
