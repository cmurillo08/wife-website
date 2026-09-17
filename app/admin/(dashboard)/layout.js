import Link from 'next/link'
import LogoutButton from '../../../components/admin/LogoutButton.js'

export default function AdminDashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/admin" className="text-primary hover:underline">
              Sponsors
            </Link>
            <Link href="/admin/content" className="text-primary hover:underline">
              Site copy
            </Link>
          </nav>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </div>
  )
}
