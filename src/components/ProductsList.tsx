import { getProducts } from '@/utils/getProducts'
import type { Product } from '@/payload-types'

// Server Component สำหรับแสดงรายการสินค้า
// ทำงานใน server-side เท่านั้น ไม่สามารถเรียกจาก client ได้
export default async function ProductsList() {
  try {
    const products = await getProducts({
      limit: 12,
      page: 1,
    })

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.docs.map((product: Product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-lg">{product.title}</h3>
            {product.shortDescription && (
              <p className="text-gray-600 text-sm mt-2">{product.shortDescription}</p>
            )}
            {product.price && (
              <p className="text-lg font-bold text-blue-600 mt-3">
                ฿{product.price.toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>
    )
  } catch (error) {
    console.error('Error loading products:', error)
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">ไม่สามารถโหลดข้อมูลสินค้าได้</p>
      </div>
    )
  }
}
