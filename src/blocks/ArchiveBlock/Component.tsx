'use client';

import React from 'react'
import type { ArchiveBlock as ArchiveBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { CollectionArchive } from '@/components/CollectionArchive'
import clsx from 'clsx'
import Link from 'next/link'

const ActionButtons = ({ colorTheme = 'light' }: { colorTheme?: string }) => {
  const isDarkTheme = colorTheme === 'dark';
  
  return (
    <div className="flex justify-center gap-6 mt-8 flex-wrap px-4">
      <Link 
        href="/categories/iron" 
        className={`group flex items-center justify-center px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl min-w-[200px] ${
          isDarkTheme 
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg' 
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg'
        }`}
      >
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-4l-3 3.5a5 5 0 1 1-4 4L5 7l5 5L5 7z" />
          </svg>
          <span>ดูสินค้าทั้งหมด</span>
        </div>
      </Link>
      
      <Link 
        href="tel:+66123456789" 
        className={`group flex items-center justify-center px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl min-w-[200px] ${
          isDarkTheme 
            ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white shadow-lg' 
            : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white shadow-lg'
        }`}
      >
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>โทรหาเรา</span>
        </div>
      </Link>
      
      <Link 
        href="/contact" 
        className={`group flex items-center justify-center px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl min-w-[200px] ${
          isDarkTheme 
            ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white shadow-lg' 
            : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white shadow-lg'
        }`}
      >
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>ขอใบเสนอราคา</span>
        </div>
      </Link>
    </div>
  );
};

// Restore original component signature to receive all props directly
export const ArchiveBlock: React.FC<ArchiveBlockProps & { id?: string; colorTheme?: string }> = (props) => {
  const { introContent, colorTheme = 'light' } = props;

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

  const isDarkTheme = colorTheme === 'dark';
  const containerBg = isDarkTheme ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDarkTheme ? 'border-gray-700' : 'border-gray-200';
  const headerTextColor = isDarkTheme ? 'text-gray-100' : 'text-gray-800';

  return (
    <div
      className={`relative py-16 lg:py-24 ${getBgClasses()}`}
      id={props.blockName ? props.blockName : props.blockType}
    >
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className={`text-center mb-16 max-w-4xl mx-auto ${containerBg} rounded-2xl shadow-xl border ${borderColor} overflow-hidden`}>
          <div className={`px-8 py-6 bg-gradient-to-r ${isDarkTheme ? 'from-gray-700 to-gray-600' : 'from-blue-50 to-indigo-50'} border-b ${borderColor}`}>
            {introContent && (
              <div className={`prose prose-lg max-w-none ${isDarkTheme ? 'prose-invert' : ''}`}>
                <RichText data={introContent} />
              </div>
            )}
          </div>
          <div className="p-8">
            <ActionButtons colorTheme={colorTheme} />
          </div>
        </div>

        {/* Archive Content */}
        <div className="relative">
          <CollectionArchive posts={[]} colorTheme={colorTheme} />
        </div>
      </div>
    </div>
  );
};

export default ArchiveBlock
