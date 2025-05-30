'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface UploadImprovementProps {
  onFileSelect: (file: File) => void
  maxFileSize?: number
  acceptedFileTypes?: string[]
}

export const UploadImprovement: React.FC<UploadImprovementProps> = ({
  onFileSelect,
  maxFileSize = 2 * 1024 * 1024, // 2MB default
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
}) => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>(
    'idle',
  )
  const [errorMessage, setErrorMessage] = useState<string>('')

  const validateFile = useCallback(
    (file: File): string | null => {
      // ตรวจสอบขนาดไฟล์
      if (file.size > maxFileSize) {
        return `ไฟล์ใหญ่เกินไป (${Math.round((file.size / 1024 / 1024) * 100) / 100}MB) ขีดจำกัด: ${Math.round(maxFileSize / 1024 / 1024)}MB`
      }

      // ตรวจสอบประเภทไฟล์
      if (!acceptedFileTypes.includes(file.type)) {
        return `ประเภทไฟล์ไม่รองรับ: ${file.type}`
      }

      return null
    },
    [maxFileSize, acceptedFileTypes],
  )

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      // ตรวจสอบไฟล์
      const validationError = validateFile(file)
      if (validationError) {
        setErrorMessage(validationError)
        setUploadStatus('error')
        return
      }

      setUploadStatus('uploading')
      setErrorMessage('')

      try {
        // รอสักครู่เพื่อให้ UI อัพเดท
        await new Promise((resolve) => setTimeout(resolve, 100))

        onFileSelect(file)
        setUploadStatus('success')
      } catch (error) {
        console.error('Upload error:', error)
        setErrorMessage('เกิดข้อผิดพลาดในการอัพโหลด')
        setUploadStatus('error')
      }
    },
    [onFileSelect, validateFile],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: 1,
    multiple: false,
  })

  const getStatusMessage = () => {
    switch (uploadStatus) {
      case 'uploading':
        return '🔄 กำลังอัพโหลด...'
      case 'success':
        return '✅ อัพโหลดสำเร็จ!'
      case 'error':
        return `❌ ${errorMessage}`
      default:
        return '📁 วางไฟล์ที่นี่หรือคลิกเพื่อเลือก'
    }
  }

  const getStatusColor = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'text-blue-600'
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploadStatus === 'uploading' ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} disabled={uploadStatus === 'uploading'} />

        <div className="space-y-2">
          <div className={`font-medium ${getStatusColor()}`}>{getStatusMessage()}</div>

          {uploadStatus === 'idle' && (
            <div className="text-sm text-gray-500">
              <div>ขีดจำกัด: {Math.round(maxFileSize / 1024 / 1024)}MB</div>
              <div>รองรับ: รูปภาพ (JPEG, PNG, WebP, GIF)</div>
            </div>
          )}
        </div>
      </div>

      {/* คำแนะนำการแก้ไขปัญหา */}
      {uploadStatus === 'error' && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-800 mb-2">💡 วิธีแก้ไขปัญหา:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• ลดขนาดรูปภาพก่อนอัพโหลด (แนะนำ &lt; 2MB)</li>
            <li>• ใช้ไฟล์ประเภท JPEG, PNG, WebP หรือ GIF</li>
            <li>• ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</li>
            <li>• ลองรีโหลดหน้าเว็บแล้วลองใหม่</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default UploadImprovement
