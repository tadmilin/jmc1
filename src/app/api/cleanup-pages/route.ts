import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Page } from '@/payload-types'

export async function POST() {
  try {
    const payload = await getPayload({ config: configPromise })

    // ดึงข้อมูล Pages ทั้งหมด
    const pages = await payload.find({
      collection: 'pages',
      limit: 100,
    })

    // เก็บ Pages ที่จะลบ
    const pagesToDelete = pages.docs.filter((page: Page) => {
      // เก็บไว้เฉพาะ home และ quote-request
      return page.slug && !['home', 'quote-request'].includes(page.slug)
    })

    // ลบ Pages ที่ไม่ต้องการ
    for (const page of pagesToDelete) {
      await payload.delete({
        collection: 'pages',
        id: page.id,
      })
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Deleted ${pagesToDelete.length} pages`,
        deletedPages: pagesToDelete.map((p) => p.slug),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Error cleaning up pages:', error)

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'

    return new Response(
      JSON.stringify({
        success: false,
        message: errorMessage,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }
}
