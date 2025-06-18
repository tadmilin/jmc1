'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useState } from 'react'

import type { Page, Category, Media } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media as MediaComponent } from '@/components/Media'
import RichText from '@/components/RichText'

// Interface for Social Media Button
interface SocialMediaButton {
  id: string
  label: string
  icon: Media | string
  url: string
  newTab?: boolean
}

export const MediumImpactHero: React.FC<Page['hero']> = ({
  links,
  media,
  richText,
  colorTheme = 'light',
  layoutVariant = 'standard',
  backgroundImage,
  slideImages,
  showCategoriesDropdown = true,
  categoriesLimit = 10,
  socialMediaButtons,
}) => {
  const { setHeaderTheme } = useHeaderTheme()
  const [_currentSlide, setCurrentSlide] = useState(0)
  const hasSlideImages = Array.isArray(slideImages) && slideImages.length > 0
  const [categories, setCategories] = useState<Category[]>([])
  const [_hoveredCategory, _setHoveredCategory] = useState<string | null>(null)
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
  const isReversed = layoutVariant === 'reversed'
  const isCentered = layoutVariant === 'centered'

  // สร้างสไลด์โชว์อัตโนมัติ
  useEffect(() => {
    if (!hasSlideImages) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [hasSlideImages, slideImages])

  // Categories Dropdown Component
  const CategoriesDropdown = () => {
    if (!showCategoriesDropdown || isLoadingCategories || categories.length === 0) return null

    const baseTextColor = colorTheme === 'dark' ? 'text-white' : 'text-gray-900'
    const hoverBgColor = colorTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-blue-50'
    const borderColor = colorTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
    const headerTextColor = colorTheme === 'dark' ? 'text-white' : 'text-gray-900'

    // Fast navigation handler
    const handleCategoryClick = (slug: string | null | undefined) => {
      if (slug) {
        window.location.href = `/categories/${slug}`
      }
    }

    return (
      <div
        className={`w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-lg border ${borderColor} overflow-hidden`}
      >
        <div
          className={`px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 border-b ${borderColor}`}
        >
          <h3 className={`text-lg font-semibold ${headerTextColor} flex items-center gap-2`}>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
        <div className="max-h-80 overflow-y-auto">
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {categories.map((category) => (
              <li key={category.id} className="group">
                <button
                  onClick={() => handleCategoryClick(category.slug)}
                  className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${baseTextColor} ${hoverBgColor} group-hover:pl-6 w-full text-left cursor-pointer focus:outline-none focus:bg-blue-50 dark:focus:bg-gray-700`}
                  aria-label={`ไปยังหมวดหมู่ ${category.title}`}
                >
                  {category.image && typeof category.image === 'object' && (
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                      <MediaComponent
                        resource={category.image}
                        className="w-full h-full object-cover"
                        imgClassName="w-full h-full object-cover"
                        loading="lazy"
                        priority={false}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{category.title}</p>
                    {category.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors"
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
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  // Social Media Buttons Component with Fast Navigation
  const SocialMediaButtons = () => {
    if (!socialMediaButtons || socialMediaButtons.length === 0) return null

    const isDarkTheme = colorTheme === 'dark'
    const containerBg = isDarkTheme ? 'bg-gray-800' : 'bg-white'
    const borderColor = isDarkTheme ? 'border-gray-700' : 'border-gray-200'
    const headerTextColor = isDarkTheme ? 'text-white' : 'text-gray-900'

    // Fast navigation handler
    const handleSocialClick = (url: string, newTab?: boolean) => {
      if (newTab) {
        window.open(url, '_blank', 'noopener,noreferrer')
      } else {
        window.location.href = url
      }
    }

    return (
      <div
        className={`w-full max-w-sm ${containerBg} rounded-xl shadow-lg border ${borderColor} overflow-hidden mt-4`}
      >
        <div
          className={`px-4 py-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 border-b ${borderColor}`}
        >
          <h3 className={`text-lg font-semibold ${headerTextColor} flex items-center gap-2`}>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
              <button
                key={button.id}
                onClick={() => handleSocialClick(button.url, button.newTab)}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400 group w-full text-left focus:outline-none focus:bg-blue-50 dark:focus:bg-gray-700"
                aria-label={`ติดต่อผ่าน ${button.label}`}
              >
                {button.icon && typeof button.icon === 'object' && (button.icon as Media).url && (
                  <div className="w-6 h-6 flex-shrink-0">
                    <MediaComponent
                      resource={button.icon as Media}
                      className="w-full h-full object-contain"
                      imgClassName="rounded-sm w-full h-full object-contain"
                      loading="lazy"
                      priority={false}
                    />
                  </div>
                )}
                <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {button.label}
                </span>
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors ml-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative min-h-[60vh] flex flex-col justify-center ${getBgClasses()} overflow-hidden`}
      data-theme={colorTheme === 'dark' ? 'dark' : 'light'}
    >
      {backgroundImage && typeof backgroundImage === 'object' && (
        <div className="absolute inset-0 z-0">
          <MediaComponent
            resource={backgroundImage as Media}
            fill
            imgClassName={`object-cover ${colorTheme === 'dark' ? 'opacity-10' : 'opacity-20'}`}
            priority
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-8 z-10 relative">
        {isCentered ? (
          <div className="text-center max-w-4xl mx-auto">
            {richText && (
              <RichText
                className={`text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r ${colorTheme === 'dark' ? 'from-blue-300 to-indigo-300' : 'from-blue-600 to-indigo-600'} bg-clip-text text-transparent mb-6`}
                data={richText}
                enableGutter={false}
              />
            )}

            {/* Social Media Buttons in centered layout */}
            {socialMediaButtons && socialMediaButtons.length > 0 && (
              <div className="flex justify-center mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3
                    className={`text-lg font-semibold mb-4 ${colorTheme === 'dark' ? 'text-white' : 'text-gray-900'} text-center`}
                  >
                    ติดต่อเรา
                  </h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    {(socialMediaButtons as SocialMediaButton[]).map((button) => (
                      <a
                        key={button.id}
                        href={button.url}
                        target={button.newTab ? '_blank' : '_self'}
                        rel={button.newTab ? 'noopener noreferrer' : undefined}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 border border-gray-200 hover:border-blue-300 group"
                      >
                        {button.icon &&
                          typeof button.icon === 'object' &&
                          (button.icon as Media).url && (
                            <div className="w-6 h-6 flex-shrink-0">
                              <MediaComponent
                                resource={button.icon as Media}
                                className="w-full h-full object-contain"
                                imgClassName="rounded-sm w-full h-full object-contain"
                              />
                            </div>
                          )}
                        <span className="font-medium text-gray-700 group-hover:text-blue-600">
                          {button.label}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Media in centered layout */}
            {media && typeof media === 'object' && (
              <div className="relative mx-auto mt-6">
                <div className="relative aspect-[16/9] max-w-3xl mx-auto rounded-lg overflow-hidden shadow-lg">
                  <MediaComponent
                    className="w-full h-full object-cover"
                    imgClassName="object-cover w-full h-full"
                    priority
                    resource={media}
                  />
                </div>
              </div>
            )}

            {Array.isArray(links) && links.length > 0 && (
              <ul className="flex flex-wrap justify-center gap-4 mt-8">
                {links.map(({ link }, i) => {
                  return (
                    <li key={i}>
                      <CMSLink
                        {...link}
                        className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                      />
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 ${showCategoriesDropdown ? 'lg:grid-cols-[280px_1fr]' : 'lg:grid-cols-1'} gap-8 lg:gap-12 items-start`}
          >
            {/* Categories Dropdown - แสดงเฉพาะ desktop */}
            {showCategoriesDropdown && (
              <div className={`w-full ${isReversed ? 'lg:order-2' : 'lg:order-1'} hidden lg:block`}>
                <CategoriesDropdown />
                <SocialMediaButtons />
              </div>
            )}

            <div
              className={`
              ${showCategoriesDropdown ? (isReversed ? 'lg:order-1' : 'lg:order-2') : 'lg:order-1'}
              flex flex-col items-center text-center lg:items-start lg:text-left w-full
            `}
            >
              {richText && (
                <RichText
                  className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r ${colorTheme === 'dark' ? 'from-blue-300 to-indigo-300' : 'from-blue-600 to-indigo-600'} bg-clip-text text-transparent mb-6`}
                  data={richText}
                  enableGutter={false}
                />
              )}

              {/* Social Media Buttons ใน mobile - แสดงหลัง richText */}
              {!showCategoriesDropdown && socialMediaButtons && socialMediaButtons.length > 0 && (
                <div className="w-full lg:hidden px-4 md:px-0 mb-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                    <h3
                      className={`text-lg font-semibold mb-3 ${colorTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                    >
                      ติดต่อเรา
                    </h3>
                    <div className="space-y-2">
                      {(socialMediaButtons as SocialMediaButton[]).map((button) => (
                        <a
                          key={button.id}
                          href={button.url}
                          target={button.newTab ? '_blank' : '_self'}
                          rel={button.newTab ? 'noopener noreferrer' : undefined}
                          className="flex items-center space-x-2 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 border border-gray-200 hover:border-blue-300 group"
                        >
                          {button.icon &&
                            typeof button.icon === 'object' &&
                            (button.icon as Media).url && (
                              <div className="w-5 h-5 flex-shrink-0">
                                <MediaComponent
                                  resource={button.icon as Media}
                                  className="w-full h-full object-contain"
                                  imgClassName="rounded-sm w-full h-full object-contain"
                                />
                              </div>
                            )}
                          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                            {button.label}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {Array.isArray(links) && links.length > 0 && (
                <ul className="flex flex-wrap gap-4 mt-8">
                  {links.map(({ link }, i) => {
                    return (
                      <li key={i}>
                        <CMSLink
                          {...link}
                          className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                        />
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
