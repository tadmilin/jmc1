import { getPayload, type Where } from 'payload'
import config from '@payload-config'

// Server-side function สำหรับดึงข้อมูลสินค้า
// ใช้เฉพาะใน server components หรือ API routes เท่านั้น
export async function getProducts(
  options: {
    limit?: number
    page?: number
    where?: Where
  } = {},
) {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'products',
      limit: options.limit || 10,
      page: options.page || 1,
      where: options.where,
      // เรียกข้อมูลโดยข้าม access control (เพราะเป็น internal call)
      overrideAccess: true,
    })

    return result
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

// Server-side function สำหรับดึงสินค้าเดี่ยว
export async function getProduct(slug: string) {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'products',
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
    console.error('Error fetching product:', error)
    throw error
  }
}
