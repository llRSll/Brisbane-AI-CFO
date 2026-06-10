# Live build starter

Minimal Next.js app for on-stage live coding. **Connectors only** — Supabase,
OpenAI, Vercel, and GitHub are wired. Every feature is built live using the
prompts in [BUILD_SCRIPT.md](./BUILD_SCRIPT.md).

## What's wired

| Connector | Where |
|-----------|--------|
| **Supabase** | `lib/supabase/client.ts`, `lib/supabase/server.ts` |
| **OpenAI** | `lib/ai.ts` (`getOpenAIModel()`) |
| **Vercel** | Deploy from this folder |
| **GitHub** | CI builds `live/` on push |

Database schema: `supabase/schema.sql`

## Setup

```bash
cp .env.example .env.local
# Fill in Supabase + OpenAI + ADMIN_PASSWORD
npm install
npm run dev
```

Open http://localhost:3000 — connector status on the home page.

### Vercel

Set **Root Directory** to `live` in the Vercel project settings.

```bash
npx vercel link
npx vercel env pull .env.local
npx vercel
```

### Reset between rehearsals

From the repo root: `.\RESET.ps1`

## On-stage playbook

See [BUILD_SCRIPT.md](./BUILD_SCRIPT.md) — start with **Prompt 0** (master brief),
then work through Prompts 1–6 in order. Paste each prompt into your coding agent.
