# Phase 5: Disclosures & Polish

## Overview
Legal/trust details and a final pass before calling the site launch-ready.

## Disclosures
- A visible sponsored-content disclosure on every sponsor card and near any discount code — standard practice for affiliate/referral links, and something most brand legal teams check for
- A general `/privacy` page, since the site logs clicks and may run analytics
- If site analytics (Vercel Analytics / Plausible) sets any cookies, a lightweight consent notice depending on traffic source

## Mobile-First QA
Most traffic arrives from an Instagram bio link on a phone. Test at ~390px width first; treat desktop as the enhancement, not the baseline. Check specifically:
- Sponsor catalog cards don't overflow or need horizontal scroll
- Contact form is usable one-handed
- Tap targets (nav, CTAs, sponsor links) are large enough on a real phone, not just a resized browser

## Site Analytics (optional, not blocking)
Vercel Analytics or Plausible for aggregate traffic — separate from `click_events`, which is per-sponsor referral tracking only.

## Acceptance Criteria
- [ ] Disclosure copy appears on every sponsor card and anywhere a discount code is shown
- [ ] `/privacy` page exists and is linked from the site footer
- [ ] Full manual pass at ~390px on Home, Sponsors, About, Contact — no overflow, no broken layout
