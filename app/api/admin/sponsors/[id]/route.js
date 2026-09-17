import { NextResponse } from 'next/server'
import db from '../../../../../lib/db.js'

function normalizeSponsorInput(body) {
  return {
    name: typeof body?.name === 'string' ? body.name.trim() : '',
    slug: typeof body?.slug === 'string' ? body.slug.trim() : '',
    logo_url: body?.logo_url || null,
    category: body?.category || null,
    since: body?.since || null,
    story: body?.story || null,
    product_images: Array.isArray(body?.product_images) ? body.product_images : [],
    referral_url: typeof body?.referral_url === 'string' ? body.referral_url.trim() : '',
    discount_code: body?.discount_code || null,
    active: body?.active !== false,
  }
}

export async function PUT(req, { params }) {
  const { id } = await params

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const sponsor = normalizeSponsorInput(body)

  if (!sponsor.name || !sponsor.slug || !sponsor.referral_url) {
    return NextResponse.json({ error: 'name, slug, and referral_url are required' }, { status: 400 })
  }

  try {
    const { rows } = await db.query(
      `UPDATE sponsors
       SET slug = $1, name = $2, logo_url = $3, category = $4, since = $5, story = $6,
           product_images = $7, referral_url = $8, discount_code = $9, active = $10, updated_at = now()
       WHERE id = $11
       RETURNING *`,
      [
        sponsor.slug,
        sponsor.name,
        sponsor.logo_url,
        sponsor.category,
        sponsor.since,
        sponsor.story,
        sponsor.product_images,
        sponsor.referral_url,
        sponsor.discount_code,
        sponsor.active,
        id,
      ]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (err) {
    if (err.code === '23505') {
      return NextResponse.json({ error: 'A sponsor with this slug already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to update sponsor' }, { status: 500 })
  }
}
