import type { Block } from 'payload'

export const QuoteRequestFormBlock: Block = {
  slug: 'quoteRequestFormBlock',
  labels: {
    singular: 'ฟอร์มขอใบเสนอราคา',
    plural: 'ฟอร์มขอใบเสนอราคา',
  },
  interfaceName: 'QuoteRequestFormBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'หัวข้อฟอร์ม',
      defaultValue: 'ขอใบเสนอราคา',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'คำอธิบาย',
      defaultValue: 'กรอกข้อมูลด้านล่างเพื่อขอใบเสนอราคาสินค้าจากเรา ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง',
    },
    {
      name: 'showInstructions',
      type: 'checkbox',
      label: 'แสดงคำแนะนำการใช้งาน',
      defaultValue: true,
    },
    {
      name: 'showContactInfo',
      type: 'checkbox',
      label: 'แสดงข้อมูลการติดต่อ',
      defaultValue: true,
    },
    {
      name: 'maxFiles',
      type: 'number',
      label: 'จำนวนไฟล์สูงสุดที่อัปโหลดได้',
      defaultValue: 3,
      min: 1,
      max: 10,
    },
    {
      name: 'maxFileSize',
      type: 'number',
      label: 'ขนาดไฟล์สูงสุด (MB)',
      defaultValue: 5,
      min: 1,
      max: 50,
    },
    {
      name: 'allowedFileTypes',
      type: 'select',
      label: 'ประเภทไฟล์ที่อนุญาต',
      hasMany: true,
      defaultValue: ['image', 'pdf', 'document'],
      options: [
        {
          label: 'รูปภาพ (JPG, PNG, GIF, WebP)',
          value: 'image',
        },
        {
          label: 'PDF',
          value: 'pdf',
        },
        {
          label: 'เอกสาร Word',
          value: 'document',
        },
      ],
    },
    {
      name: 'submitButtonText',
      type: 'text',
      label: 'ข้อความปุ่มส่ง',
      defaultValue: 'ส่งคำขอใบเสนอราคา',
    },
    {
      name: 'successMessage',
      type: 'textarea',
      label: 'ข้อความเมื่อส่งสำเร็จ',
      defaultValue: 'ขอบคุณสำหรับการส่งคำขอใบเสนอราคา ทีมงานของเราจะติดต่อกลับภายใน 24 ชั่วโมง',
    },
    {
      name: 'contactInfo',
      type: 'group',
      label: 'ข้อมูลการติดต่อ',
      admin: {
        condition: (data) => data.showContactInfo,
      },
      fields: [
        {
          name: 'phone',
          type: 'text',
          label: 'เบอร์โทรศัพท์',
          defaultValue: '02-434-8319',
        },
        {
          name: 'email',
          type: 'email',
          label: 'อีเมล',
          defaultValue: 'tadeyes1@gmail.com',
        },
        {
          name: 'lineId',
          type: 'text',
          label: 'Line ID',
          defaultValue: '@308aoxno',
        },
        {
          name: 'workingHours',
          type: 'text',
          label: 'เวลาทำการ',
          defaultValue: 'จันทร์-เสาร์ 7:00-17:30 น.',
        },
      ],
    },
  ],
} 