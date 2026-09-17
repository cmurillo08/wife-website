# Build Progress

One row per phase. Update the **Status** column as work lands — this is the first thing to check at the start of a new session.

| Phase | Doc | Status | Notes |
|---|---|---|---|
| 0 — Environment | [phase-0-environment.md](phase-0-environment.md) | ✅ Done | Scaffold, lint/build/dev verified locally. Vercel project creation + first deploy deferred to whenever we're ready to actually launch — not blocking later phases. |
| 1 — Foundation & data model | [phase-1-foundation-data-model.md](phase-1-foundation-data-model.md) | ✅ Done | `lib/db.js`, migration + `scripts/migrate.js`/`scripts/seed.js` added, verified against local Postgres (`personal_projects` db, `alexa` schema). Neon `DATABASE_URL` still needs to be set for staging/prod. |
| 2 — Admin & auth | [phase-2-admin-auth.md](phase-2-admin-auth.md) | ⬜ Not started | |
| 3 — Public site | [phase-3-public-site.md](phase-3-public-site.md) | ⬜ Not started | |
| 4 — Referral click tracking | [phase-4-referral-click-tracking.md](phase-4-referral-click-tracking.md) | ⬜ Not started | |
| 5 — Disclosures & polish | [phase-5-disclosures-polish.md](phase-5-disclosures-polish.md) | ⬜ Not started | |
| — Media kit & social stats | [deferred-media-kit-social-stats.md](deferred-media-kit-social-stats.md) | 🚫 Deferred | Blocked on her IG/TikTok account setup. |
| — English translation | [deferred-english-translation.md](deferred-english-translation.md) | 🚫 Deferred | Its own phase once scheduled. |

## Status legend
- ⬜ Not started
- 🟡 In progress
- ✅ Done
- 🚫 Deferred (by design, not blocked on missing work)

## Starting a new session
1. Read this table to see the current phase.
2. Open that phase's doc for scope/details.
3. When a phase is finished, flip its row to ✅ and add a one-line note (what shipped, anything deferred within the phase).
