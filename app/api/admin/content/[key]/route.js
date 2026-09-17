import { NextResponse } from 'next/server'
import db from '../../../../../lib/db.js'

export async function PUT(req, { params }) {
  const { key } = await params

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const value = typeof body?.value === 'string' ? body.value : ''

  const { rows } = await db.query(
    `INSERT INTO site_content (key, value)
     VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
     RETURNING *`,
    [key, value]
  )

  return NextResponse.json(rows[0])
}
