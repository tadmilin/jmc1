import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Type for site settings
interface SiteSettings {
  siteName?: string
  siteTagline?: string
  siteDescription?: string
  siteKeywords?: string
  ogImage?: Media | string
  companyName?: string
  address?: string
  phone?: string
  email?: string
  businessHours?: string
}

// Extended Media type with sizes
interface MediaWithSizes extends Media {
  sizes?: {
    feature?: {
      url: string
      width?: number
      height?: number
    }
    card?: {
      url: string
      width?: number
      height?: number
    }
    thumbnail?: {
      url: string
      width?: number
      height?: number
    }
  }
}

// Helper function to get image URL from media object
const getImageURL = (
  image?: Media | Config['db']['defaultIDType'] | null,
  fallbackUrl?: string,
) => {
  const serverUrl = getServerSideURL()

  let url = fallbackUrl || serverUrl + '/jmc-og-image.svg'

  if (image && typeof image === 'object' && 'url' in image) {
    // ใช้ feature size ถ้ามี (1024x768) หรือ card size (768x576) สำหรับ OG
    const mediaWithSizes = image as MediaWithSizes
    const featureUrl = mediaWithSizes.sizes?.feature?.url
    const cardUrl = mediaWithSizes.sizes?.card?.url
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

// Google Algorithm 2025 - Enhanced title generation with local keywords
const generateOptimizedTitle = (
  pageTitle?: string,
  siteName?: string,
  pageType?: 'home' | 'page' | 'product' | 'category' | 'post',
  slug?: string | string[],
): string => {
  const businessName = 'จงมีชัยค้าวัสดุ'
  const localKeywords = 'ตลิ่งชัน ปากซอยชักพระ6'
  const primaryKeywords = 'วัสดุก่อสร้าง ใกล้ฉัน'

  // Default titles optimized for Google 2025
  const defaultTitles = {
    home: `${businessName} ${localKeywords} | ${primaryKeywords} ราคาถูก ส่งด่วน`,
    page: pageTitle
      ? `${pageTitle} | ${businessName} ${localKeywords}`
      : `${businessName} ${localKeywords}`,
    product: pageTitle
      ? `${pageTitle} | ${businessName} ${localKeywords} ราคาดี`
      : `สินค้า ${businessName}`,
    category: pageTitle
      ? `หมวด${pageTitle} | ${businessName} ${localKeywords}`
      : `หมวดสินค้า ${businessName}`,
    post: pageTitle ? `${pageTitle} | บทความ ${businessName}` : `บทความ ${businessName}`,
  }

  if (pageTitle) {
    return defaultTitles[pageType || 'page']
  }

  return defaultTitles[pageType || 'home']
}

// Google Algorithm 2025 - Enhanced description with semantic keywords
const generateOptimizedDescription = (
  pageDescription?: string,
  pageType?: 'home' | 'page' | 'product' | 'category' | 'post',
  pageTitle?: string,
): string => {
  const baseDescription =
    'จงมีชัยค้าวัสดุ ตลิ่งชัน ปากซอยชักพระ6 ร้านวัสดุก่อสร้างครบวงจร ราคาถูก ส่งด่วนถึงไซต์งาน'
  const semanticKeywords = 'อิฐ หิน ปูน ทราย เหล็ก ประปา ไฟฟ้า ช่าง ครบจบที่เดียว'
  const trustSignals = 'บริการมืออาชีพ รับประกันคุณภาพ'

  if (pageDescription) {
    // เพิ่ม local keywords และ trust signals
    return `${pageDescription} ${baseDescription} ${trustSignals}`
  }

  const defaultDescriptions = {
    home: `${baseDescription} ${semanticKeywords} ${trustSignals}`,
    page: `${pageTitle ? pageTitle + ' - ' : ''}${baseDescription} ${trustSignals}`,
    product: `${pageTitle ? pageTitle + ' คุณภาพสูง - ' : ''}${baseDescription} ${trustSignals}`,
    category: `${pageTitle ? 'สินค้า' + pageTitle + ' - ' : ''}${baseDescription} ${semanticKeywords}`,
    post: `${pageTitle ? pageTitle + ' - ' : ''}เทคนิคและความรู้ ${baseDescription}`,
  }

  return defaultDescriptions[pageType || 'home']
}

// Google Algorithm 2025 - Generate keywords with semantic search support
const generateKeywords = (
  siteKeywords?: string,
  pageType?: 'home' | 'page' | 'product' | 'category' | 'post',
  pageTitle?: string,
): string => {
  const coreKeywords = ['วัสดุก่อสร้าง', 'ตลิ่งชัน', 'ใกล้ฉัน', 'ปากซอยชักพระ6', 'จงมีชัยค้าวัสดุ']

  const semanticKeywords = [
    'อิฐ หิน ปูน ทราย',
    'เหล็ก ประปา ไฟฟ้า',
    'ร้านวัสดุก่อสร้าง',
    'ราคาถูก ส่งด่วน',
    'ครบวงจร',
  ]

  const localKeywords = [
    'ตลิ่งชัน กรุงเทพ',
    'ชักพระ ตลิ่งชัน',
    'วัสดุก่อสร้าง ใกล้ฉัน',
    'ส่งวัสดุ ตลิ่งชัน',
  ]

  const keywords = [...coreKeywords, ...semanticKeywords, ...localKeywords]

  if (siteKeywords) {
    keywords.unshift(...siteKeywords.split(',').map((k) => k.trim()))
  }

  if (pageTitle && pageType !== 'home') {
    keywords.unshift(pageTitle)
  }

  return keywords.join(', ')
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  pageType?: 'home' | 'page' | 'product' | 'category' | 'post'
}): Promise<Metadata> => {
  const { doc, pageType = 'page' } = args

  // Default fallback values optimized for Google Algorithm 2025
  const defaultTitle = 'จงมีชัยค้าวัสดุ ตลิ่งชัน วัสดุก่อสร้างครบวงจร ปากซอยชักพระ6 ใกล้ฉัน'
  let defaultDescription =
    'จงมีชัยค้าวัสดุ ตลิ่งชัน ปากซอยชักพระ6 ร้านวัสดุก่อสร้างครบวงจร ราคาถูก ส่งด่วนถึงไซต์งาน อิฐ หิน ปูน ทราย เหล็ก ประปา ไฟฟ้า ช่าง ครบจบที่เดียว บริการมืออาชีพ รับประกันคุณภาพ'
  let defaultSiteName = 'จงมีชัยค้าวัสดุ'
  let defaultKeywords = 'วัสดุก่อสร้าง, ตลิ่งชัน, ใกล้ฉัน, ปากซอยชักพระ6, จงมีชัยค้าวัสดุ'
  let defaultOgImageUrl = getServerSideURL() + '/jmc-og-image.svg'
  let siteSettings: SiteSettings | null = null

  try {
    // Try to get site settings from database
    const payload = await getPayload({ config: configPromise })
    // Type assertion for site-settings global slug
    const result = await payload.findGlobal({
      slug: 'site-settings' as any,
      depth: 1,
    })

    siteSettings = result as SiteSettings

    console.log('📋 Generate Meta - Site Settings:', {
      exists: !!siteSettings,
      siteName: siteSettings?.siteName,
      hasOgImage: !!siteSettings?.ogImage,
    })

    if (siteSettings) {
      defaultSiteName = siteSettings.siteName || defaultSiteName
      defaultDescription = siteSettings.siteDescription || defaultDescription
      defaultKeywords = siteSettings.siteKeywords || defaultKeywords

      // Get OG image from site settings
      if (siteSettings.ogImage) {
        defaultOgImageUrl = getImageURL(siteSettings.ogImage, defaultOgImageUrl)
        console.log('🎯 Using OG image from settings:', defaultOgImageUrl)
      }
    }
  } catch (error) {
    console.error('❌ Failed to load site settings for meta generation:', error)
  }

  // Google Algorithm 2025 optimized meta generation
  const optimizedTitle = generateOptimizedTitle(
    doc?.meta?.title || undefined,
    defaultSiteName,
    pageType,
    doc?.slug || undefined,
  )

  const optimizedDescription = generateOptimizedDescription(
    doc?.meta?.description || undefined,
    pageType,
    doc?.meta?.title || doc?.title || undefined,
  )

  const optimizedKeywords = generateKeywords(
    defaultKeywords,
    pageType,
    doc?.meta?.title || doc?.title,
  )

  const ogImage = getImageURL(doc?.meta?.image, defaultOgImageUrl)

  console.log('🎯 Google Algorithm 2025 Optimized Meta:', {
    title: optimizedTitle,
    description: optimizedDescription,
    keywords: optimizedKeywords,
    pageType,
    ogImage,
  })

  // Generate canonical URL
  const canonicalUrl = Array.isArray(doc?.slug)
    ? `${getServerSideURL()}/${doc?.slug.join('/')}`
    : doc?.slug
      ? `${getServerSideURL()}/${doc.slug}`
      : getServerSideURL()

  return {
    title: optimizedTitle,
    description: optimizedDescription,
    keywords: optimizedKeywords,
    authors: [{ name: defaultSiteName }],
    creator: defaultSiteName,
    publisher: defaultSiteName,
    formatDetection: {
      telephone: true,
      address: true,
      email: true,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'google99f65fca623e2661',
    },
    openGraph: await mergeOpenGraph({
      title: optimizedTitle,
      description: optimizedDescription,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: doc?.meta?.title || optimizedTitle,
              type: 'image/jpeg',
            },
          ]
        : undefined,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : doc?.slug || '/',
      siteName: defaultSiteName,
      locale: 'th_TH',
      type: pageType === 'post' ? 'article' : 'website',
      // Facebook Algorithm 2025 - Enhanced Open Graph
      ...(siteSettings?.companyName && {
        'business:contact_data:street_address': siteSettings.address,
        'business:contact_data:locality': 'ตลิ่งชัน',
        'business:contact_data:region': 'กรุงเทพมหานคร',
        'business:contact_data:postal_code': '10170',
        'business:contact_data:country_name': 'ประเทศไทย',
        'business:contact_data:phone_number': siteSettings.phone,
        'business:contact_data:email': siteSettings.email,
      }),
    }),
    // Google Algorithm 2025 - Enhanced Twitter Cards
    twitter: {
      card: 'summary_large_image',
      title: optimizedTitle,
      description: optimizedDescription,
      images: ogImage ? [ogImage] : undefined,
      creator: '@jmccompany',
      site: '@jmccompany',
    },
    // Google Algorithm 2025 - App Links for mobile optimization
    appLinks: {
      web: {
        url: canonicalUrl,
        should_fallback: true,
      },
    },
    // Additional meta for Google Algorithm 2025
    other: {
      'google-site-verification': 'google99f65fca623e2661',
      'format-detection': 'telephone=yes',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'theme-color': '#ffffff',
      'msapplication-navbutton-color': '#ffffff',
      'apple-mobile-web-app-title': defaultSiteName,
      'application-name': defaultSiteName,
      'geo.region': 'TH-10',
      'geo.placename': 'ตลิ่งชัน, กรุงเทพมหานคร',
      'geo.position': '13.7563;100.5018',
      ICBM: '13.7563, 100.5018',
      // Local Business Schema signals
      'business-type': 'construction materials store',
      'business-hours': siteSettings?.businessHours || 'Mo-Sat 07:00-17:00',
      'serves-location': 'ตลิ่งชัน, กรุงเทพมหานคร, ประเทศไทย',
    },
  }
}
