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

## Vercel Blob setup steps (manual, for you)
1. Vercel dashboard → the `wife-website` project → **Storage** tab.
2. **Create Database** → **Blob** → name it (e.g. `wife-website-images`) → create.
3. Accept the prompt to connect it to the project — this auto-adds `BLOB_READ_WRITE_TOKEN` to the project's Production (and usually Preview) environment variables. No manual entry needed there.
4. For local dev, that auto-injection doesn't reach your machine: open the Blob store's settings, reveal/copy the token, and paste it into your local `.env` as `BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...`. (Or, if the Vercel CLI is linked to this project, `vercel env pull` pulls it along with everything else.)
5. Restart `npm run dev` after adding it locally.

Until this is set, `/api/admin/upload` returns a 500 with "Image upload is not configured (BLOB_READ_WRITE_TOKEN missing)" — everything else in this phase works without it. The token is server-side only (used inside the API route), never exposed to the browser.

## Environment Variables Added
```
APP_USERNAME=
APP_PASSWORD=
SESSION_SECRET=
BLOB_READ_WRITE_TOKEN=
```

## Acceptance Criteria
- [x] Visiting `/admin` while unauthenticated redirects to `/admin/login`; the public site is unaffected
- [x] Correct credentials log in and land on `/admin`; incorrect credentials show an inline error, no cookie set
- [x] Creating/editing a sponsor in `/admin/sponsors` writes to the `sponsors` table (reflecting on `/sponsors` itself is Phase 3, not built yet)
- [ ] Uploading a logo/product image stores it in Blob and saves the URL on the sponsor row — code is in place, unverified until `BLOB_READ_WRITE_TOKEN` is set (see setup steps above)
- [x] Editing a `site_content` row updates the row (reflecting on public pages is Phase 3, not built yet)
- [x] Logout clears the session cookie and redirects to `/admin/login`
