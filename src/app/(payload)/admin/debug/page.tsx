import { getPayload } from 'payload'
import config from '@payload-config'

export default async function DebugPage() {
  try {
    const payload = await getPayload({ config })
    
    // ทดสอบการเชื่อมต่อ database
    const users = await payload.find({
      collection: 'users',
      limit: 1,
    })

    const products = await payload.find({
      collection: 'products',
      limit: 1,
    })

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">🔍 Payload CMS Debug Page</h1>
        
        <div className="space-y-4">
          <div className="bg-green-100 p-4 rounded">
            <h2 className="font-semibold text-green-800">✅ Payload CMS Status</h2>
            <p className="text-green-700">Payload CMS is working correctly!</p>
          </div>

          <div className="bg-blue-100 p-4 rounded">
            <h2 className="font-semibold text-blue-800">📊 Environment Info</h2>
            <ul className="text-blue-700 space-y-1">
              <li>Node Environment: {process.env.NODE_ENV}</li>
              <li>Server URL: {process.env.NEXT_PUBLIC_SERVER_URL}</li>
              <li>Database Connected: {process.env.DATABASE_URI ? '✅ Yes' : '❌ No'}</li>
              <li>Payload Secret: {process.env.PAYLOAD_SECRET ? '✅ Set' : '❌ Missing'}</li>
            </ul>
          </div>

          <div className="bg-yellow-100 p-4 rounded">
            <h2 className="font-semibold text-yellow-800">👥 Users Collection</h2>
            <p className="text-yellow-700">
              Total Users: {users.totalDocs}
            </p>
            {users.docs.length > 0 && (
              <p className="text-yellow-700">
                Latest User: {users.docs[0].email}
              </p>
            )}
          </div>

          <div className="bg-purple-100 p-4 rounded">
            <h2 className="font-semibold text-purple-800">🛍️ Products Collection</h2>
            <p className="text-purple-700">
              Total Products: {products.totalDocs}
            </p>
            {products.docs.length > 0 && (
              <p className="text-purple-700">
                Latest Product: {products.docs[0].title}
              </p>
            )}
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-semibold text-gray-800">🔗 Quick Links</h2>
            <ul className="text-gray-700 space-y-1">
              <li><a href="/admin" className="text-blue-600 hover:underline">Admin Panel</a></li>
              <li><a href="/api/users/me" className="text-blue-600 hover:underline">Current User API</a></li>
              <li><a href="/api/products" className="text-blue-600 hover:underline">Products API</a></li>
            </ul>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">❌ Debug Error</h1>
        <div className="bg-red-100 p-4 rounded">
          <h2 className="font-semibold text-red-800">Error Details:</h2>
          <pre className="text-red-700 text-sm mt-2 overflow-auto">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
        
        <div className="mt-4 bg-yellow-100 p-4 rounded">
          <h2 className="font-semibold text-yellow-800">Environment Check:</h2>
          <ul className="text-yellow-700 space-y-1">
            <li>Node Environment: {process.env.NODE_ENV}</li>
            <li>Server URL: {process.env.NEXT_PUBLIC_SERVER_URL || '❌ Not Set'}</li>
            <li>Database URI: {process.env.DATABASE_URI ? '✅ Set' : '❌ Missing'}</li>
            <li>Payload Secret: {process.env.PAYLOAD_SECRET ? '✅ Set' : '❌ Missing'}</li>
          </ul>
        </div>
      </div>
    )
  }
} 