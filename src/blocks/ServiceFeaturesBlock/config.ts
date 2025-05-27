import type { Block } from 'payload'

export const ServiceFeaturesBlock: Block = {
  slug: 'serviceFeatures',
  labels: {
    singular: 'คุณสมบัติบริการ',
    plural: 'คุณสมบัติบริการ',
  },
  interfaceName: 'ServiceFeaturesBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'หัวข้อหลัก',
      defaultValue: 'บริการของเรา',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'คำอธิบาย',
    },
    {
      name: 'style',
      type: 'select',
      label: 'รูปแบบการแสดงผล',
      defaultValue: 'modern',
      options: [
        {
          label: 'โมเดิร์น',
          value: 'modern',
        },
        {
          label: 'คลาสสิค',
          value: 'classic',
        },
        {
          label: 'การ์ด',
          value: 'card',
        },
        {
          label: 'มินิมอล',
          value: 'minimal',
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'สีพื้นหลัง',
      defaultValue: 'white',
      options: [
        {
          label: 'ขาว',
          value: 'white',
        },
        {
          label: 'เทาอ่อน',
          value: 'light',
        },
        {
          label: 'สีฟ้าอ่อน',
          value: 'blue',
        },
        {
          label: 'ไล่ระดับ',
          value: 'gradient',
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: 'รายการบริการ',
      minRows: 1,
      maxRows: 6,
      defaultValue: [
        {
          title: 'CLICK & COLLECT',
          description: 'รับสินค้าด้วยตนเอง ทุกสาขาทั่วไทย',
          iconType: 'cart',
        },
        {
          title: 'CALL CENTER',
          description: 'สามารถติดต่อได้ที่ 1160',
          iconType: 'phone',
        },
        {
          title: 'SECURE PAYMENT',
          description: 'มั่นใจในระบบการชำระเงินที่ปลอดภัย',
          iconType: 'lock',
        },
        {
          title: 'DELIVERY SERVICE',
          description: 'บริการส่งสินค้าทั่วไทย',
          iconType: 'truck',
        },
        {
          title: 'EASY RETURN',
          description: 'เปลี่ยน-คืนสินค้าง่ายภายใน 30 วัน',
          iconType: 'return',
        },
      ],
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'หัวข้อ',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          label: 'รายละเอียด',
        },
        {
          name: 'iconType',
          type: 'select',
          label: 'ไอคอน',
          options: [
            {
              label: 'รถเข็นช้อปปิ้ง',
              value: 'cart',
            },
            {
              label: 'โทรศัพท์',
              value: 'phone',
            },
            {
              label: 'กุญแจล็อค',
              value: 'lock',
            },
            {
              label: 'รถส่งของ',
              value: 'truck',
            },
            {
              label: 'การคืนสินค้า',
              value: 'return',
            },
            {
              label: 'เงิน',
              value: 'money',
            },
            {
              label: 'ของขวัญ',
              value: 'gift',
            },
            {
              label: 'ตั๋ว',
              value: 'ticket',
            },
            {
              label: 'สาขา',
              value: 'location',
            },
            {
              label: 'เช็คเครื่องหมายถูก',
              value: 'check',
            },
          ],
        },
        {
          name: 'customIcon',
          type: 'upload',
          label: 'อัพโหลดไอคอนเอง (ถ้ามี)',
          relationTo: 'media',
          admin: {
            description: 'ถ้าอัพโหลดไอคอนเอง จะใช้ไอคอนนี้แทนไอคอนที่เลือกข้างบน',
          },
        },
      ],
    },
    {
      name: 'animation',
      type: 'select',
      label: 'ลูกเล่นเคลื่อนไหว',
      defaultValue: 'none',
      options: [
        {
          label: 'ไม่มี',
          value: 'none',
        },
        {
          label: 'เฟดอิน',
          value: 'fade',
        },
        {
          label: 'สไลด์ขึ้น',
          value: 'slideUp',
        },
        {
          label: 'สไลด์จากซ้าย',
          value: 'slideLeft',
        },
        {
          label: 'บาวน์ซ์',
          value: 'bounce',
        },
      ],
    },
  ],
} 