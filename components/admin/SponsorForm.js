'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['bike', 'apparel', 'gear', 'other']

async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  const response = await fetch('/api/admin/upload', { method: 'POST', body: formData })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error || 'Upload failed')
  }
  const body = await response.json()
  return body.url
}

export default function SponsorForm({ mode, sponsor }) {
  const router = useRouter()
  const [name, setName] = useState(sponsor?.name || '')
  const [slug, setSlug] = useState(sponsor?.slug || '')
  const [category, setCategory] = useState(sponsor?.category || 'bike')
  const [since, setSince] = useState(sponsor?.since ? sponsor.since.slice(0, 10) : '')
  const [story, setStory] = useState(sponsor?.story || '')
  const [referralUrl, setReferralUrl] = useState(sponsor?.referral_url || '')
  const [discountCode, setDiscountCode] = useState(sponsor?.discount_code || '')
  const [active, setActive] = useState(sponsor?.active ?? true)
  const [logoUrl, setLogoUrl] = useState(sponsor?.logo_url || '')
  const [productImages, setProductImages] = useState(sponsor?.product_images || [])

  const [logoUploading, setLogoUploading] = useState(false)
  const [productUploading, setProductUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleLogoChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setError('')
    setLogoUploading(true)
    try {
      const url = await uploadFile(file)
      setLogoUrl(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setLogoUploading(false)
      event.target.value = ''
    }
  }

  async function handleProductImagesChange(event) {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return
    setError('')
    setProductUploading(true)
    try {
      const urls = await Promise.all(files.map(uploadFile))
      setProductImages((prev) => [...prev, ...urls])
    } catch (err) {
      setError(err.message)
    } finally {
      setProductUploading(false)
      event.target.value = ''
    }
  }

  function removeProductImage(index) {
    setProductImages((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)

    const payload = {
      name,
      slug,
      category,
      since: since || null,
      story,
      referral_url: referralUrl,
      discount_code: discountCode || null,
      active,
      logo_url: logoUrl || null,
      product_images: productImages,
    }

    try {
      const url = mode === 'create' ? '/api/admin/sponsors' : `/api/admin/sponsors/${sponsor.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        setError(body.error || 'Failed to save sponsor')
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Failed to save sponsor')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="min-h-11 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            Slug <span className="font-normal text-gray-400">(used in /go/slug)</span>
          </label>
          <input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            pattern="[a-z0-9-]+"
            title="lowercase letters, numbers, hyphens only"
            className="min-h-11 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="min-h-11 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="since" className="block text-sm font-medium text-gray-700">
            Sponsor since
          </label>
          <input
            id="since"
            type="date"
            value={since}
            onChange={(e) => setSince(e.target.value)}
            className="min-h-11 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="referral_url" className="block text-sm font-medium text-gray-700">
            Referral URL
          </label>
          <input
            id="referral_url"
            type="url"
            value={referralUrl}
            onChange={(e) => setReferralUrl(e.target.value)}
            required
            className="min-h-11 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="discount_code" className="block text-sm font-medium text-gray-700">
            Discount code
          </label>
          <input
            id="discount_code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            className="min-h-11 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="story" className="block text-sm font-medium text-gray-700">
          Story
        </label>
        <textarea
          id="story"
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        Active (visible on the public site)
      </label>

      <div className="space-y-1.5">
        <span className="block text-sm font-medium text-gray-700">Logo</span>
        <div className="flex items-center gap-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="h-16 w-16 rounded-lg border border-gray-200 object-cover" />
          ) : null}
          <input type="file" accept="image/*" onChange={handleLogoChange} disabled={logoUploading} />
          {logoUploading ? <span className="text-xs text-gray-500">Uploading…</span> : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <span className="block text-sm font-medium text-gray-700">Product images</span>
        {productImages.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {productImages.map((url, index) => (
              <div key={url + index} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-20 w-20 rounded-lg border border-gray-200 object-cover" />
                <button
                  type="button"
                  onClick={() => removeProductImage(index)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs text-gray-600 shadow"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : null}
        <input type="file" accept="image/*" multiple onChange={handleProductImagesChange} disabled={productUploading} />
        {productUploading ? <span className="text-xs text-gray-500">Uploading…</span> : null}
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={saving || logoUploading || productUploading}
        className="min-h-11 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? 'Saving…' : mode === 'create' ? 'Create sponsor' : 'Save changes'}
      </button>
    </form>
  )
}
