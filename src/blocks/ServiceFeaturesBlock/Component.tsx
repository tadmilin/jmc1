'use client';

import React, { useEffect, useRef } from 'react';
import { Media } from '@/components/Media';

// ประกาศไอคอนต่างๆ
const IconComponents = {
  cart: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.46 6C4.2 6 4 6.2 4 6.46v.08c0 .26.2.46.46.46h1.78l.6 2.9 1.5 7.33c.06.33.36.57.7.57h8.93c.33 0 .62-.23.69-.56l1.56-6.2c.07-.28-.1-.56-.37-.64-.05-.01-.1-.02-.16-.02H8.4l-.59-2.9c-.06-.33-.36-.57-.7-.57H4.46Zm14.97 12.96c0 1.12-.92 2.04-2.05 2.04-1.12 0-2.05-.92-2.05-2.04 0-1.13.93-2.05 2.05-2.05 1.13 0 2.05.92 2.05 2.05Zm-10 0c0 1.12-.92 2.04-2.05 2.04-1.12 0-2.05-.92-2.05-2.04 0-1.13.93-2.05 2.05-2.05 1.13 0 2.05.92 2.05 2.05Z" />
    </svg>
  ),
  phone: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.95 21c-2.22 0-4.34-.54-6.36-1.61-2.02-1.07-3.78-2.51-5.3-4.34-1.5-1.83-2.7-3.76-3.6-5.8-.9-2.04-1.35-3.97-1.35-5.8 0-.3.1-.55.29-.74.2-.2.45-.3.76-.3h3.9c.32 0 .58.1.79.32.21.21.35.5.4.87l.63 3.41c.05.36.03.67-.07.93-.1.26-.24.48-.44.67l-2.6 2.6c.97 1.33 2.07 2.5 3.32 3.53 1.25 1.03 2.63 1.89 4.12 2.58l2.37-2.37c.2-.2.42-.34.65-.4.23-.07.48-.05.75.07l3.4.73c.37.08.66.25.87.5.21.25.32.54.32.86V20c0 .3-.09.55-.29.74-.2.2-.45.3-.76.3h-2.2z" />
    </svg>
  ),
  lock: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 9V7c0-2.8-2.2-5-5-5S7 4.2 7 7v2c-1.7 0-3 1.3-3 3v7c0 1.7 1.3 3 3 3h10c1.7 0 3-1.3 3-3v-7c0-1.7-1.3-3-3-3zM9 7c0-1.7 1.3-3 3-3s3 1.3 3 3v2H9V7zm9 12c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1v-7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v7z" />
      <circle cx="12" cy="15" r="1.5" />
    </svg>
  ),
  truck: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.15 8h-1.3V5c0-1.66-1.34-3-3-3H5C3.34 2 2 3.34 2 5v11c0 1.66 1.34 3 3 3h.05c.23 1.14 1.24 2 2.45 2 1.2 0 2.21-.86 2.45-2h4.1c.23 1.14 1.24 2 2.45 2 1.2 0 2.21-.86 2.45-2H19.5c1.38 0 2.5-1.12 2.5-2.5v-5c0-1.94-1.31-3.5-2.85-3.5zm-13.6 11c-.83 0-1.5-.67-1.5-1.5S4.72 16 5.55 16s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.95-2h-.15c-.23-1.14-1.24-2-2.45-2-1.2 0-2.21.86-2.45 2h-4.1c-.23-1.14-1.24-2-2.45-2-1.2 0-2.21.86-2.45 2H5c-.55 0-1-.45-1-1V5c0-.55.45-1 1-1h9.85c.55 0 1 .45 1 1v9h4.65c.55 0 1 .45 1 1v2z" />
    </svg>
  ),
  return: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,5V1L7,6l5,5V7c3.31,0,6,2.69,6,6s-2.69,6-6,6s-6-2.69-6-6H4c0,4.42,3.58,8,8,8s8-3.58,8-8S16.42,5,12,5z" />
    </svg>
  ),
  money: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
    </svg>
  ),
  gift: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" />
    </svg>
  ),
  ticket: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-2 .89-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-2-1.46c-1.19.69-2 1.99-2 3.46s.81 2.77 2 3.46V18H4v-2.54c1.19-.69 2-1.99 2-3.46 0-1.48-.8-2.77-1.99-3.46L4 6h16v2.54zM11 15h2v2h-2zm0-4h2v2h-2zm0-4h2v2h-2z" />
    </svg>
  ),
  location: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  check: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  ),
};

// ประเภทข้อมูลของ block
type ServiceFeature = {
  title: string;
  description: string;
  iconType: keyof typeof IconComponents;
  customIcon?: any;
};

type ServiceFeaturesBlockProps = {
  title?: string;
  subtitle?: string;
  style?: 'modern' | 'classic' | 'card' | 'minimal';
  backgroundColor?: 'white' | 'light' | 'blue' | 'gradient';
  features: ServiceFeature[];
  animation?: 'none' | 'fade' | 'slideUp' | 'slideLeft' | 'bounce';
};

