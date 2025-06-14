'use client'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            ❌ Admin Panel Error
          </h1>
          <p className="text-gray-600">
            เกิดปัญหาในการโหลด Admin Panel
          </p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-700 font-mono">
            {error.message}
          </p>
          {error.digest && (
            <p className="text-xs text-red-500 mt-2">
              Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            🔄 ลองอีกครั้ง
          </button>
          
          <a
            href="/api/health"
            className="block w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-center"
          >
            🔍 ตรวจสอบสถานะระบบ
          </a>
          
          <a
            href="/"
            className="block w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-center"
          >
            🏠 กลับหน้าหลัก
          </a>
        </div>
        
        <div className="mt-6 text-xs text-gray-500">
          <p>หากปัญหายังคงอยู่ โปรดติดต่อ Administrator</p>
        </div>
      </div>
    </div>
  )
} 