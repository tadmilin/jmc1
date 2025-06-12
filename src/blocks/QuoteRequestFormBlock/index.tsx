import React from 'react'
import { QuoteRequestFormBlockComponent } from './Component'

interface QuoteRequestFormBlockProps {
  title?: string
  description?: string
  showInstructions?: boolean
  showContactInfo?: boolean
  maxFiles?: number
  maxFileSize?: number
  allowedFileTypes?: string[]
  submitButtonText?: string
  successMessage?: string
  contactInfo?: {
    phone?: string
    email?: string
    lineId?: string
    workingHours?: string
  }
}

export const QuoteRequestFormBlock: React.FC<QuoteRequestFormBlockProps> = (props) => {
  return <QuoteRequestFormBlockComponent {...props} />
}

export { QuoteRequestFormBlock as default } 