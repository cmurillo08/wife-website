# Phase 4: Referral Click Tracking

## Overview
Sponsor cards never link straight to the brand — they link to `/go/[slug]`, which logs the click and redirects. This is what lets your wife tell a sponsor "your link got N clicks" without any third-party analytics tool.

## What it does
`/go/[slug]` is a route handler, not a page:
1. Look up the sponsor by slug (via `lib/db.js`, same pattern as the rest of the site)
2. Insert a `click_events` row — slug, timestamp, `referrer` header, coarse `country` from Vercel's geo headers. No cookies, no PII.
3. 302 redirect to the sponsor's real `referral_url`

If the slug doesn't match an active sponsor, redirect to `/sponsors` instead of erroring.

## Reuse
Same `lib/db.js` from Phase 1 (adapted from `nuttiness/lib/db.js`). No new dependencies.

## Acceptance Criteria
- [ ] Visiting `/go/some-real-slug` redirects to that sponsor's `referral_url` and adds a row to `click_events`
- [ ] Visiting `/go/unknown-slug` redirects to `/sponsors` without erroring
- [ ] No cookies are set by this route
