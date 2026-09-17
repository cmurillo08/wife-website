import db from '../../../../lib/db.js'
import ContentForm from '../../../../components/admin/ContentForm.js'

export const dynamic = 'force-dynamic'

async function getSiteContent() {
  const { rows } = await db.query('SELECT * FROM site_content ORDER BY key ASC')
  return rows
}

export default async function AdminContentPage() {
  const items = await getSiteContent()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-primary">Site copy</h1>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No content rows yet.</p>
      ) : (
        <ContentForm items={items} />
      )}
    </div>
  )
}
