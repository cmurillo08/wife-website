-- Phase 1: Foundation & data model
-- sponsors, site_content, click_events

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

CREATE TABLE site_content (
  key TEXT PRIMARY KEY,              -- e.g. 'home_hero_tagline', 'about_bio'
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE click_events (
  id BIGSERIAL PRIMARY KEY,
  sponsor_slug TEXT NOT NULL REFERENCES sponsors(slug),
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  referrer TEXT,
  country TEXT                        -- from Vercel geo headers, no PII
);
CREATE INDEX idx_click_events_sponsor_slug ON click_events(sponsor_slug);
