import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      label: 'โลโก้และข้อมูลบริษัท',
      type: 'group',
      admin: {
        description: 'ข้อมูลโลโก้และชื่อบริษัทที่จะแสดงใน Header',
      },
      fields: [
        {
          name: 'logoImage',
          label: 'รูปโลโก้',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'อัปโหลดรูปโลโก้ (ถ้าไม่ใส่จะใช้โลโก้เริ่มต้น)',
          },
        },
        {
          name: 'companyName',
          label: 'ชื่อบริษัท (ตัวใหญ่)',
          type: 'text',
          defaultValue: 'JMC',
          required: true,
        },
        {
          name: 'companySubtitle',
          label: 'ชื่อบริษัท (ตัวเล็ก)',
          type: 'text',
          defaultValue: 'จงมั่นคงค้าวัสดุ',
          required: true,
        },
        {
          name: 'logoBackgroundColor',
          label: 'สีพื้นหลังโลโก้',
          type: 'text',
          defaultValue: '#1E40AF',
          admin: {
            description: 'รหัสสี Hex สำหรับพื้นหลังโลโก้ (เช่น #1E40AF)',
          },
        },
        {
          name: 'companyNameColor',
          label: 'สีชื่อบริษัท',
          type: 'text',
          defaultValue: '#1E40AF',
          admin: {
            description: 'รหัสสี Hex สำหรับชื่อบริษัท (เช่น #1E40AF)',
          },
        },
      ],
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
