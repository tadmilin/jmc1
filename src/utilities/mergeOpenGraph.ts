import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'
import { getCachedGlobal } from './getGlobals'

// Helper function to get image URL from media object
const getImageURL = (image: any) => {
  if (!image) return null
  if (typeof image === 'string') return image
  if (typeof image === 'object' && image.url) {
    // ถ้า URL เป็น absolute URL แล้ว ใช้เลย
    if (image.url.startsWith('http')) {
      return image.url
    }
    // ถ้าเป็น relative URL ให้เพิ่ม server URL
    return `${getServerSideURL()}${image.url}`
  }
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
    
    console.log('🔍 Site Settings loaded:', {
      exists: !!siteSettings,
      siteName: siteSettings?.siteName,
      hasOgImage: !!siteSettings?.ogImage,
      ogImageType: typeof siteSettings?.ogImage,
      ogImageUrl: siteSettings?.ogImage?.url
    })
    
    if (siteSettings) {
      const siteName = siteSettings.siteName || defaultOpenGraph.siteName
      const siteTagline = siteSettings.siteTagline || 'ท่อ PVC ข้อต่อ ปั๊มน้ำ และอุปกรณ์ประปา'
      const siteDescription = siteSettings.siteDescription || defaultOpenGraph.description
      
      const ogImageUrl = getImageURL(siteSettings.ogImage)
      
      console.log('🖼️ OG Image URL processed:', ogImageUrl)
      
      defaultOpenGraph = {
        type: 'website',
        description: siteDescription,
        images: ogImageUrl ? [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${siteName} - ${siteTagline}`,
          },
        ] : defaultOpenGraph.images,
        siteName: siteName,
        title: siteTagline ? `${siteName} - ${siteTagline}` : siteName,
      }
      
      console.log('✅ Final OG config:', {
        title: defaultOpenGraph.title,
        description: defaultOpenGraph.description,
        imageUrl: defaultOpenGraph.images?.[0]?.url
      })
    } else {
      console.log('⚠️ No site settings found, using defaults')
    }
  } catch (error) {
    console.error('❌ Failed to load site settings for Open Graph:', error)
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
