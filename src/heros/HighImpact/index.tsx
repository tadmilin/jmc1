'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useState } from 'react'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import Image from 'next/image'

import type {
  Page,
  Category,
  Media as MediaType,
  Post /*HeroBlock, Link as LinkType*/,
} from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import Link from 'next/link'

// Adjusted CustomLinkType to better match CMSLinkType from @/components/Link
interface CustomLinkType {
  type?: 'reference' | 'custom' | null
  label?: string | null
  url?: string | null
  reference?: {
    relationTo: 'pages' | 'posts' | string // Allow string for flexibility from linkGroup, but CMSLink might be stricter
    value: string | number | Page | Post | { id: string; slug?: string; [key: string]: unknown } // More aligned with CMSLinkType and common object structure
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
                <RichText data={block.text} enableGutter={false} />
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

// Component for Hero Action Slots (Updated Styling)
const HeroActionSlotsRenderer: React.FC<{
  slots: HeroActionSlot[] | null | undefined
  colorTheme?: string
}> = ({ slots, colorTheme }) => {
  if (!slots || slots.length === 0) return null

  const isDarkTheme = colorTheme === 'dark'
  const cardBgColor = isDarkTheme ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
  const titleColor = isDarkTheme ? 'text-white' : 'text-gray-900'
  const descColor = isDarkTheme ? 'text-gray-300' : 'text-gray-700'
  const cardBorderColor = isDarkTheme ? 'border-gray-700' : 'border-gray-200'

  return (
    <div className="w-full pt-0 pb-2 md:pb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {slots.map((slot) => {
          // Handle the nested slotLink structure from payload
          const linkData = slot.slotLink && slot.slotLink.length > 0 ? slot.slotLink[0]?.link : null

          const cmsLinkProps = linkData
            ? {
                type: linkData.type,
                url: linkData.url,
                label: linkData.label || slot.title,
                newTab: linkData.newTab,
                reference: linkData.reference as {
                  relationTo: 'pages' | 'posts'
                  value: string | number
                },
              }
            : null

          // Handle icon - check if it's an object with URL or just a string ID
          const hasValidIcon =
            slot.icon &&
            ((typeof slot.icon === 'object' && slot.icon.url) ||
              (typeof slot.icon === 'string' && slot.icon.length > 0))

          const slotContent = (
            <div
              className={`flex items-center space-x-4 p-4 md:p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${cardBgColor} border ${cardBorderColor} h-full cursor-pointer`}
            >
              {hasValidIcon && (
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-1">
                  {typeof slot.icon === 'object' && slot.icon.url ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={slot.icon.url}
                        alt={slot.title || 'Product icon'}
                        fill
                        className="rounded-md object-contain"
                        sizes="(max-width: 768px) 48px, 64px"
                      />
                    </div>
                  ) : typeof slot.icon === 'string' ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={`/api/media/file/${slot.icon}`}
                        alt={slot.title || 'Product icon'}
                        fill
                        className="rounded-md object-contain"
                        sizes="(max-width: 768px) 48px, 64px"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          e.currentTarget.style.display = 'none'
                          const fallback = e.currentTarget.parentElement?.nextElementSibling
                          if (fallback) fallback.classList.remove('hidden')
                        }}
                      />
                    </div>
                  ) : null}
                  {/* Fallback icon */}
                  <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-md flex items-center justify-center hidden">
                    <svg
                      className="w-6 h-6 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              )}
              <div className="flex-grow">
                <h4 className={`font-semibold text-lg md:text-xl mb-1 ${titleColor}`}>
                  {slot.title}
                </h4>
                {slot.description && (
                  <p className={`text-sm md:text-base ${descColor}`}>{slot.description}</p>
                )}
              </div>
            </div>
          )

          const isValidLink =
            cmsLinkProps &&
            ((cmsLinkProps.type === 'custom' && cmsLinkProps.url) ||
              (cmsLinkProps.type === 'reference' && cmsLinkProps.reference?.value))

          return isValidLink && cmsLinkProps ? (
            <CMSLink key={slot.id} {...cmsLinkProps} className="block h-full">
              {slotContent}
            </CMSLink>
          ) : (
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
          `/api/categories?limit=${categoriesLimit}&depth=0&sort=sortOrder`,
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
  const isReversed = layoutVariant === 'reversed'
  const isCentered = layoutVariant === 'centered'

  // สร้างสไลด์โชว์อัตโนมัติ
  useEffect(() => {
    if (!hasSlideImages) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (slideImages?.length || 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [hasSlideImages, slideImages])

  // Reinstated CategoriesDropdown Component for the left sidebar
  const CategoriesDropdown = () => {
    if (!showCategoriesDropdown || isLoadingCategories || categories.length === 0) return null
    const baseTextColor = 'text-white' // สีขาวเสมอ
    const hoverBgColor = 'hover:bg-gray-700'
    const borderColor = 'border-gray-700'
    const headerTextColor = 'text-white' // สีขาวเสมอ
    const scrollbarClasses =
      '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-600'

    return (
      <div
        className={`w-full max-w-sm bg-gray-800 rounded-xl shadow-lg border ${borderColor} overflow-hidden`}
      >
        <div
          className={`px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-600 border-b ${borderColor}`}
        >
          <h3 className={`text-lg font-semibold ${headerTextColor} flex items-center gap-2`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className={`max-h-80 overflow-y-auto ${scrollbarClasses}`}>
          <ul className="divide-y divide-gray-700">
            {categories.map((category) => (
              <li key={category.id} className="group">
                <Link
                  href={`/categories/${category.slug}`}
                  className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${baseTextColor} ${hoverBgColor} group-hover:pl-6`}
                >
                  {category.image && typeof category.image === 'object' && (
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 shadow-sm relative">
                      <Image
                        src={category.image.url || ''}
                        alt={category.title || 'Category image'}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-white">{category.title}</p>
                    {category.description && (
                      <p className="text-xs text-gray-300 truncate mt-0.5">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors"
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
                </Link>
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

    const containerBg = 'bg-gray-800'
    const borderColor = 'border-gray-700'
    const headerTextColor = 'text-white'

    return (
      <div
        className={`w-full max-w-sm ${containerBg} rounded-xl shadow-lg border ${borderColor} overflow-hidden mt-4`}
      >
        <div
          className={`px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-600 border-b ${borderColor}`}
        >
          <h3 className={`text-lg font-semibold ${headerTextColor} flex items-center gap-2`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 group"
              >
                {button.icon &&
                  typeof button.icon === 'object' &&
                  (button.icon as MediaType).url && (
                    <div className="w-8 h-8 flex-shrink-0 rounded-lg overflow-hidden shadow-sm relative">
                      <Image
                        src={(button.icon as MediaType).url || ''}
                        alt={button.label || 'Social media icon'}
                        fill
                        className="rounded-lg object-contain"
                        sizes="32px"
                      />
                    </div>
                  )}
                <span className="font-medium text-white group-hover:text-blue-400">
                  {button.label}
                </span>
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors ml-auto"
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

  // Main Slider/Media Component (to be placed in the center column, top)
  const MainMediaArea = () => {
    if (hasSlideImages) {
      return (
        <div className="relative rounded-xl overflow-hidden shadow-2xl w-full mb-2 aspect-video md:aspect-[16/9]">
          {slideImages.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
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
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentSlide
                    ? (colorTheme === 'dark' ? 'bg-white' : 'bg-gray-800') + ' scale-110 shadow-md'
                    : (colorTheme === 'dark' ? 'bg-white/50' : 'bg-gray-400') + ' hover:opacity-80'
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
    return null
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

      <div className={`container mx-auto px-1 pt-1 pb-1 md:pb-2 lg:pb-2 z-3 relative w-full`}>
        {isCentered ? (
          <div className="text-center max-w-5xl mx-auto flex flex-col">
            <MainMediaArea />
            <HeroActionSlotsRenderer
              slots={heroActionSlots as HeroActionSlot[]}
              colorTheme={colorTheme ?? 'light'}
            />
            <div className="space-y-4 mt-4">
              {richText && (
                <RichText
                  className={`text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r ${colorTheme === 'dark' ? 'from-blue-300 to-indigo-300' : 'from-blue-600 to-indigo-600'} bg-clip-text text-transparent`}
                  data={richText}
                  enableGutter={false}
                />
              )}
              {Array.isArray(links) && links.length > 0 && (
                <ul className="flex flex-wrap justify-center gap-4 mt-6">
                  {links.map(({ link }, i) => (
                    <li key={i}>
                      <CMSLink
                        {...link}
                        className={`px-6 py-3 rounded-full text-white font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg inline-block ${colorTheme === 'dark' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-700 hover:bg-blue-600'}`}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 ${showCategoriesDropdown ? (displayFrame ? 'lg:grid-cols-[280px_1fr_320px]' : 'lg:grid-cols-[280px_1fr]') : displayFrame ? 'lg:grid-cols-[1fr_320px]' : 'lg:grid-cols-1'} gap-8 lg:gap-12 items-start`}
          >
            {/* Categories Dropdown และ Social Media Buttons - แสดงเฉพาะ desktop */}
            {showCategoriesDropdown && (
              <div
                className={`w-full ${isReversed && displayFrame ? 'lg:order-2' : 'lg:order-1'} hidden lg:block`}
              >
                <CategoriesDropdown />
                <SocialMediaButtons />
              </div>
            )}

            <div
              className={`
              ${showCategoriesDropdown ? (isReversed && displayFrame ? 'lg:order-1' : 'lg:order-2') : isReversed && displayFrame ? 'lg:order-2' : 'lg:order-1'}
              flex flex-col items-center text-center lg:items-start lg:text-left w-full
            `}
            >
              <MainMediaArea />
              <HeroActionSlotsRenderer
                slots={heroActionSlots as HeroActionSlot[]}
                colorTheme={colorTheme ?? 'light'}
              />

              {/* Social Media Buttons ใน mobile - แสดงหลัง HeroActionSlots */}
              <div className="w-full lg:hidden px-4 md:px-0 mt-2">
                <SocialMediaButtons />
              </div>

              <div className="w-full px-4 md:px-0 mt-2">
                {richText && (
                  <RichText
                    className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r ${colorTheme === 'dark' ? 'from-blue-300 to-indigo-300' : 'from-blue-600 to-indigo-600'} bg-clip-text text-transparent`}
                    data={richText}
                    enableGutter={false}
                  />
                )}
              </div>
              {Array.isArray(links) && links.length > 0 && (
                <ul className="flex flex-wrap gap-3 pt-2 justify-center lg:justify-start px-4 md:px-0 mt-2">
                  {links.map(({ link }, i) => (
                    <li key={i}>
                      <CMSLink
                        {...link}
                        className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-lg ${colorTheme === 'dark' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-700 hover:bg-blue-600 text-white'}`}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {displayFrame && (
              <div
                className={`${isReversed ? (showCategoriesDropdown ? 'lg:order-1' : 'lg:order-1') : showCategoriesDropdown ? 'lg:order-3' : 'lg:order-2'} w-full self-start lg:max-h-[calc(80vh)] min-h-[300px]`}
              >
                <FramedContentRenderer blocks={framedHeroContent as SpecificHeroBlock[]} />
              </div>
            )}
          </div>
        )}
      </div>
      <style jsx global>{`
        .styled-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .styled-scrollbar::-webkit-scrollbar-track {
        }
        .styled-scrollbar::-webkit-scrollbar-thumb {
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .categories-menu {
          z-index: 40;
        }
      `}</style>
    </div>
  )
}
