import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Media, Post, Product, Page, Category } from '@/payload-types'

export interface CustomItem {
  title: string
  description?: string
  image: string | Media
  linkType: 'internal' | 'external'
  internalLink?: {
    relationTo: 'pages' | 'posts'
    value: string | Page | Post
  }
  externalLink?: string
  buttonText?: string
}

export interface ContentGridBlockProps {
  title?: string
  subtitle?: DefaultTypedEditorState
  contentType?: 'custom' | 'posts' | 'products'
  customItems?: CustomItem[]
  categories?: (string | Category)[]
  limit?: number
  columns?: 'auto' | '2' | '3' | '4'
  showMoreButton?: boolean
  moreButtonText?: string
  moreButtonLink?: {
    relationTo: 'pages' | 'posts'
    value: string | Page | Post
  }
}

export interface ContentItem {
  id: string
  title: string
  description?: string
  image?: string | Media
  url: string
  buttonText: string
}

export interface ApiResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ContentCardProps {
  item: ContentItem
}
