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
  line?: string
  facebook?: string
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

    if (finalUrl && finalUrl !== 'undefined') {
      // ถ้า URL เป็น absolute URL แล้ว ใช้เลย
      if (finalUrl.startsWith('http')) {
        url = finalUrl
      } else if (finalUrl.startsWith('media/')) {
        // PayloadCMS Blob Storage path - เพิ่ม / หน้า
        url = `${serverUrl}/${finalUrl}`
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
  _siteName?: string,
  pageType?: 'home' | 'page' | 'product' | 'category' | 'post',
  pageSlug?: string,
): string => {
  const businessName = 'จงมีชัยค้าวัสดุ'
  const localKeywords = 'ตลิ่งชัน ปากซอยชักพระ6'
  const primaryKeywords = 'วัสดุก่อสร้าง ใกล้ฉัน'

  // Special handling for contact page
  if (pageSlug === 'contactus-' || pageSlug === 'contact') {
    return pageTitle
      ? `${pageTitle} - ร้านวัสดุก่อสร้าง ตลิ่งชัน ปากซอยชักพระ6 ใกล้ฉัน | JMC`
      : 'ติดต่อเรา - ร้านวัสดุก่อสร้าง ตลิ่งชัน ปากซอยชักพระ6 ใกล้ฉัน | จงมีชัยค้าวัสดุ'
  }

  // Special handling for about page
  if (pageSlug === 'aboutus' || pageSlug === 'about') {
    return pageTitle
      ? `${pageTitle} - ร้านวัสดุก่อสร้าง ตลิ่งชัน ปากซอยชักพระ6 ใกล้ฉัน | JMC`
      : 'เกี่ยวกับเรา - ร้านวัสดุก่อสร้าง ตลิ่งชัน ปากซอยชักพระ6 ใกล้ฉัน | จงมีชัยค้าวัสดุ'
  }

  // Default titles optimized for Google 2025 - Multi-area targeting
  const defaultTitles = {
    home: `${businessName} ${localKeywords} อันดับ1 | ${primaryKeywords} ราคาถูกที่สุด ส่งฟรี ปิ่นเกล้า จรัญ บางขุนนนท์ บรม สวนผัก พระราม5 บางกรวย`,
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
  pageSlug?: string,
): string => {
  const baseDescription =
    'จงมีชัยค้าวัสดุ ตลิ่งชัน ปากซอยชักพระ6 ร้านวัสดุก่อสร้างครบวงจร ราคาถูก ส่งด่วนถึงไซต์งาน'
  const semanticKeywords = 'อิฐ หิน ปูน ทราย เหล็ก ประปา ไฟฟ้า ช่าง ครบจบที่เดียว'
  const trustSignals = 'บริการมืออาชีพ รับประกันคุณภาพ'

  // Special handling for contact page
  if (pageSlug === 'contactus-' || pageSlug === 'contact') {
    return (
      pageDescription ||
      'ติดต่อร้านวัสดุก่อสร้าง จงมีชัยค้าวัสดุ ตลิ่งชัน ปากซอยชักพระ6 โทร 02-434-8319 เปิด จ-ส 07:00-17:00 น. ดูแผนที่ร้าน ข้อมูลติดต่อครบถ้วน'
    )
  }

  // Special handling for about page
  if (pageSlug === 'aboutus' || pageSlug === 'about') {
    return (
      pageDescription ||
      'เกี่ยวกับจงมีชัยค้าวัสดุ ก่อตั้งปี 2020 ร้านวัสดุก่อสร้างครบวงจร ตลิ่งชัน ปากซอยชักพระ6 ให้บริการชุมชน มีประสบการณ์กว่า 35 ปี ราคาถูก คุณภาพเยี่ยม'
    )
  }

  if (pageDescription) {
    // เพิ่ม local keywords และ trust signals
    return `${pageDescription} ${baseDescription} ${trustSignals}`
  }

  const defaultDescriptions = {
    home: `🏆 ร้านวัสดุก่อสร้าง อันดับ1 ${baseDescription} ส่งฟรี ปิ่นเกล้า จรัญ บางขุนนนท์ บรม สวนผัก พระราม5 บางกรวย ${semanticKeywords} ${trustSignals} โทร 02-434-8319`,
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
    'วัสดุก่อสร้างใกล้ฉัน ตลิ่งชัน',
    'วัสดุก่อสร้างใกล้ฉัน ชักพระ',
    'วัสดุก่อสร้างใกล้ฉัน บางขุนนนท์',
    'วัสดุก่อสร้างใกล้ฉัน จรัญสนิทวงศ์',
    'วัสดุก่อสร้างใกล้ฉัน ปิ่นเกล้า',
    'วัสดุก่อสร้างใกล้ฉัน พระราม5',
    'วัสดุก่อสร้างใกล้ฉัน บางกรวย',
    'วัสดุก่อสร้างใกล้ฉัน สวนผัก',
    'วัสดุก่อสร้างปิ่นเกล้า',
    'วัสดุก่อสร้าง ปิ่นเกล้า',
    'วัสดุก่อสร้างจรัญ',
    'วัสดุก่อสร้าง จรัญ',
    'วัสดุก่อสร้างบางขุนนนท์',
    'วัสดุก่อสร้าง บางขุนนนท์',
    'วัสดุก่อสร้างสวนผัก',
    'วัสดุก่อสร้าง สวนผัก',
    'วัสดุก่อสร้างพระราม5',
    'วัสดุก่อสร้าง พระราม5',
    'วัสดุก่อสร้างบางกรวย',
    'วัสดุก่อสร้าง บางกรวย',
    'ร้านวัสดุก่อสร้างปิ่นเกล้า',
    'ร้านวัสดุก่อสร้างจรัญ',
    'ร้านวัสดุก่อสร้างบางขุนนนท์',
    'ร้านวัสดุก่อสร้างบรม',
    'ร้านวัสดุก่อสร้างสวนผัก',
    'ร้านวัสดุก่อสร้างพระราม5',
    'ร้านวัสดุก่อสร้างบางกรวย',
    'วัสดุก่อสร้าง เขตตลิ่งชัน',
    'วัสดุก่อสร้าง เขตปิ่นเกล้า',
    'วัสดุก่อสร้าง เขตบางขุนนนท์',
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

  // Default fallback values optimized for Google Algorithm 2025 - Multi-area targeting
  let defaultSiteName = 'จงมีชัยค้าวัสดุ'
  let defaultKeywords =
    'วัสดุก่อสร้าง, ตลิ่งชัน, ใกล้ฉัน, ปากซอยชักพระ6, จงมีชัยค้าวัสดุ, ปิ่นเกล้า, จรัญ, บางขุนนนท์, บรม, สวนผัก, พระราม5, บางกรวย'
  let defaultOgImageUrl = getServerSideURL() + '/jmc-og-image.svg'
  let siteSettings: SiteSettings | null = null

  try {
    // Try to get site settings from database
    const payload = await getPayload({ config: configPromise })
    // Get site-settings global - suppress type warning
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (payload as any).findGlobal({
      slug: 'site-settings',
      depth: 1,
    })

    siteSettings = result as SiteSettings

    if (process.env.NODE_ENV === 'development') {
      console.log('📋 Generate Meta - Site Settings:', {
        exists: !!siteSettings,
        siteName: siteSettings?.siteName,
        hasOgImage: !!siteSettings?.ogImage,
      })
    }

    if (siteSettings) {
      defaultSiteName = siteSettings.siteName || defaultSiteName
      defaultKeywords = siteSettings.siteKeywords || defaultKeywords

      // Get OG image from site settings
      if (siteSettings.ogImage) {
        defaultOgImageUrl = getImageURL(siteSettings.ogImage, defaultOgImageUrl)
        if (process.env.NODE_ENV === 'development') {
          console.log('🎯 Using OG image from settings:', defaultOgImageUrl)
        }
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Failed to load site settings for meta generation:', error)
    }
  }

  // Extract page slug for specific page handling
  const pageSlug = Array.isArray(doc?.slug) ? doc.slug.join('/') : doc?.slug

  // Google Algorithm 2025 optimized meta generation with local SEO
  const optimizedTitle = generateOptimizedTitle(
    doc?.meta?.title || undefined,
    defaultSiteName,
    pageType,
    pageSlug || undefined,
  )

  const optimizedDescription = generateOptimizedDescription(
    doc?.meta?.description || undefined,
    pageType,
    doc?.meta?.title || (typeof doc?.title === 'string' ? doc.title : undefined),
    pageSlug || undefined,
  )

  const optimizedKeywords = generateKeywords(
    defaultKeywords,
    pageType,
    doc?.meta?.title || (typeof doc?.title === 'string' ? doc.title : undefined),
  )

  const ogImage = getImageURL(doc?.meta?.image, defaultOgImageUrl)

  // สร้าง array ของรูปภาพสำหรับ Open Graph และ Google Images
  const allImages: Array<{
    url: string
    width: number
    height: number
    alt: string
    type: string
  }> = []

  // เพิ่มรูปหลัก
  if (ogImage) {
    allImages.push({
      url: ogImage,
      width: 1200,
      height: 630,
      alt: doc?.meta?.title || optimizedTitle,
      type: 'image/jpeg',
    })
  }

  // เพิ่มรูปเพิ่มเติมจาก meta.images
  if (doc?.meta && 'images' in doc.meta && Array.isArray(doc.meta.images)) {
    doc.meta.images.forEach((image: Media | string | null, index: number) => {
      if (image && typeof image === 'object') {
        const imageUrl = getImageURL(image, undefined)
        if (imageUrl && imageUrl !== ogImage) {
          // หลีกเลี่ยงรูปซ้ำ
          allImages.push({
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${doc?.meta?.title || optimizedTitle} - รูปที่ ${index + 2}`,
            type: 'image/jpeg',
          })
        }
      }
    })
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('🎯 Google Algorithm 2025 Optimized Meta:', {
      title: optimizedTitle,
      description: optimizedDescription,
      keywords: optimizedKeywords,
      pageType,
      ogImage,
    })
  }

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
      images: allImages.length > 0 ? allImages : undefined,
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
      images: allImages.length > 0 ? allImages.map((img) => img.url) : undefined,
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
      'geo.position': '13.780839074740534;100.4622982337261',
      ICBM: '13.780839074740534, 100.4622982337261',
      // Local Business Schema signals
      'business-type': 'construction materials store',
      'business-hours': siteSettings?.businessHours || 'Mo-Sat 07:00-17:00',
      'serves-location': 'ตลิ่งชัน, กรุงเทพมหานคร, ประเทศไทย',
    },
  }
}
