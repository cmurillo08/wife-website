# Phase 3: Public Site

## Overview
Build the public-facing pages, reading content straight from Neon (populated via the Phase 2 admin). This is the first phase where a real visitor sees something beyond a starter page.

## Scope

### Included
- `/` (Home) — hero (photo/video + `site_content['home_hero_tagline']`), sponsor logo strip (active sponsors only), CTAs to `/sponsors` and `/contact`
- `/sponsors` — card grid, one card per active sponsor: logo, product photos, story, a link to `/go/[slug]` (never the raw `referral_url`), discount code if present, disclosure label (see Phase 5 for exact copy)
- `/about` — bio and career highlights from `site_content` rows
- `/contact` — contact form, submits via Resend (default choice; Formspree is a documented swap — see below)
- All pages: Server Components, querying `lib/db.js` directly (no client-side data fetching needed for this content)
- Mobile-first layout — see Phase 5 for the ~390px QA checklist; build to that baseline from the start, not as a retrofit

### Not Included
- `/media-kit` — deferred
- Locale switching — Spanish-only for now, deferred

## Contact Form
Default: **Resend**. `POST /api/contact` route handler validates the submission and sends an email via Resend to your wife's address. Swap path to Formspree if preferred: replace the route handler's send call with a Formspree endpoint POST; no schema or page changes needed either way.

## Environment Variables Added
```
RESEND_API_KEY=
CONTACT_EMAIL_TO=
```

## Acceptance Criteria
- [ ] Home renders hero + logo strip from live `sponsors`/`site_content` data
- [ ] `/sponsors` shows only `active = true` sponsors, each linking to `/go/[slug]` (Phase 4 makes that route functional)
- [ ] `/about` renders bio content editable from `/admin/content`
- [ ] Submitting the contact form sends an email and shows a success state; invalid input shows inline errors
- [ ] All four pages pass a manual check at ~390px width before any desktop-width check
