export const dynamic = 'force-dynamic'

export default function DebugPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Payload CMS Debug</h1>
      <p>Visit <a href="/api/health" className="text-blue-600 hover:underline">/api/health</a> for system status.</p>
      <div className="mt-4 bg-blue-100 p-4 rounded">
        <h2 className="font-semibold text-blue-800">Quick Links</h2>
        <ul className="text-blue-700 space-y-1 mt-2">
          <li><a href="/admin" className="hover:underline">Admin Panel</a></li>
          <li><a href="/api/health" className="hover:underline">Health Check</a></li>
          <li><a href="/api/public/products" className="hover:underline">Products API</a></li>
        </ul>
      </div>
    </div>
  )
}