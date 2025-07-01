'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import type {
  Page,
  Category,
  Media as MediaType,
  Post /*HeroBlock, Link as LinkType*/,
} from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { useHeaderTheme } from '@/providers/HeaderTheme'

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

// Adjusted CustomLinkType to better match CMSLinkType from @/components/Link
interface CustomLinkType {
  type?: 'reference' | 'custom' | null
  label?: string | null
  url?: string | null
  reference?: {
    relationTo: 'pages' | 'posts' | string // Allow string for flexibility from linkGroup
    value: string | number | Page | Post | { id: string; slug?: string; [key: string]: unknown } // More aligned with common object structure
  } | null
  newTab?: boolean | null
}

// Updated HeroActionSlot interface
interface HeroActionSlot {
  id: string
  icon: MediaType | string
  title: string
  description?: string
  slotLink: Array<{ link: CustomLinkType; id: string }>
}

// Define specific block types for FramedContentRenderer
interface HeroContentTextBlock {
  blockType: 'heroContentText'
  text: DefaultTypedEditorState
  id?: string | null
}

interface HeroContentImageBlock {
  blockType: 'heroContentImage'
  image: MediaType
  caption?: string
  id?: string | null
}

interface HeroContentSpacerBlock {
  blockType: 'heroContentSpacer'
  height?: number
  id?: string | null
}

type SpecificHeroBlock = HeroContentTextBlock | HeroContentImageBlock | HeroContentSpacerBlock

const FramedContentRenderer: React.FC<{ blocks: SpecificHeroBlock[] | null | undefined }> = ({
  blocks,
}) => {
  if (!blocks || blocks.length === 0) return null

  return (
    <div className="bg-white bg-opacity-10 p-4 md:p-6 rounded-lg shadow-xl space-y-4 h-full overflow-y-auto">
      {blocks.map((block) => {
        const key = block.id || Math.random().toString() // Use block.id if available, otherwise fallback
        switch (block.blockType) {
          case 'heroContentText':
            return (
              <div key={key} className="prose prose-sm md:prose-base prose-invert">
                <RichText data={block.text} enableGutter={false} className="hero-content" />
              </div>
            )
          case 'heroContentImage':
            return (
              <div key={key} className="space-y-2">
                <Media resource={block.image} className="w-full h-auto rounded-md" />
                {block.caption && (
                  <p className="text-xs text-gray-400 text-center">{block.caption}</p>
                )}
              </div>
            )
          case 'heroContentSpacer':
            return <div key={key} style={{ height: `${block.height || 20}px` }} />
          default:
            // Handle cases where blockType doesn't match known types, or provide a fallback
            // This helps satisfy TypeScript's exhaustiveness check if `block` could be other types.
            return null
        }
      })}
    </div>
  )
}

