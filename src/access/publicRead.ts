import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type isPublicRead = (args: AccessArgs<User>) => boolean

// Access control สำหรับการอ่านข้อมูลแบบ public
// - Admin ที่ login แล้วเข้าถึงได้หมด
// - คนทั่วไปไม่สามารถเข้าถึง API endpoint โดยตรงได้
// - ข้อมูลจะถูกเรียกใช้ผ่าน server-side rendering เท่านั้น
export const publicRead: isPublicRead = ({ req: { user } }) => {
  // ถ้าเป็น admin ที่ login แล้ว ให้เข้าถึงได้หมด
  if (user) {
    return true
  }

  // บล็อก direct API access ทั้งหมดสำหรับผู้ใช้ที่ไม่ได้ login
  // ข้อมูลจะถูกเรียกใช้ผ่าน server-side functions เท่านั้น
  return false
}
