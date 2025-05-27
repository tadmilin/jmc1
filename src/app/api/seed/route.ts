import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { seed } from '@/endpoints/seed'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    await seed({
      payload,
      req: {
        payload,
        user: null,
      } as any,
    })

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Seed API endpoint. Use POST to seed the database.' },
    { status: 200 }
  )
} 