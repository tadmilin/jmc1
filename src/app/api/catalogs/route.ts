import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET() {
  try {
    const catalogs = await payload.find({
      collection: 'catalogs',
      depth: 1,
      sort: '-createdAt',
    })

    return NextResponse.json(catalogs)
  } catch (error) {
    console.error('Error fetching catalogs:', error)
    return NextResponse.json({ error: 'Error fetching catalogs' }, { status: 500 })
  }
}