export const ServiceFeaturesBlock: React.FC<{
  block: ServiceFeaturesBlockProps;
  colorTheme?: string;
}> = ({ block, colorTheme = 'light' }) => {
  const {
    title = 'บริการของเรา',
    subtitle,
    style = 'modern',
    backgroundColor = 'white',
    features = [],
    animation = 'none',
  } = block || {};

  const featuresRef = useRef<HTMLDivElement>(null);

  // จัดการ Animation
  useEffect(() => {
    if (animation === 'none' || !featuresRef.current) return;

    const featureElements = featuresRef.current.querySelectorAll('.feature-item');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    featureElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      featureElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, [animation]);

  // กำหนดสีพื้นหลังให้เข้ากับ colorTheme ของ hero
  const getBackgroundClass = (colorTheme?: string) => {
    // ใช้ colorTheme จาก hero แทนการตั้งค่าแยก
    switch (colorTheme) {
      case 'dark':
        return 'bg-gray-900';
      case 'lightBlue':
        return 'bg-blue-50';
      case 'gradient':
        return 'bg-gradient-to-br from-blue-50 to-indigo-100';
      case 'light':
      default:
        return 'bg-gray-50'; // เปลี่ยนจาก bg-white เป็น bg-gray-50 ให้เข้ากับ hero
    }
  };

  // กำหนด Animation Class
  const getAnimationClass = (index: number) => {
    const delay = `delay-[${index * 150}ms]`;
    
    switch (animation) {
      case 'fade':
        return `opacity-0 transition-opacity duration-700 ${delay} animated:opacity-100`;
      case 'slideUp':
        return `opacity-0 translate-y-10 transition-all duration-700 ${delay} animated:opacity-100 animated:translate-y-0`;
      case 'slideLeft':
        return `opacity-0 translate-x-10 transition-all duration-700 ${delay} animated:opacity-100 animated:translate-x-0`;
      case 'bounce':
        return `opacity-0 translate-y-10 transition-all duration-700 ${delay} animated:opacity-100 animated:translate-y-0 animated:animate-bounce`;
      default:
        return '';
    }
  };

  // เรนเดอร์ตามสไตล์ที่เลือก
  const renderFeatures = () => {
    switch (style) {
      case 'modern':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-item flex flex-col items-center text-center p-4 md:p-6 rounded-lg ${colorTheme === 'dark' ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white border border-blue-100 hover:border-blue-200'} shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 ${getAnimationClass(index)}`}
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4 rounded-full flex items-center justify-center p-2 md:p-3 ${colorTheme === 'dark' ? 'bg-blue-600 text-white' : 'text-blue-600 bg-blue-50 border-2 border-blue-200'}`}>
                  {feature.customIcon && typeof feature.customIcon === 'object' ? (
                    <Media resource={feature.customIcon} className="w-8 h-8 md:w-12 md:h-12" />
                  ) : (
                    IconComponents[feature.iconType] || IconComponents.check
                  )}
                </div>
                <h3 className={`text-sm md:text-lg font-bold mb-1 md:mb-2 ${colorTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{feature.title}</h3>
                {feature.description && <p className={`text-xs md:text-sm ${colorTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{feature.description}</p>}
              </div>
            ))}
          </div>
        );

      case 'classic':
        return (
          <div className="flex flex-wrap justify-center items-center">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-item flex flex-col items-center text-center p-6 m-2 ${getAnimationClass(index)}`}
              >
                <div className="w-14 h-14 mb-3 text-amber-600">
                  {feature.customIcon && typeof feature.customIcon === 'object' ? (
                    <Media resource={feature.customIcon} className="w-full h-full" />
                  ) : (
                    IconComponents[feature.iconType] || IconComponents.check
                  )}
                </div>
                <h3 className={`text-base font-bold uppercase mb-1 ${colorTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{feature.title}</h3>
                {feature.description && <p className="text-gray-600 text-xs">{feature.description}</p>}
              </div>
            ))}
          </div>
        );

      case 'card':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-item bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all ${getAnimationClass(index)}`}
              >
                <div className="h-3 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <div className="p-5">
                  <div className="w-12 h-12 mb-4 text-indigo-600">
                    {feature.customIcon && typeof feature.customIcon === 'object' ? (
                      <Media resource={feature.customIcon} className="w-full h-full" />
                    ) : (
                      IconComponents[feature.iconType] || IconComponents.check
                    )}
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${colorTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{feature.title}</h3>
                  {feature.description && <p className="text-gray-600 text-sm">{feature.description}</p>}
                </div>
              </div>
            ))}
          </div>
        );

      case 'minimal':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-item flex items-center p-3 ${getAnimationClass(index)}`}
              >
                <div className="w-10 h-10 mr-3 text-blue-600 flex-shrink-0">
                  {feature.customIcon && typeof feature.customIcon === 'object' ? (
                    <Media resource={feature.customIcon} className="w-full h-full" />
                  ) : (
                    IconComponents[feature.iconType] || IconComponents.check
                  )}
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${colorTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{feature.title}</h3>
                  {feature.description && <p className="text-gray-600 text-xs">{feature.description}</p>}
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className={`py-8 ${getBackgroundClass(colorTheme)}`}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${colorTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{title}</h2>}
            {subtitle && <p className={`max-w-2xl mx-auto text-sm md:text-base ${colorTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{subtitle}</p>}
          </div>
        )}
        
        <div ref={featuresRef}>
          {renderFeatures()}
        </div>
      </div>
      
      <style jsx global>{`
        .animated {
          animation-play-state: running;
        }
      `}</style>
    </section>
  );
};

export default ServiceFeaturesBlock; 