import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'
import { getCachedGlobal } from './getGlobals'

// Helper function to get image URL from media object
const getImageURL = (image: any) => {
  if (!image) return null
  if (typeof image === 'string') return image
  if (typeof image === 'object' && image.url) return image.url
  return null
}

// Default fallback values
const getDefaultOpenGraph = () => ({
  type: 'website' as const,
  description: 'บริษัท เจเอ็มซี จำกัด ผู้จำหน่ายท่อ PVC ข้อต่อ ปั๊มน้ำ และอุปกรณ์ประปาคุณภาพสูง ราคาย่อมเยา',
  images: [
    {
      url: `${getServerSideURL()}/jmc-og-image.svg`,
      width: 1200,
      height: 630,
      alt: 'JMC Company - ท่อ PVC ข้อต่อ ปั๊มน้ำ และอุปกรณ์ประปา',
    },
  ],
  siteName: 'JMC Company',
  title: 'JMC Company - ท่อ PVC ข้อต่อ ปั๊มน้ำ และอุปกรณ์ประปา',
})

export const mergeOpenGraph = async (og?: Metadata['openGraph']): Promise<Metadata['openGraph']> => {
  let defaultOpenGraph = getDefaultOpenGraph()
  
  try {
    // Try to get site settings from database
    const siteSettings = await getCachedGlobal('site-settings', 2)()
    
    if (siteSettings) {
      const siteName = siteSettings.siteName || defaultOpenGraph.siteName
      const siteTagline = siteSettings.siteTagline || 'ท่อ PVC ข้อต่อ ปั๊มน้ำ และอุปกรณ์ประปา'
      const siteDescription = siteSettings.siteDescription || defaultOpenGraph.description
      
      const ogImageUrl = getImageURL(siteSettings.ogImage)
      
      defaultOpenGraph = {
        type: 'website',
        description: siteDescription,
        images: ogImageUrl ? [
          {
            url: ogImageUrl.startsWith('http') ? ogImageUrl : `${getServerSideURL()}${ogImageUrl}`,
            width: 1200,
            height: 630,
            alt: `${siteName} - ${siteTagline}`,
          },
        ] : defaultOpenGraph.images,
        siteName: siteName,
        title: siteTagline ? `${siteName} - ${siteTagline}` : siteName,
      }
    }
  } catch (error) {
    console.warn('Failed to load site settings for Open Graph, using defaults:', error)
  }

  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}

// Synchronous version for backwards compatibility
export const mergeOpenGraphSync = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  const defaultOpenGraph = getDefaultOpenGraph()
  
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
