# Phase 1: Foundation — Site Map & Data Model

## Overview
Define the site's routes and the Postgres schema that backs the whole site. Neon is the single data store for everything — sponsors, editable page copy, and click events. No external CMS.

## Site Map
| Route | Purpose | Key content |
|---|---|---|
| `/` | Home | Hero photo/video, one-line pitch, current sponsor logo strip, CTAs to Sponsors and Contact |
| `/sponsors` | Catalog | Card per brand: logo, product photos, story, referral link or discount code, disclosure label |
| `/about` | About | Bio, riding discipline, location, career highlights, ambassador titles |
| `/contact` | Booking | Contact form (Resend), direct email |
| `/go/[slug]` | Tracked redirect | Not a page — logs a click, then 302s to the sponsor's real referral URL |
| `/admin` | Admin (Phase 2) | Login-gated; CRUD for sponsors + editable site copy |

`/media-kit` and locale-prefixed routes (`/es`, `/en`) are out of scope — see the deferred docs.

## Data Model

### `sponsors`
```sql
CREATE TABLE sponsors (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,        -- used in /go/[slug]
  name TEXT NOT NULL,
  logo_url TEXT,
  category TEXT CHECK (category IN ('bike','apparel','gear','other')),
  active BOOLEAN NOT NULL DEFAULT true,
  since DATE,
  story TEXT,                        -- short collab description
  product_images TEXT[],             -- array of image URLs
  referral_url TEXT NOT NULL,         -- real destination, never shown directly
  discount_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `site_content`
Key-value store for editable page copy (Home hero tagline, About bio, etc.) so the admin can edit text without a code deploy.
```sql
CREATE TABLE site_content (
  key TEXT PRIMARY KEY,              -- e.g. 'home_hero_tagline', 'about_bio'
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `click_events`
```sql
CREATE TABLE click_events (
  id BIGSERIAL PRIMARY KEY,
  sponsor_slug TEXT NOT NULL REFERENCES sponsors(slug),
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  referrer TEXT,
  country TEXT                        -- from Vercel geo headers, no PII
);
CREATE INDEX idx_click_events_sponsor_slug ON click_events(sponsor_slug);
```

A `social_snapshots` table exists for the deferred media-kit phase — see `deferred-media-kit-social-stats.md`.

## Migrations
Follow `nuttiness/migrations/` naming: `migrations/YYYYMMDD_description.sql`, one file per schema change, applied in order. First migration: `migrations/<today>_create_phase1_tables.sql` containing all three `CREATE TABLE` statements above.

## `lib/db.js`
Adapt directly from `nuttiness/lib/db.js`: `pg` `Pool` using `DATABASE_URL`, optional `PGSCHEMA` validated via regex + `search_path`, slow-query logging (`DB_SLOW_QUERY_MS`, default 250ms), `query()`, `queryWith()`, and `runTransaction(fn)` helpers. No changes needed beyond copying it — the pattern is generic.

## Placeholder Assets
Sponsor logos and photos are real but not delivered by her yet. Build and seed with correctly-sized placeholder images (clearly marked as examples, e.g. a labeled gray box or stock cycling photo), stored the same way real assets will be (same `logo_url`/`product_images` columns), so swapping in real assets later is just an admin edit — no schema or code change.

## Acceptance Criteria
- [ ] Migration runs cleanly against a fresh Neon database
- [ ] `lib/db.js` connects successfully using `DATABASE_URL` with `PGSSLMODE=require`
- [ ] Seed script inserts 2–3 placeholder sponsors and a few `site_content` rows for manual testing in later phases
