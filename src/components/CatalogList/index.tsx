import React from 'react'
import { useCatalogs } from '../../hooks/useCatalogs'
import { ICatalog } from '../../collections/Catalogs'
import { CatalogCard } from './CatalogCard'
import styles from './CatalogList.module.css'

export const CatalogList: React.FC = () => {
  const { data: catalogs, isLoading, error } = useCatalogs()

  if (isLoading) {
    return <div className={styles.loading}>กำลังโหลด...</div>
  }

  if (error) {
    return <div className={styles.error}>เกิดข้อผิดพลาดในการโหลดข้อมูล</div>
  }

  if (!catalogs?.length) {
    return <div className={styles.empty}>ไม่พบแคตตาล็อก</div>
  }

  return (
    <div className={styles.grid}>
      {catalogs.map((catalog: ICatalog) => (
        <CatalogCard key={catalog.id} catalog={catalog} />
      ))}
    </div>
  )
}
