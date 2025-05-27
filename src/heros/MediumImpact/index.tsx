'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useState } from 'react'

import type { Page, Category, Media } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media as MediaComponent } from '@/components/Media'
import RichText from '@/components/RichText'
import Link from 'next/link'

// Interface for Social Media Button
interface SocialMediaButton {
  id: string;
  label: string;
  icon: Media | string;
  url: string;
  newTab?: boolean;
}

export const MediumImpactHero: React.FC<Page['hero']> = ({
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
  socialMediaButtons
}) => {
  const { setHeaderTheme } = useHeaderTheme()
  const [currentSlide, setCurrentSlide] = useState(0);
  const hasSlideImages = Array.isArray(slideImages) && slideImages.length > 0;
  const [categories, setCategories] = useState<Category[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setHeaderTheme(colorTheme === 'dark' ? 'dark' : 'light')
  }, [colorTheme, setHeaderTheme])

  // ดึงข้อมูลหมวดหมู่
  useEffect(() => {
    const fetchCategories = async () => {
      if (!showCategoriesDropdown) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/categories?limit=${categoriesLimit}&depth=0&sort=sortOrder`);
        
        if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลหมวดหมู่ได้');
        
        const data = await response.json();
        setCategories(data.docs || []);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, [showCategoriesDropdown, categoriesLimit]);

  // สร้างคลาสสำหรับพื้นหลังตามธีมสี
  const getBgClasses = () => {
    switch (colorTheme) {
      case 'dark':
        return 'bg-gray-900 text-white';
      case 'lightBlue':
        return 'bg-blue-50 text-gray-900';
      case 'gradient':
        return 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900';
      case 'light':
      default:
        return 'bg-gray-50 text-gray-900';
    }
  }

  // ตรวจสอบว่าควรสลับคอลัมน์หรือไม่
  const isReversed = layoutVariant === 'reversed';
  const isCentered = layoutVariant === 'centered';

  // สร้างสไลด์โชว์อัตโนมัติ
  useEffect(() => {
    if (!hasSlideImages) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [hasSlideImages, slideImages]);

  return (
    <div
      className={`relative py-0 min-h-[50vh] ${getBgClasses()}`}
      data-theme={colorTheme === 'dark' ? 'dark' : 'light'}
    >
      {/* พื้นหลัง */}
      {backgroundImage && typeof backgroundImage === 'object' && (
        <div className="absolute inset-0 z-0">
          <MediaComponent
            resource={backgroundImage}
            fill
            imgClassName="object-cover opacity-30"
            priority
          />
        </div>
      )}

      <div className="container mx-auto px-4 z-10 relative">
        {isCentered ? (
          // แบบจัดกึ่งกลาง
          <div className="max-w-4xl mx-auto text-center">
            {richText && <RichText className={`text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r ${colorTheme === 'dark' ? 'from-blue-300 to-indigo-300' : 'from-blue-600 to-indigo-600'} bg-clip-text text-transparent`} data={richText} enableGutter={false} />}
            
            {/* เมนูหมวดหมู่แบบ Dropdown */}
            {showCategoriesDropdown && !isLoading && categories.length > 0 && (
              <div className="flex flex-wrap justify-center mb-6">
                <div className="categories-menu relative w-full max-w-4xl mx-auto mt-4 bg-white rounded-lg shadow-md">
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-0 border-b">
                    {categories.map((category) => (
                      <div 
                        key={category.id} 
                        className="relative group"
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        <Link 
                          href={`/categories/${category.slug}`}
                          className={`flex items-center justify-center text-center p-4 text-sm md:text-base hover:bg-blue-50 transition-colors duration-200 ${hoveredCategory === category.id ? 'bg-blue-50' : ''}`}
                        >
                          <span className="line-clamp-1">{category.title}</span>
                        </Link>
                        
                        {/* กล่องแสดงรายละเอียดเมื่อ hover */}
                        {hoveredCategory === category.id && (
                          <div className="absolute top-full left-0 right-0 z-50 bg-white p-4 shadow-lg rounded-b-lg min-w-[250px] max-w-md">
                            <div className="flex items-center gap-4">
                              {category.image && (
                                <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded">
                                  <MediaComponent 
                                    resource={category.image} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <h3 className="font-semibold text-lg">{category.title}</h3>
                                {category.description && (
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{category.description}</p>
                                )}
                                <Link 
                                  href={`/categories/${category.slug}`}
                                  className="text-blue-600 text-sm mt-2 inline-block hover:underline"
                                >
                                  ดูสินค้าทั้งหมด &rarr;
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Social Media Buttons Section - แยกจาก categories */}
            {socialMediaButtons && socialMediaButtons.length > 0 && (
              <div className="w-full max-w-4xl mx-auto mt-4 bg-white rounded-lg shadow-md">
                <div className="p-4">
                  <h4 className="text-lg font-semibold mb-4 text-gray-800 text-center flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    ติดต่อเรา
                  </h4>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {(socialMediaButtons as SocialMediaButton[]).map((button) => (
                      <a
                        key={button.id}
                        href={button.url}
                        target={button.newTab ? '_blank' : '_self'}
                        rel={button.newTab ? 'noopener noreferrer' : undefined}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 border border-gray-200 hover:border-blue-300 group"
                      >
                        {button.icon && typeof button.icon === 'object' && (button.icon as Media).url && (
                          <div className="w-6 h-6 flex-shrink-0">
                            <MediaComponent 
                              resource={button.icon as Media} 
                              className="w-full h-full object-contain" 
                              imgClassName="rounded-sm"
                            />
                          </div>
                        )}
                        <span className="font-medium text-gray-700 group-hover:text-blue-600">{button.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {hasSlideImages ? (
              <div className="relative mx-auto mt-6">
                <div className="relative aspect-[16/9] max-w-3xl mx-auto rounded-lg overflow-hidden shadow-lg">
                  {slideImages.map((slide, index) => (
                    <div 
                      key={index} 
                      className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                    >
                      {slide.image && typeof slide.image === 'object' && (
                        <MediaComponent 
                          className="w-full h-full object-cover"
                          imgClassName="object-cover"
                          priority={index === 0}
                          resource={slide.image}
                        />
                      )}
                    </div>
                  ))}
                  
                  {/* ปุ่มควบคุมสไลด์ */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                    {slideImages.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentSlide 
                            ? 'bg-white scale-110 shadow-md' 
                            : 'bg-white/50 hover:bg-white/80'
                        }`}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`ดูรูปที่ ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              media && typeof media === 'object' && (
                <div className="relative mx-auto mt-6">
                  <div className="relative aspect-[16/9] max-w-3xl mx-auto rounded-lg overflow-hidden shadow-lg">
                    <MediaComponent 
                      className="w-full h-full object-cover"
                      imgClassName="object-cover"
                      priority 
                      resource={media}
                    />
                  </div>
                </div>
              )
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
          // แบบแบ่ง 2 คอลัมน์
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
            <div className={`space-y-6 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
              {richText && <RichText className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${colorTheme === 'dark' ? 'from-blue-300 to-indigo-300' : 'from-blue-600 to-indigo-600'} bg-clip-text text-transparent`} data={richText} enableGutter={false} />}
              
              {/* เมนูหมวดหมู่แบบ Dropdown */}
              {showDecorations && showCategoriesDropdown && !isLoading && categories.length > 0 && (
                <div className="categories-menu relative w-full bg-white rounded-lg shadow-md mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-0 border-b">
                    {categories.map((category) => (
                      <div 
                        key={category.id} 
                        className="relative group"
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        <Link 
                          href={`/categories/${category.slug}`}
                          className={`flex items-center justify-center text-center p-4 text-sm md:text-base hover:bg-blue-50 transition-colors duration-200 ${hoveredCategory === category.id ? 'bg-blue-50' : ''}`}
                        >
                          <span className="line-clamp-1">{category.title}</span>
                        </Link>
                        
                        {/* กล่องแสดงรายละเอียดเมื่อ hover */}
                        {hoveredCategory === category.id && (
                          <div className="absolute top-full left-0 z-50 bg-white p-4 shadow-lg rounded-b-lg min-w-[250px] max-w-md">
                            <div className="flex items-center gap-4">
                              {category.image && (
                                <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded">
                                  <MediaComponent 
                                    resource={category.image} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
          <div>
                                <h3 className="font-semibold text-lg">{category.title}</h3>
                                {category.description && (
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{category.description}</p>
                                )}
                                <Link 
                                  href={`/categories/${category.slug}`}
                                  className="text-blue-600 text-sm mt-2 inline-block hover:underline"
                                >
                                  ดูสินค้าทั้งหมด &rarr;
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Social Media Buttons Section - แยกจาก categories ใน 2-column layout */}
              {showDecorations && socialMediaButtons && socialMediaButtons.length > 0 && (
                <div className="w-full bg-white rounded-lg shadow-md mt-4">
                  <div className="p-4">
                    <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      ติดต่อเรา
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {(socialMediaButtons as SocialMediaButton[]).map((button) => (
                        <a
                          key={button.id}
                          href={button.url}
                          target={button.newTab ? '_blank' : '_self'}
                          rel={button.newTab ? 'noopener noreferrer' : undefined}
                          className="flex items-center space-x-2 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 border border-gray-200 hover:border-blue-300 group"
                        >
                          {button.icon && typeof button.icon === 'object' && (button.icon as Media).url && (
                            <div className="w-5 h-5 flex-shrink-0">
                              <MediaComponent 
                                resource={button.icon as Media} 
                                className="w-full h-full object-contain" 
                                imgClassName="rounded-sm"
                              />
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{button.label}</span>
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
            <div className={`relative ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
              {hasSlideImages ? (
                <div className="relative rounded-lg overflow-hidden shadow-lg">
                  <div className="relative aspect-[4/3]">
                    {slideImages.map((slide, index) => (
                      <div 
                        key={index} 
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                      >
                        {slide.image && typeof slide.image === 'object' && (
                          <MediaComponent 
                            className="w-full h-full object-cover"
                            imgClassName="object-cover"
                            priority={index === 0}
                            resource={slide.image}
                          />
                        )}
                      </div>
                    ))}
                    
                    {/* ปุ่มควบคุมสไลด์ */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                      {slideImages.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentSlide 
                              ? 'bg-white scale-110 shadow-md' 
                              : 'bg-white/50 hover:bg-white/80'
                          }`}
                          onClick={() => setCurrentSlide(index)}
                          aria-label={`ดูรูปที่ ${index + 1}`}
                        />
                      ))}
                    </div>
                    
                    {/* ข้อความพิเศษ */}
                    {showDecorations && featuredText && (
                      <div className="absolute -right-3 -bottom-3 bg-blue-600 py-2 px-4 rounded-md text-white shadow-lg">
                        <div className="text-sm font-bold">{featuredText}</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                media && typeof media === 'object' && (
                  <div className="relative rounded-lg overflow-hidden shadow-lg">
                    <div className="relative aspect-[4/3]">
                        <MediaComponent
                        className="w-full h-full object-cover"
                        imgClassName="object-cover"
              priority
              resource={media}
            />
                      
                      {/* ข้อความพิเศษ */}
                      {showDecorations && featuredText && (
                        <div className="absolute -right-3 -bottom-3 bg-blue-600 py-2 px-4 rounded-md text-white shadow-lg">
                          <div className="text-sm font-bold">{featuredText}</div>
              </div>
            )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
      <style jsx global>{`
        .categories-menu {
          z-index: 40;
        }
      `}</style>
    </div>
  )
}
