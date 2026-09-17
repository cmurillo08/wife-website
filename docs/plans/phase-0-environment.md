# Phase 0: Environment — Project Scaffold

## Overview
Stand up the Next.js project skeleton and Vercel deployment target. No product features yet — this phase only needs to produce a running, deployed "hello world" that later phases build on.

Base reference: `nuttiness` (the sibling project in this workspace already running this exact stack in production on Neon + Vercel). Do not use `business-project-template` — it's an earlier, less battle-tested scaffold.

## Scope

### Included
- `create-next-app` scaffold, App Router, plain JavaScript (no TypeScript — matches every sibling project)
- Tailwind CSS v4 via `@tailwindcss/postcss`
- ESLint flat config (`eslint.config.mjs`) extending `next/core-web-vitals`
- `.nvmrc` pinned to `24` (matches `nuttiness`)
- `package.json` with `"type": "module"`, scripts: `dev`, `build`, `start`, `lint`
- `.env.example` (placeholders only, no real secrets)
- Vercel project created, linked to this repo, first deploy succeeds on the default `*.vercel.app` URL (no custom domain)

### Not Included
- Any actual pages/routes beyond the default Next.js starter page
- Database connection, auth, or CMS — those are later phases
- TypeScript, Prettier — neither is used in any sibling project

## package.json target shape
```json
{
  "name": "wife-website",
  "version": "0.1.0",
  "type": "module",
  "private": true,
  "engines": { "node": "24.x" },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint ."
  },
  "dependencies": {
    "next": "^15.5.14",
    "pg": "^8.11.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.2.2",
    "autoprefixer": "^10.4.27",
    "dotenv": "^16.1.4",
    "eslint": "9.39.4",
    "eslint-config-next": "16.2.2",
    "postcss": "^8.5.8",
    "tailwindcss": "^4.2.2"
  }
}
```
`pg` is included from the start even though Phase 0 doesn't use it — Phase 1 needs it immediately after.

## .env.example (shape from nuttiness/.env.example)
```
# PostgreSQL connection (Neon)
DATABASE_URL=

# Optional: SSL mode. Neon requires SSL.
PGSSLMODE=require

NODE_ENV=development

# Authentication (added in Phase 2 — placeholders here so the file is complete from the start)
APP_USERNAME=
APP_PASSWORD=
SESSION_SECRET=

# Contact form (added in Phase 3)
RESEND_API_KEY=
```

## Vercel setup steps (manual, for you)
1. Create a new Vercel project, import the `wife-website` git repo.
2. Do not attach a custom domain — ship on the default `*.vercel.app` URL.
3. Environment variables get added incrementally as each phase introduces them (Phase 1 adds `DATABASE_URL`, Phase 2 adds the auth vars, Phase 3 adds `RESEND_API_KEY`).

## Acceptance Criteria
- [x] `npm run dev` serves the default Next.js starter page locally
- [x] `npm run lint` passes with no errors
- [x] `npm run build` succeeds
- [ ] Vercel deploy succeeds and the default page loads at the `*.vercel.app` URL
