import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
    group: 'ผู้ใช้งาน',
  },
  auth: {
    depth: 2,
    lockTime: 600000, // 10 minutes
    maxLoginAttempts: 5,
    verify: false,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'ชื่อ-นามสกุล',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      label: 'บทบาท',
      options: [
        {
          label: 'ผู้ดูแลระบบ',
          value: 'admin',
        },
        {
          label: 'ผู้ใช้งาน',
          value: 'user',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
