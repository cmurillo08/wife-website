import Link from 'next/link'
import db from '../../../lib/db.js'

export const dynamic = 'force-dynamic'

async function getSponsors() {
  const { rows } = await db.query('SELECT * FROM sponsors ORDER BY created_at DESC')
  return rows
}

export default async function AdminSponsorsPage() {
  const sponsors = await getSponsors()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-primary">Sponsors</h1>
        <Link
          href="/admin/sponsors/new"
          className="min-h-9 rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          + New sponsor
        </Link>
      </div>

      {sponsors.length === 0 ? (
        <p className="text-sm text-gray-500">No sponsors yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
          {sponsors.map((sponsor) => (
            <li key={sponsor.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-gray-900">{sponsor.name}</p>
                <p className="truncate text-xs text-gray-500">
                  {sponsor.category || 'uncategorized'} · /go/{sponsor.slug}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    sponsor.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {sponsor.active ? 'Active' : 'Inactive'}
                </span>
                <Link
                  href={`/admin/sponsors/${sponsor.id}/edit`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
