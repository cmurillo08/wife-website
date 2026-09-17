import { notFound } from 'next/navigation'
import db from '../../../../../../lib/db.js'
import SponsorForm from '../../../../../../components/admin/SponsorForm.js'

export const dynamic = 'force-dynamic'

async function getSponsor(id) {
  const { rows } = await db.query('SELECT * FROM sponsors WHERE id = $1', [id])
  return rows[0] || null
}

export default async function EditSponsorPage({ params }) {
  const { id } = await params
  const sponsor = await getSponsor(id)
  if (!sponsor) notFound()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-primary">Edit {sponsor.name}</h1>
      <SponsorForm mode="edit" sponsor={sponsor} />
    </div>
  )
}
