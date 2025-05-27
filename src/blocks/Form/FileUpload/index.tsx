'use client'
import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { X, Upload, File, Image } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface FileUploadProps {
  name: string
  label?: string
  required?: boolean
  width?: number
  maxFiles?: number
  acceptedFileTypes?: string[]
  maxFileSize?: number // in bytes
  onChange?: (files: File[]) => void
}

export const FileUpload: React.FC<FileUploadProps> = ({
  name,
  label = 'อัปโหลดไฟล์',
  required = false,
  width = 100,
  maxFiles = 3,
  acceptedFileTypes = ['image/*', '.pdf', '.doc', '.docx'],
  maxFileSize = 5 * 1024 * 1024, // 5MB
  onChange,
}) => {
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string>('')

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('')

    // Check for rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError(`ไฟล์มีขนาดใหญ่เกินไป (สูงสุด ${maxFileSize / 1024 / 1024}MB)`)
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('ประเภทไฟล์ไม่ถูกต้อง')
      }
      return
    }

    // Check total files limit
    const totalFiles = files.length + acceptedFiles.length
    if (totalFiles > maxFiles) {
      setError(`สามารถอัปโหลดได้สูงสุด ${maxFiles} ไฟล์`)
      return
    }

    const newFiles = [...files, ...acceptedFiles]
    setFiles(newFiles)
    onChange?.(newFiles)
  }, [files, maxFiles, maxFileSize, onChange])

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onChange?.(newFiles)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    maxSize: maxFileSize,
    disabled: files.length >= maxFiles,
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />
    }
    return <File className="h-4 w-4" />
  }

  return (
    <div className="space-y-4" style={{ width: `${width}%` }}>
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
          files.length >= maxFiles && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        {isDragActive ? (
          <p className="text-blue-600">วางไฟล์ที่นี่...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-1">
              ลากไฟล์มาวางที่นี่ หรือ <span className="text-blue-600">คลิกเพื่อเลือกไฟล์</span>
            </p>
            <p className="text-xs text-gray-500">
              รองรับ: รูปภาพ, PDF, Word ({maxFiles} ไฟล์สูงสุด, ไฟล์ละไม่เกิน {maxFileSize / 1024 / 1024}MB)
            </p>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">ไฟล์ที่เลือก ({files.length}/{maxFiles}):</p>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(file)}
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Required field error */}
      {required && files.length === 0 && (
        <div className="min-h-[24px]">
          <p className="text-red-500 text-sm">กรุณาอัปโหลดไฟล์</p>
        </div>
      )}
    </div>
  )
} 