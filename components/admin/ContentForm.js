'use client'

import { useState } from 'react'

function ContentRow({ item }) {
  const [value, setValue] = useState(item.value)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')

  async function handleSave() {
    setSaving(true)
    setStatus('')
    try {
      const response = await fetch(`/api/admin/content/${encodeURIComponent(item.key)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      })
      setStatus(response.ok ? 'Saved' : 'Failed to save')
    } catch {
      setStatus('Failed to save')
    } finally {
      setSaving(false)
      setTimeout(() => setStatus(''), 2000)
    }
  }

  return (
    <div className="space-y-1.5 rounded-xl border border-gray-200 bg-white p-4">
      <label htmlFor={item.key} className="block text-sm font-medium text-gray-700">
        {item.key}
      </label>
      <textarea
        id={item.key}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="min-h-9 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        {status ? <span className="text-xs text-gray-500">{status}</span> : null}
      </div>
    </div>
  )
}

export default function ContentForm({ items }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <ContentRow key={item.key} item={item} />
      ))}
    </div>
  )
}
