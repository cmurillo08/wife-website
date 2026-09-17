# Deferred: Media Kit & Social Stats

**Not scheduled.** Held out of the current build because her Instagram and TikTok accounts aren't verified/set up for API access yet. Kept here so the design doesn't need to be redone when this phase resumes.

## Planned route
`/media-kit` — follower counts, engagement rate, audience breakdown, reach trend, top content, eventually a downloadable PDF for cold outreach.

## Data model
```sql
CREATE TABLE social_snapshots (
  id SERIAL PRIMARY KEY,
  platform TEXT CHECK (platform IN ('instagram','tiktok')),
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  followers INTEGER,
  engagement_rate NUMERIC,
  reach_30d INTEGER,
  top_post_ids TEXT[]
);
```
Same Neon database as everything else — no separate store needed.

## How the numbers would be pulled
Both platforms only need to authorize her own account, which avoids the heaviest parts of each platform's review process. Account verification (the blue badge) is unrelated to this and isn't required for either flow — the accounts just aren't set up yet either way.
- **Instagram** — needs a Business or Creator account connected to a Facebook Page. A Meta developer app with her account added as admin/tester can pull Insights via the Instagram Graph API in Development Mode, without full App Review.
- **TikTok** — her account registered as one of the (up to 10) sandbox test accounts gives the Display API access to follower count and video list without a full production audit. Free either way.

## When this resumes
A Vercel Cron Job pulls both platforms once or twice a day into `social_snapshots`; the media-kit page reads the latest cached snapshot, never a live call on page load. A manual-entry fallback (update numbers monthly via `/admin`) is a reasonable stand-in until the API side is worth wiring up.
