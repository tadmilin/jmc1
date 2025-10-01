import React from 'react'
import Image from 'next/image'
import { ICatalog } from '../../collections/Catalogs'
import styles from './CatalogCard.module.css'

interface Props {
  catalog: ICatalog
}

export const CatalogCard: React.FC<Props> = ({ catalog }) => {
  const { name, description, category, thumbnailImage, pdfFile } = catalog

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}/media/${thumbnailImage.filename}`}
          alt={thumbnailImage.alt || name}
          width={thumbnailImage.width}
          height={thumbnailImage.height}
          className={styles.image}
          priority={false}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{name}</h3>
        {category && <span className={styles.category}>{category}</span>}
        {description && <p className={styles.description}>{description}</p>}
        <a
          href={`${process.env.NEXT_PUBLIC_SERVER_URL}/media/${pdfFile.filename}`}
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
