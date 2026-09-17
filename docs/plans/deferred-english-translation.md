# Deferred: English Translation

**Not scheduled.** Launch ships Spanish-only. This is the plan for turning that into a proper ES/EN site once it's scheduled as its own phase — kept here so Phases 0–5 don't need to guess at routing they don't need yet.

- `next-intl` with locale-prefixed routes: every active route gains an `/es` and `/en` version (`/es/sponsors`, `/en/sponsors`)
- Default locale detected from the browser, always switchable from a visible toggle
- `sponsors.story` and the `site_content` rows need a translated variant per locale — add `story_es`/`story_en` style columns (or a `locale` column + one row per locale) rather than rewriting the schema; sponsor names, logos, and `click_events` stay locale-independent
