/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/utilities/ui'
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
  title?: string
  slides: SlideType[]
  aspectRatio?: 'auto' | '1:1' | '16:9' | '4:3' | '3:4' // เพิ่ม 'auto'
  backgroundColor?: string
}

export const ImageSliderBlock: React.FC<{
  block: ImageSliderBlockProps
  colorTheme?: string
}> = ({ block, colorTheme = 'light' }) => {
  const { title = 'แบรนด์ของเรา', slides = [], aspectRatio = 'auto' } = block || {} // Default title and bg

  // ใช้สีพื้นหลังเดียวกับ hero
  const getBackgroundColor = () => {
    switch (colorTheme) {
      case 'dark':
        return '#111827' // gray-900 เดียวกับ hero dark
      case 'lightBlue':
        return '#eff6ff' // blue-50 เดียวกับ hero lightBlue
      case 'gradient':
        return 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)' // gradient เดียวกับ hero
      case 'light':
      default:
        return '#f9fafb' // gray-50 เดียวกับ hero light
    }
  }

  const backgroundColor = getBackgroundColor()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getAspectRatioStyle = () => {
    if (aspectRatio === 'auto') {
      return { paddingTop: '0', height: '80px' } // Reduced height for smaller logos
    }
    switch (aspectRatio) {
      case '16:9':
        return { paddingTop: '56.25%' }
      case '4:3':
        return { paddingTop: '75%' }
      case '3:4':
        return { paddingTop: '133.33%' }
      case '1:1':
      default:
        return { paddingTop: '100%' }
    }
  }

  // ปรับสีข้อความตาม colorTheme
  const getTextColors = () => {
    switch (colorTheme) {
      case 'dark':
        return {
          title: '#ffffff',
          icon: '#9ca3af',
        }
      case 'lightBlue':
      case 'gradient':
      case 'light':
      default:
        return {
          title: '#1f2937', // gray-800
          icon: '#6b7280', // gray-500
        }
    }
  }

  const textColors = getTextColors()

  const sliderStyles = `
    .brand-slider-container {
      background: ${backgroundColor};
      padding: 1.5rem 0; /* Further reduced padding */
    }
    
    .brand-slider-title-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem; /* Further reduced margin */
    }

    .brand-slider-title {
      color: ${textColors.title};
      text-align: center;
      font-size: 2rem; /* Increased font size to match other sections */
      font-weight: 700; /* Increased font weight for better visibility */
    }
    
    @media (min-width: 768px) {
      .brand-slider-title {
        font-size: 2.5rem; /* Even larger on desktop */
      }
    }
    
    .brand-swiper-container {
      padding: 0 45px; /* Better padding for navigation arrows */
    }

    /* Styling for each slide card */
    .brand-slide {
      height: 220px; /* Increased height for better brand visibility */
      border-radius: 12px; /* Rounded corners for the card */
      overflow: hidden;
      position: relative;
      background: transparent; /* Transparent background to show hero background */
      border: 1px solid ${colorTheme === 'dark' ? '#374151' : 'rgba(229, 231, 235, 0.3)'}; /* Subtle border */
      transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
    }

    .brand-slide:hover {
        transform: translateY(-5px) scale(1.03); /* Slight lift and scale on hover */
        box-shadow: 0 10px 20px rgba(0,0,0,0.15); 
        background: ${colorTheme === 'dark' ? 'rgba(31, 41, 55, 0.3)' : 'rgba(255, 255, 255, 0.5)'}; /* Subtle background on hover */
    }
    
    .brand-slide-link {
      display: block; /* Changed to block */
      width: 100%;
      height: 100%;
      text-decoration: none; /* Remove underline from link */
    }

    .slide-inner-content {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden; /* Clip the image if it scales */
      display: flex; /* Added for centering */
      align-items: center; /* Added for vertical centering */
      justify-content: center; /* Added for horizontal centering */
    }
    
    .slide-image-effect {
      /* Removed width: 100%; height: 100%; to allow natural aspect ratio centering via flexbox */
      max-width: 100%; /* Ensure image does not overflow its flex container */
      max-height: 100%; /* Ensure image does not overflow its flex container */
      object-fit: contain; 
      transform: scale(1); 
      filter: brightness(1); 
      transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .brand-slide:hover .slide-image-effect {
      transform: scale(1.05);
      filter: brightness(1.1);
    }
    
    .slide-title-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 12px 15px;
      background: ${
        colorTheme === 'dark'
          ? 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 60%, transparent 100%)'
          : 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)'
      };
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
      gap: 0.5rem; /* Reduced gap */
      margin-top: 1.5rem; /* Reduced margin */
    }
    
    .swiper-pagination-bullet {
      width: 8px; /* Smaller bullets */
      height: 8px;
      background-color: #9ca3af; /* Gray bullet color */
      opacity: 0.7;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .swiper-pagination-bullet-active {
      background-color: #3b82f6; /* Blue active bullet color */
      opacity: 1;
      transform: scale(1.1);
    }
    
    /* Navigation arrows styling based on theme */
    .swiper-button-next, .swiper-button-prev {
      color: #374151; /* Gray arrow color */
      width: 35px; /* Smaller arrows */
      height: 35px;
      background-color: rgba(255, 255, 255, 0.9); /* White background */
      border: 1px solid #e5e7eb; /* Light gray border */
      border-radius: 50%;
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    .swiper-button-next:hover, .swiper-button-prev:hover {
      background-color: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }
    .swiper-button-next::after, .swiper-button-prev::after {
      font-size: 16px; /* Smaller arrow icons */
      font-weight: bold;
    }
  `

  if (!isClient) {
    return (
      <div style={{ background: backgroundColor, padding: '2rem 0' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <span style={{ fontSize: '1.75rem', marginRight: '0.5rem', color: textColors.icon }}>
            🛒
          </span>
          <h2
            style={{
              color: textColors.title,
              textAlign: 'center',
              fontSize: '1.5rem',
              fontWeight: 600,
            }}
          >
            {title}
          </h2>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: textColors.icon,
            fontSize: '0.875rem',
          }}
        >
          Loading brands...
        </div>
      </div>
    )
  }

  if (!slides || slides.length === 0) {
    return (
      <div className="brand-slider-container">
        <div className="brand-slider-title-container">
          <span className="brand-slider-icon">🛒</span>
          <h2 className="brand-slider-title">{title}</h2>
        </div>
        <div className="text-center py-6" style={{ color: textColors.icon }}>
          <p className="text-sm">ไม่พบแบรนด์สินค้า</p>
        </div>
      </div>
    )
  }

  return (
    <div className="brand-slider-container">
      <style dangerouslySetInnerHTML={{ __html: sliderStyles }} />

      <div className="brand-slider-title-container">
        <h2 className="brand-slider-title">{title}</h2>
      </div>

      <Swiper
        className="brand-swiper-container"
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20} // Good space between cards
        slidesPerView={1.9} // Show almost 2 brands with good peek of next
        centeredSlides={false} // Can be true if you want active slide centered
        navigation
        pagination={{
          clickable: true,
          el: '.brand-slider-pagination',
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={slides.length > 4} // Adjust loop condition based on slidesPerView
        grabCursor={true}
        breakpoints={{
          640: {
            // sm
            slidesPerView: 2.2,
            spaceBetween: 20,
          },
          768: {
            // md
            slidesPerView: 3.2,
            spaceBetween: 25,
          },
          1024: {
            // lg
            slidesPerView: 4.2,
            spaceBetween: 25,
          },
          1280: {
            // xl
            slidesPerView: 5.2,
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
                      className="slide-image-effect" // Apply effect class to Media itself
                      // fill prop might not be needed if width/height 100% is on className
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

      <div className="brand-slider-pagination" />
    </div>
  )
}

export default ImageSliderBlock
