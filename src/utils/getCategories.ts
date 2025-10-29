import { getPayload, type Where } from 'payload'
import config from '@payload-config'

// Server-side function สำหรับดึงข้อมูล Categories
export async function getCategories(
  options: {
    limit?: number
    page?: number
    where?: Where
  } = {},
) {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'categories',
      limit: options.limit || 20,
      page: options.page || 1,
      where: options.where,
      sort: 'sortOrder',
      // เรียกข้อมูลโดยข้าม access control (เพราะเป็น internal call)
      overrideAccess: true,
    })

    return result
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

// Server-side function สำหรับดึง Category เดี่ยว
export async function getCategory(slug: string) {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'categories',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      // เรียกข้อมูลโดยข้าม access control (เพราะเป็น internal call)
      overrideAccess: true,
    })

    return result.docs[0] || null
  } catch (error) {
    console.error('Error fetching category:', error)
    throw error
  }
}
