import type { Media } from '@/payload-types'

export const imageHero1: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: 'Straight metallic shapes with a blue gradient',
  filename: 'hero-image-1.jpg',
  mimeType: 'image/jpeg',
  url: '/media/hero-image-1.jpg',
  sizes: {
    thumbnail: {
      filename: 'hero-image-1-thumbnail.jpg',
      width: 400,
      height: 300,
      mimeType: 'image/jpeg',
      url: '/media/hero-image-1-thumbnail.jpg',
    },
    card: {
      filename: 'hero-image-1-card.jpg',
      width: 768,
      height: 576,
      mimeType: 'image/jpeg',
      url: '/media/hero-image-1-card.jpg',
    },
    feature: {
      filename: 'hero-image-1-feature.jpg',
      width: 1024,
      height: 768,
      mimeType: 'image/jpeg',
      url: '/media/hero-image-1-feature.jpg',
    }
  }
}
