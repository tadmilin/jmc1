import Link from 'next/link'

// เพิ่ม Local SEO link ในหน้า Contact
const LocalSEOSection = () => (
  <div className="bg-blue-50 p-6 rounded-lg mt-8">
    <h3 className="text-xl font-bold text-gray-900 mb-4">🔍 ร้านวัสดุก่อสร้าง ใกล้ฉัน ตลิ่งชัน</h3>
    <p className="text-gray-700 mb-4">
      หากคุณกำลังมองหาร้านวัสดุก่อสร้าง ใกล้ฉัน ตลิ่งชัน ปากซอยชักพระ6 เรามีวัสดุครบครัน ราคาถูก
      ส่งฟรี
    </p>
    <Link
      href="/construction-materials-near-me"
      className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
    >
      📍 ดูข้อมูลร้านวัสดุก่อสร้าง ใกล้ฉัน →
    </Link>
  </div>
)
