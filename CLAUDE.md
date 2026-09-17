# CLAUDE.md — wife-website

## What this is
A sponsor/referral site for a cycling influencer: a sponsor catalog with tracked referral links, built by and for one family, run through Claude Code directly (no custom architect/backend/frontend agents like `nuttiness` uses — just the main session, one phase at a time).

## Stack
- Next.js (App Router), plain JavaScript, Tailwind CSS v4
- **Neon (Postgres) is the only backing store** — no external CMS. Sponsor content, editable page copy, and click events all live in the same database.
- Deployed on Vercel, default `*.vercel.app` URL (no custom domain)
- Admin at `/admin`, shared-credential login (see `docs/plans/phase-2-admin-auth.md`)

## Where things live
- `docs/plans/README.md` — **progress tracker**. Check this first in any new session to see which phase is current.
- `docs/plans/phase-0-environment.md` through `phase-5-disclosures-polish.md` — the build plan, in order. Each file is self-contained.
- `docs/plans/deferred-*.md` — designed but intentionally not scheduled (media kit/social stats is blocked on her social accounts; English translation is a later phase).
- `migrations/` — timestamped `.sql` files, one per schema change (convention borrowed from `nuttiness/migrations/`).
- `lib/db.js` — Postgres pool + query helpers, adapted from `nuttiness/lib/db.js`.

## Conventions
- No TypeScript, no Prettier — matches every sibling project in this workspace.
- Mobile-first: design and test at ~390px before desktop.
- Build one phase at a time, in order — each phase doc lists what's in scope and what isn't.

## If something is missing
- No phase doc for what you're being asked to build → check `docs/plans/` for a deferred doc first; if genuinely absent, ask before inventing scope.
- `DATABASE_URL` not set → nothing in Phase 1+ can run; this needs a real Neon connection string.
