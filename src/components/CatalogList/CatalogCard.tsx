import React from 'react'
import Image from 'next/image'
import type { Catalog, Media } from '@/payload-types'
import styles from './CatalogCard.module.css'

interface Props {
  catalog: Catalog
}

const getMediaDetails = (field: string | Media) => {
  if (typeof field === 'string') return null
  return {
    filename: field.filename || '',
    alt: field.alt || '',
    width: field.width || 0,
    height: field.height || 0,
  }
}

export const CatalogCard: React.FC<Props> = ({ catalog }) => {
  const { name, description, category, thumbnailImage, pdfFile } = catalog
  const imageDetails = getMediaDetails(thumbnailImage)
  const pdfDetails = getMediaDetails(pdfFile)

  if (!imageDetails || !pdfDetails) return null

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}/media/${imageDetails.filename}`}
          alt={imageDetails.alt || name}
          width={imageDetails.width || 300}
          height={imageDetails.height || 200}
          className={styles.image}
          priority={false}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{name}</h3>
        {category && <span className={styles.category}>{category}</span>}
        {description && <p className={styles.description}>{description}</p>}
        <a
          href={`${process.env.NEXT_PUBLIC_SERVER_URL}/media/${pdfDetails.filename}`}
          className={styles.button}
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          ดาวน์โหลด PDF
        </a>
      </div>
    </div>
  )
}
