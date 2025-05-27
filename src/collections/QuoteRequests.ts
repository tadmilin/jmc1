import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

export const QuoteRequests: CollectionConfig = {
  slug: 'quote-requests',
  admin: {
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'email', 'phone', 'status', 'createdAt'],
    group: 'ลูกค้า',
  },
  access: {
    create: () => true, // ใครก็สามารถส่งคำขอได้
    read: authenticated, // เฉพาะ admin อ่านได้
    update: authenticated, // เฉพาะ admin แก้ไขได้
    delete: authenticated, // เฉพาะ admin ลบได้
  },
  fields: [
    {
      name: 'customerName',
      type: 'text',
      label: 'ชื่อลูกค้า',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'email',
      type: 'email',
      label: 'อีเมล',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'เบอร์โทรศัพท์',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'สถานะ',
      options: [
        {
          label: '🆕 ใหม่',
          value: 'new',
        },
        {
          label: '👀 กำลังดำเนินการ',
          value: 'in-progress',
        },
        {
          label: '📋 ส่งใบเสนอราคาแล้ว',
          value: 'quoted',
        },
        {
          label: '✅ ปิดการขาย',
          value: 'closed-won',
        },
        {
          label: '❌ ยกเลิก',
          value: 'closed-lost',
        },
      ],
      defaultValue: 'new',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'priority',
      type: 'select',
      label: 'ความสำคัญ',
      options: [
        {
          label: '🔴 สูง',
          value: 'high',
        },
        {
          label: '🟡 ปานกลาง',
          value: 'medium',
        },
        {
          label: '🟢 ต่ำ',
          value: 'low',
        },
      ],
      defaultValue: 'medium',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      label: 'มอบหมายให้',
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'รายละเอียดคำขอ',
          fields: [
            {
              name: 'productList',
              type: 'textarea',
              label: 'รายการสินค้าและจำนวน',
              required: true,
              admin: {
                rows: 6,
              },
            },
            {
              name: 'additionalNotes',
              type: 'textarea',
              label: 'หมายเหตุเพิ่มเติม',
              admin: {
                rows: 4,
              },
            },
            {
              name: 'attachments',
              type: 'upload',
              relationTo: 'media',
              label: 'ไฟล์แนบ',
              hasMany: true,
              maxRows: 3,
              admin: {
                description: 'รูปภาพหรือเอกสารประกอบ (สูงสุด 3 ไฟล์)',
              },
            },
          ],
        },
        {
          label: 'การติดตาม',
          fields: [
            {
              name: 'followUpDate',
              type: 'date',
              label: 'วันที่ติดตาม',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'estimatedValue',
              type: 'number',
              label: 'มูลค่าประมาณการ (บาท)',
              admin: {
                step: 100,
              },
            },
            {
              name: 'quotedAmount',
              type: 'number',
              label: 'ราคาที่เสนอ (บาท)',
              admin: {
                step: 100,
                condition: (data) => data.status === 'quoted' || data.status === 'closed-won' || data.status === 'closed-lost',
              },
            },
            {
              name: 'notes',
              type: 'richText',
              label: 'บันทึกการติดตาม',
              admin: {
                description: 'บันทึกการสื่อสาร การประชุม หรือข้อมูลสำคัญอื่นๆ',
              },
            },
          ],
        },
        {
          label: 'เอกสาร',
          fields: [
            {
              name: 'quotationFile',
              type: 'upload',
              relationTo: 'media',
              label: 'ไฟล์ใบเสนอราคา',
              admin: {
                condition: (data) => data.status === 'quoted' || data.status === 'closed-won' || data.status === 'closed-lost',
              },
            },
            {
              name: 'contractFile',
              type: 'upload',
              relationTo: 'media',
              label: 'ไฟล์สัญญา',
              admin: {
                condition: (data) => data.status === 'closed-won',
              },
            },
            {
              name: 'relatedDocuments',
              type: 'upload',
              relationTo: 'media',
              label: 'เอกสารที่เกี่ยวข้อง',
              hasMany: true,
            },
          ],
        },
      ],
    },
    {
      name: 'source',
      type: 'select',
      label: 'แหล่งที่มา',
      options: [
        {
          label: 'เว็บไซต์',
          value: 'website',
        },
        {
          label: 'โทรศัพท์',
          value: 'phone',
        },
        {
          label: 'อีเมล',
          value: 'email',
        },
        {
          label: 'Line',
          value: 'line',
        },
        {
          label: 'Facebook',
          value: 'facebook',
        },
        {
          label: 'ลูกค้าแนะนำ',
          value: 'referral',
        },
        {
          label: 'อื่นๆ',
          value: 'other',
        },
      ],
      defaultValue: 'website',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // ตั้งค่า assignedTo เป็น user ปัจจุบันถ้าเป็นการสร้างใหม่และยังไม่มีการมอบหมาย
        if (operation === 'create' && !data.assignedTo) {
          // สามารถเพิ่ม logic เพื่อ assign ให้ user ที่เหมาะสมได้
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // ส่งการแจ้งเตือนเมื่อมีการเปลี่ยนแปลงสถานะ
        if (operation === 'update') {
          // สามารถเพิ่ม logic ส่งอีเมลแจ้งเตือนได้ที่นี่
          console.log(`Quote request ${doc.id} status changed to ${doc.status}`)
        }
      },
    ],
  },
  timestamps: true,
} 