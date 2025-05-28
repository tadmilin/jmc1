'use client'

import { useEffect, useState } from 'react'

export default function AdminPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ทดสอบการโหลด Payload Admin
    const loadAdmin = async () => {
      try {
        // ตรวจสอบว่า Payload Admin โหลดได้หรือไม่
        const response = await fetch('/api/health')
        if (!response.ok) {
          throw new Error('Server not responding')
        }

        // Redirect ไปยัง Payload Admin ที่แท้จริง
        window.location.href = '/admin'
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadAdmin()
  }, [])

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '20px' }}>
          🔄 กำลังโหลด JMC Admin Panel...
        </div>
        <div style={{ fontSize: '16px', color: '#666' }}>กรุณารอสักครู่</div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontFamily: 'Arial, sans-serif',
          padding: '20px',
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '20px', color: 'red' }}>
          ❌ เกิดข้อผิดพลาด
        </div>
        <div style={{ fontSize: '16px', marginBottom: '20px' }}>{error}</div>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007cba',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          ลองใหม่
        </button>
      </div>
    )
  }

  return null
}
