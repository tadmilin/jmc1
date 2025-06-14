/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useState } from 'react'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface SlideType {
  image: string | MediaType
  title: string
  link?: string
  id?: string
}

interface ImageSliderBlockProps {
  slides: SlideType[]
  title?: string
  autoplay?: boolean
  showNavigation?: boolean
  showPagination?: boolean
}

export const ImageSliderBlock: React.FC<{
  block: ImageSliderBlockProps
  colorTheme?: string
}> = ({ block, colorTheme = 'light' }) => {
  const {
    slides = [],
    title = 'แบรนด์ที่เราไว้วางใจ',
    autoplay = true,
    showNavigation = true,
    showPagination = true,
  } = block

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse bg-gray-200 h-8 w-64 mx-auto mb-8 rounded"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!slides || slides.length === 0) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
            <p className="text-gray-600">ไม่มีรูปภาพในสไลเดอร์</p>
            <div className="mt-6">
              <a 
                href="/admin" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                เพิ่มรูปภาพใน Admin Panel
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // คำนวณ slidesPerView และ loop condition ที่ปลอดภัย
  const getMaxSlidesPerView = (breakpointSlides: number) => Math.min(breakpointSlides, slides.length)
  const shouldEnableLoop = slides.length >= 8 // ต้องมีอย่างน้อย 8 slides ถึงจะ loop ได้

  const sliderStyles = `
    .brand-slider-container {
      padding: 3rem 0;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }
    
    .brand-slider-title-container {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .brand-slider-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .brand-swiper-container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .brand-slide {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
      overflow: hidden;
      position: relative;
    }
    
    .brand-slide:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    
    .brand-slide-link {
      display: block;
      width: 100%;
      height: 100%;
      text-decoration: none;
      color: inherit;
    }
    
    .slide-inner-content {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      position: relative;
    }
    
    .slide-image-effect {
      width: 100%;
      height: 70%;
      object-fit: contain;
      transition: transform 0.3s ease;
      filter: grayscale(20%);
    }
    
    .brand-slide:hover .slide-image-effect {
      transform: scale(1.05);
      filter: grayscale(0%);
    }
    
    .slide-title-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
      padding: 1rem;
      color: white;
      text-align: center;
      font-size: 1rem;
      font-weight: 500;
      transition: opacity 0.3s ease;
      border-bottom-left-radius: inherit;
      border-bottom-right-radius: inherit;
    }
        
    .brand-slider-pagination {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }
    
    .swiper-pagination-bullet {
      width: 8px;
      height: 8px;
      background-color: #9ca3af;
      opacity: 0.7;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .swiper-pagination-bullet-active {
      background-color: #3b82f6;
      opacity: 1;
      transform: scale(1.1);
    }
    
    /* Navigation arrows styling */
    .swiper-button-next, .swiper-button-prev {
      color: #374151;
      width: 35px;
      height: 35px;
      background-color: rgba(255, 255, 255, 0.9);
      border: 1px solid #e5e7eb;
      border-radius: 50%;
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    .swiper-button-next:hover, .swiper-button-prev:hover {
      background-color: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }
    .swiper-button-next::after, .swiper-button-prev::after {
      font-size: 16px;
      font-weight: bold;
    }
    
    @media (max-width: 640px) {
      .brand-slider-title {
        font-size: 2rem;
      }
      .brand-slide {
        height: 150px;
      }
      .slide-title-overlay {
        font-size: 0.875rem;
        padding: 0.75rem;
      }
    }
  `

  return (
    <div className="brand-slider-container">
      <style dangerouslySetInnerHTML={{ __html: sliderStyles }} />
      
      <div className="brand-slider-title-container">
        <h2 className="brand-slider-title">{title}</h2>
      </div>
      
      <Swiper
        className="brand-swiper-container"
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1.9}
        centeredSlides={false}
        navigation={showNavigation}
        pagination={showPagination ? { 
          clickable: true,
          el: '.brand-slider-pagination',
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
        } : false}
        autoplay={autoplay && slides.length > 1 ? {
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true, 
        } : false}
        loop={shouldEnableLoop}
        loopAdditionalSlides={shouldEnableLoop ? 3 : 0}
        watchSlidesProgress={true}
        grabCursor={true}
        breakpoints={{
          640: {
            slidesPerView: getMaxSlidesPerView(2.2),
            spaceBetween: 20,
          },
          768: {
            slidesPerView: getMaxSlidesPerView(3.2),
            spaceBetween: 25,
          },
          1024: {
            slidesPerView: getMaxSlidesPerView(4.2),
            spaceBetween: 25,
          },
          1280: {
            slidesPerView: getMaxSlidesPerView(5.2),
            spaceBetween: 30,
          },
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id || index} className="brand-slide">
            {slide.link ? (
              <a
                href={slide.link}
                className="brand-slide-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="slide-inner-content">
                  {typeof slide.image === 'object' &&
                  slide.image !== null &&
                  'url' in slide.image ? (
                    <Media
                      resource={slide.image}
                      className="slide-image-effect"
                    />
                  ) : typeof slide.image === 'string' ? (
                    <img
                      src={slide.image}
                      alt={slide.title || 'Brand Logo'}
                      className="slide-image-effect"
                    />
                  ) : null}
                  <div className="slide-title-overlay">
                    <span>{slide.title}</span>
                  </div>
                </div>
              </a>
            ) : (
              <div className="slide-inner-content"> 
                 {typeof slide.image === 'object' && slide.image !== null && 'url' in slide.image ? (
                  <Media resource={slide.image} className="slide-image-effect" />
                ) : typeof slide.image === 'string' ? (
                  <img
                    src={slide.image}
                    alt={slide.title || 'Brand Logo'}
                      className="slide-image-effect"
                />
                  ) : null}
                <div className="slide-title-overlay">
                  <span>{slide.title}</span>
              </div>
          </div>
        )}
          </SwiperSlide>
        ))}
      </Swiper>
      
      {showPagination && (
        <div className="brand-slider-pagination"></div>
      )}
    </div>
  )
}

export default ImageSliderBlock