// Component for Hero Action Slots (Updated for Fast Loading)
const HeroActionSlotsRenderer: React.FC<{
  slots: HeroActionSlot[] | null | undefined
  colorTheme?: string
}> = ({ slots, colorTheme }) => {
  // Debug: แสดงจำนวน slots ที่ได้รับจริง
  console.log('Hero Action Slots received:', slots?.length || 0, slots)

  if (!slots || slots.length === 0) return null

  const isDarkTheme = colorTheme === 'dark'
  const cardBgColor = isDarkTheme ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
  const titleColor = isDarkTheme ? 'text-white' : 'text-gray-900'
  const descColor = isDarkTheme ? 'text-gray-300' : 'text-gray-700'
  const cardBorderColor = isDarkTheme ? 'border-gray-700' : 'border-gray-200'

  // Helper function สำหรับ navigation ที่เร็วขึ้น
  const handleNavigation = (link: CustomLinkType) => {
    if (!link) return

    if (link.type === 'custom' && link.url) {
      if (link.newTab) {
        window.open(link.url, '_blank', 'noopener,noreferrer')
      } else {
        window.location.href = link.url
      }
    } else if (link.type === 'reference' && link.reference) {
      const { relationTo, value } = link.reference
      let url = ''

      if (typeof value === 'string') {
        url = `/${relationTo}/${value}`
      } else if (typeof value === 'object' && value.slug) {
        url = relationTo === 'pages' ? `/${value.slug}` : `/${relationTo}/${value.slug}`
      }

      if (url) {
        if (link.newTab) {
          window.open(url, '_blank', 'noopener,noreferrer')
        } else {
          window.location.href = url
        }
      }
    }
  }

  return (
    <div className="w-full pt-0 pb-2 md:pb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {slots.map((slot) => {
          // Handle the nested slotLink structure from payload
          const linkData = slot.slotLink && slot.slotLink.length > 0 ? slot.slotLink[0]?.link : null

          // Handle icon - check if it's an object with URL or just a string ID
          const hasValidIcon =
            slot.icon &&
            ((typeof slot.icon === 'object' && slot.icon.url) ||
              (typeof slot.icon === 'string' && slot.icon.length > 0))

          const isValidLink =
            linkData &&
            ((linkData.type === 'custom' && linkData.url) ||
              (linkData.type === 'reference' && linkData.reference?.value))

          const slotContent = (
            <div
              className={`flex items-center space-x-4 p-4 md:p-5 rounded-xl shadow-lg ${cardBgColor} border ${cardBorderColor} h-full ${isValidLink ? 'cursor-pointer' : ''}`}
              onClick={() => isValidLink && handleNavigation(linkData)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && isValidLink) {
                  e.preventDefault()
                  handleNavigation(linkData)
                }
              }}
              tabIndex={isValidLink ? 0 : -1}
              role={isValidLink ? 'button' : 'div'}
              aria-label={isValidLink ? `${slot.title} - ${slot.description || ''}` : undefined}
            >
              {hasValidIcon && (
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-gray-200 flex items-center justify-center p-1">
                  {typeof slot.icon === 'object' && slot.icon ? (
                    <div className="relative w-full h-full">
                      <Media
                        resource={slot.icon}
                        className="w-full h-full"
                        imgClassName="rounded-md object-contain w-full h-full"
                        priority={false}
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-white rounded-md flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              )}
              <div className="flex-grow">
                <h4 className={`font-semibold text-lg md:text-xl mb-1 ${titleColor}`}>
                  {slot.title}
                </h4>
                {slot.description && (
                  <p className={`text-sm md:text-base ${descColor} line-clamp-2`}>
                    {slot.description}
                  </p>
                )}
              </div>
              {isValidLink && (
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          )

          return (
            <div key={slot.id} className="h-full">
              {slotContent}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Interface for Social Media Button
interface SocialMediaButton {
  id: string
  label: string
  icon: MediaType | string
  url: string
  newTab?: boolean
}

export const HighImpactHero: React.FC<Page['hero']> = ({
  links,
  media,
  richText,
  colorTheme = 'light',
  layoutVariant = 'standard',
  showDecorations = true,
  featuredText,
  backgroundImage,
  slideImages,
  showCategoriesDropdown = true,
  categoriesLimit = 10,
  displayFrame,
  framedHeroContent,
  heroActionSlots,
  socialMediaButtons,
}) => {
  const { setHeaderTheme } = useHeaderTheme()
  const [currentSlide, setCurrentSlide] = useState(0)
  const hasSlideImages = Array.isArray(slideImages) && slideImages.length > 0
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  useEffect(() => {
    setHeaderTheme(colorTheme === 'dark' ? 'dark' : 'light')
  }, [colorTheme, setHeaderTheme])

  useEffect(() => {
    const fetchCategories = async () => {
      if (!showCategoriesDropdown) {
        setIsLoadingCategories(false)
        setCategories([])
        return
      }
      try {
        setIsLoadingCategories(true)
        const response = await fetch(
          `/api/categories?limit=${categoriesLimit}&depth=0&sort=displayOrder`,
        )

        if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลหมวดหมู่ได้')

        const data = await response.json()
        setCategories(data.docs || [])
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่:', error)
        setCategories([])
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [showCategoriesDropdown, categoriesLimit])

  // สร้างคลาสสำหรับพื้นหลังตามธีมสี
  const getBgClasses = () => {
    switch (colorTheme) {
      case 'dark':
        return 'bg-white text-gray-900'
      case 'lightBlue':
        return 'bg-white text-gray-900'
      case 'gradient':
        return 'bg-white text-gray-900'
      case 'light':
      default:
        return 'bg-white text-gray-900'
    }
  }

  // ตรวจสอบว่าควรสลับคอลัมน์หรือไม่
  const isCentered = layoutVariant === 'centered'

  // Main Slider/Media Component (to be placed in the center column, top)
  const MainMediaArea = () => {
    if (hasSlideImages) {
      return (
        <div className="relative rounded-xl overflow-hidden shadow-2xl w-full mb-2 aspect-video md:aspect-[16/9]">
          {slideImages.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              {slide.image && typeof slide.image === 'object' && (
                <Media
                  className="w-full h-full object-cover"
                  imgClassName="object-cover"
                  priority={index === 0}
                  resource={slide.image as MediaType}
                />
              )}
            </div>
          ))}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {slideImages.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full ${
                  index === currentSlide
                    ? (colorTheme === 'dark' ? 'bg-white' : 'bg-gray-800') + ' scale-110 shadow-md'
                    : colorTheme === 'dark'
                      ? 'bg-white/50'
                      : 'bg-gray-400'
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`ดูรูปที่ ${index + 1}`}
              />
            ))}
          </div>
          {showDecorations && featuredText && (
            <div
              className={`absolute -right-3 -bottom-3 py-2 px-4 rounded-md flex items-center justify-center text-white shadow-lg ${colorTheme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'}`}
            >
              <div className="text-center">
                <div className="text-sm font-bold">{featuredText}</div>
              </div>
            </div>
          )}
        </div>
      )
    } else if (media && typeof media === 'object') {
      return (
        <div className="relative rounded-xl overflow-hidden shadow-2xl w-full mb-2 aspect-video md:aspect-[16/9]">
          <Media
            className="w-full h-full object-cover"
            imgClassName="object-cover"
            priority
            resource={media as MediaType}
          />
          {showDecorations && featuredText && (
            <div
              className={`absolute -right-3 -bottom-3 py-2 px-4 rounded-md flex items-center justify-center text-white shadow-lg ${colorTheme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'}`}
            >
              <div className="text-center">
                <div className="text-sm font-bold">{featuredText}</div>
              </div>
            </div>
          )}
        </div>
      )
    }

    // Fallback: แสดงรูปภาพเริ่มต้นถ้าไม่มี media หรือ slideImages
    return (
      <div className="relative rounded-xl overflow-hidden shadow-2xl w-full mb-2 aspect-video md:aspect-[16/9] bg-gradient-to-br from-blue-600 to-indigo-600">
        <Image
          src="/jmc-og-image.svg"
          alt="จงมีชัยค้าวัสดุ - ร้านวัสดุก่อสร้าง ตลิ่งชัน"
          fill
          className="object-contain p-8"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-indigo-600/90 flex items-center justify-center">
          <div className="text-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">จงมีชัยค้าวัสดุ</h3>
            <p className="text-lg opacity-90">ร้านวัสดุก่อสร้าง ตลิ่งชัน ปากซอยชักพระ6</p>
          </div>
        </div>
      </div>
    )
  }

  // Reinstated CategoriesDropdown Component for the left sidebar
  const CategoriesDropdown = () => {
    if (!showCategoriesDropdown || isLoadingCategories || categories.length === 0) return null

    // สี/ธีม เพิ่มเติม
    const containerBg = 'bg-white'
    const borderColor = 'border-gray-200'
    const baseTextColor = 'text-black'

    return (
      <div
        className={`w-full max-w-sm ${containerBg} rounded-xl shadow-lg border ${borderColor} overflow-hidden`}
      >
        <div className={`px-4 py-3 bg-blue-50 border-b ${borderColor}`}>
          <h3 className={`text-lg font-semibold text-black flex items-center gap-2`}>
            <svg
              className="w-5 h-5 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14-4l-3 3.5a5 5 0 1 1-4 4L5 7l5 5L5 7z"
              />
            </svg>
            หมวดหมู่สินค้า
          </h3>
        </div>
        <div className={`max-h-80 overflow-y-auto`}>
          <ul className="divide-y divide-gray-100">
            {categories.map((category) => (
              <li key={category.id} className="group">
                <button
                  onClick={() => (window.location.href = `/categories/${category.slug}`)}
                  className={`flex items-center gap-3 px-4 py-3 ${baseTextColor} w-full text-left cursor-pointer`}
                >
                  {category.image && typeof category.image === 'object' && (
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 shadow-sm relative">
                      <Media
                        resource={category.image}
                        className="w-full h-full"
                        imgClassName="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-black">{category.title}</p>
                    {category.description && (
                      <p className="text-xs text-black truncate mt-0.5">{category.description}</p>
                    )}
                  </div>
                  <svg
                    className="w-4 h-4 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  // แยก Social Media Buttons เป็น component ต่างหาก
  const SocialMediaButtons = () => {
    if (!socialMediaButtons || socialMediaButtons.length === 0) return null

    // เปลี่ยนเป็นสีขาวเหมือน CategoriesDropdown
    const containerBg = 'bg-white'
    const borderColor = 'border-gray-200'

    return (
      <div
        className={`w-full max-w-sm ${containerBg} rounded-xl shadow-lg border ${borderColor} overflow-hidden mt-4`}
      >
        <div className={`px-4 py-3 bg-green-50 border-b ${borderColor}`}>
          <h3 className={`text-lg font-semibold text-gray-900 flex items-center gap-2`}>
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            ติดต่อเรา
          </h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {(socialMediaButtons as SocialMediaButton[]).map((button) => (
              <a
                key={button.id}
                href={button.url}
                target={button.newTab ? '_blank' : '_self'}
                rel={button.newTab ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-3 p-3 rounded-lg"
              >
                {button.icon && typeof button.icon === 'object' && (
                  <div className="w-8 h-8 flex-shrink-0 rounded-lg overflow-hidden shadow-sm relative">
                    <Media
                      resource={button.icon as MediaType}
                      className="w-full h-full"
                      imgClassName="rounded-lg object-contain w-full h-full"
                    />
                  </div>
                )}
                <span className="font-medium text-gray-900">{button.label}</span>
                <svg
                  className="w-4 h-4 text-gray-400 ml-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative ${isCentered ? 'min-h-[50vh]' : 'min-h-[60vh]'} flex flex-col justify-start ${getBgClasses()} overflow-hidden`}
      data-theme={colorTheme === 'dark' ? 'dark' : 'light'}
    >
      {backgroundImage && typeof backgroundImage === 'object' && (
        <div className="absolute inset-0 z-0">
          <Media
            resource={backgroundImage as MediaType}
            fill
            imgClassName={`object-cover ${colorTheme === 'dark' ? 'opacity-10' : 'opacity-20'}`}
            priority
          />
        </div>
      )}

      <div
        className={`container mx-auto px-4 md:px-6 pt-4 md:pt-6 pb-6 md:pb-8 lg:pb-10 z-3 relative w-full`}
      >
        {isCentered ? (
          <div className="text-center max-w-5xl mx-auto flex flex-col space-y-6 md:space-y-8">
            <MainMediaArea />
            <HeroActionSlotsRenderer
              slots={heroActionSlots as HeroActionSlot[]}
              colorTheme={colorTheme ?? 'light'}
            />
            <div className="space-y-6">
              {richText && (
                <RichText
                  className={`hero-content text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${
                    colorTheme === 'dark'
                      ? 'from-blue-300 to-indigo-300'
                      : 'from-blue-600 to-indigo-600'
                  } bg-clip-text text-transparent`}
                  data={richText}
                  enableGutter={false}
                />
              )}
              {Array.isArray(links) && links.length > 0 && (
                <ul className="flex flex-wrap justify-center gap-4">
                  {links.map(({ link }, i) => {
                    // Handle navigation efficiently
                    const handleLinkClick = () => {
                      if (!link) return
                      if (link.type === 'custom' && link.url) {
                        if (link.newTab) {
                          window.open(link.url, '_blank', 'noopener,noreferrer')
                        } else {
                          window.location.href = link.url
                        }
                      } else if (link.type === 'reference' && link.reference) {
                        const { relationTo, value } = link.reference
                        let url = ''
                        if (typeof value === 'string') {
                          url = `/${relationTo}/${value}`
                        } else if (typeof value === 'object' && value.slug) {
                          url =
                            relationTo === 'pages'
                              ? `/${value.slug}`
                              : `/${relationTo}/${value.slug}`
                        }
                        if (url) {
                          if (link.newTab) {
                            window.open(url, '_blank', 'noopener,noreferrer')
                          } else {
                            window.location.href = url
                          }
                        }
                      }
                    }

                    return (
                      <li key={i}>
                        <button
                          onClick={handleLinkClick}
                          className={`px-6 py-3 rounded-full text-white font-medium ${colorTheme === 'dark' ? 'bg-blue-600' : 'bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                          aria-label={link?.label || 'Link button'}
                        >
                          {link?.label || 'Link'}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 md:grid-cols-[1fr_320px] lg:grid-cols-[280px_1fr_320px] gap-6 md:gap-8 lg:gap-12 items-start`}
          >
            {/* Categories และ Social Media สำหรับ Desktop */}
            {showCategoriesDropdown && (
              <div className="hidden lg:block order-1">
                <CategoriesDropdown />
                <div className="mt-6">
                  <SocialMediaButtons />
                </div>
              </div>
            )}

            {/* เนื้อหาหลัก */}
            <div className="order-2 lg:order-2 flex flex-col space-y-6">
              <MainMediaArea />
              <HeroActionSlotsRenderer
                slots={heroActionSlots as HeroActionSlot[]}
                colorTheme={colorTheme ?? 'light'}
              />
              <div className="space-y-6">
                {richText && (
                  <RichText
                    className={`hero-content text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${
                      colorTheme === 'dark'
                        ? 'from-blue-300 to-indigo-300'
                        : 'from-blue-600 to-indigo-600'
                    } bg-clip-text text-transparent`}
                    data={richText}
                    enableGutter={false}
                  />
                )}
                {Array.isArray(links) && links.length > 0 && (
                  <ul className="flex flex-wrap gap-4">
                    {links.map(({ link }, i) => {
                      // Handle navigation efficiently
                      const handleLinkClick = () => {
                        if (!link) return
                        if (link.type === 'custom' && link.url) {
                          if (link.newTab) {
                            window.open(link.url, '_blank', 'noopener,noreferrer')
                          } else {
                            window.location.href = link.url
                          }
                        } else if (link.type === 'reference' && link.reference) {
                          const { relationTo, value } = link.reference
                          let url = ''
                          if (typeof value === 'string') {
                            url = `/${relationTo}/${value}`
                          } else if (typeof value === 'object' && value.slug) {
                            url =
                              relationTo === 'pages'
                                ? `/${value.slug}`
                                : `/${relationTo}/${value.slug}`
                          }
                          if (url) {
                            if (link.newTab) {
                              window.open(url, '_blank', 'noopener,noreferrer')
                            } else {
                              window.location.href = url
                            }
                          }
                        }
                      }

                      return (
                        <li key={i}>
                          <button
                            onClick={handleLinkClick}
                            className={`px-6 py-3 rounded-full text-white font-medium ${colorTheme === 'dark' ? 'bg-blue-600' : 'bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                            aria-label={link?.label || 'Link button'}
                          >
                            {link?.label || 'Link'}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>

            {/* Social Media สำหรับ Mobile/Tablet */}
            {showCategoriesDropdown && (
              <div className="lg:hidden order-3 space-y-6">
                <SocialMediaButtons />
              </div>
            )}

            {/* Frame */}
            {displayFrame && (
              <div className="order-4 md:order-3">
                <FramedContentRenderer blocks={framedHeroContent as SpecificHeroBlock[]} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
