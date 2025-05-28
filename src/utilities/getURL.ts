import canUseDOM from './canUseDOM'

/**
 * Returns the server-side URL for the current environment
 */
export const getServerSideURL = (): string => {
  // ใน production บน Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // ใช้ NEXT_PUBLIC_SERVER_URL ถ้ามี
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL
  }

  // ใช้ SERVER_URL ถ้ามี (backward compatibility)
  if (process.env.SERVER_URL) {
    return process.env.SERVER_URL
  }

  // สำหรับ development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }

  // fallback
  return 'https://jmc111.vercel.app'
}

/**
 * Returns the client-side URL for the current environment
 */
export const getClientSideURL = (): string => {
  // ใน browser
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // fallback to server-side URL
  return getServerSideURL()
}
