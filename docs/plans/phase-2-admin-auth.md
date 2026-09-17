# Phase 2: Admin & Auth

## Overview
A small `/admin` area so your wife can manage sponsor entries and page copy herself, with no third-party CMS. Auth is a single shared credential pair (adapted from `nuttiness/docs/plans/phase-9-authentication.md`) — this protects **only** `/admin` and `/api/admin/**`; the public site (`/`, `/sponsors`, `/about`, `/contact`, `/go/[slug]`) stays open to visitors, unlike `nuttiness` where the whole app is gated.

## Scope

### Included
- `/admin/login` — username + password form
- `POST /api/admin/auth/login` — validates credentials, issues a session cookie
- `POST /api/admin/auth/logout` — clears the session cookie
- `middleware.js` — gates `/admin/**` and `/api/admin/**` only (matcher scoped, not global like `nuttiness`)
- `/admin` — sponsor list (all sponsors, active/inactive), links to create/edit
- `/admin/sponsors/new`, `/admin/sponsors/[id]/edit` — sponsor form (name, slug, logo upload, category, story, product images, referral URL, discount code, active toggle)
- `/admin/content` — edit `site_content` rows (Home hero tagline, About bio, etc.) as a simple key → textarea list
- Image upload wiring: sponsor logo / product photos uploaded via the admin form to Vercel Blob, URL stored in `sponsors.logo_url` / `product_images`

### Not Included
- Database users table, roles/permissions — single shared credential, same as `nuttiness`
- Password reset flow, OAuth, magic links
- Bulk import/export

## Auth Design (adapted from nuttiness phase-9)
- Credentials in `.env`: `APP_USERNAME`, `APP_PASSWORD`, `SESSION_SECRET` — no DB users table
- `POST /api/admin/auth/login`: validates against `process.env.APP_USERNAME`/`APP_PASSWORD` using `crypto.timingSafeEqual`; on success sets an HTTP-only, `SameSite=Lax`, `Secure`-in-production cookie (e.g. `wifesite_admin_session`) containing an HMAC-signed token (`SESSION_SECRET`, Node `crypto.createHmac('sha256', …)`)
- `middleware.js` matcher: `['/admin/:path*', '/api/admin/:path*']` — excludes `/admin/login` and `/api/admin/auth/login` themselves. Verifies the HMAC signature; redirects to `/admin/login` if missing/invalid
- Use Web Crypto (`globalThis.crypto.subtle`) in middleware (Edge runtime); Node `crypto` in API routes (Node runtime) — same split as `nuttiness`

## Image Upload
Default: **Vercel Blob** (same platform as hosting, simplest setup — one token, no separate account). Cloudinary remains a documented fallback if Blob's free tier or transformation needs don't fit later. Upload happens from the admin form via a server action or route handler that stores the file and writes the resulting URL to the `sponsors` row.

## Environment Variables Added
```
APP_USERNAME=
APP_PASSWORD=
SESSION_SECRET=
BLOB_READ_WRITE_TOKEN=
```

## Acceptance Criteria
- [ ] Visiting `/admin` while unauthenticated redirects to `/admin/login`; the public site is unaffected
- [ ] Correct credentials log in and land on `/admin`; incorrect credentials show an inline error, no cookie set
- [ ] Creating/editing a sponsor in `/admin/sponsors` writes to the `sponsors` table and is immediately reflected on `/sponsors` (Phase 3)
- [ ] Uploading a logo/product image stores it in Blob and saves the URL on the sponsor row
- [ ] Editing a `site_content` row updates the corresponding public-page text
- [ ] Logout clears the session cookie and redirects to `/admin/login`
