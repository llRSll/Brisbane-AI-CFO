# Brisbane AI CFO — Demo Runbook

## URLs

| Role | Live (primary) | Backup (failover) |
|------|----------------|-------------------|
| Presenter | https://brisbane-ai-cfo.vercel.app/present | https://brisbane-ai-cfo-842x.vercel.app/present |
| Admin | https://brisbane-ai-cfo.vercel.app/admin | https://brisbane-ai-cfo-842x.vercel.app/admin |
| Guest join (QR) | https://brisbane-ai-cfo.vercel.app/join | https://brisbane-ai-cfo-842x.vercel.app/join |

## Before the event

- [ ] Both Vercel projects deployed from `main` (root directory: `backup`)
- [ ] Both Supabase projects have schema applied (`supabase/schema.sql`)
- [ ] `NEXT_PUBLIC_BASE_URL` set to each project's own URL in Vercel env vars
- [ ] Strong `ADMIN_PASSWORD` set on both projects (same password is fine)
- [ ] Pre-load **backup** with same polls and schedule as live (via `/admin`)
- [ ] Print a static QR for backup `/join` (in case `/present` won't load)
- [ ] Keep backup `/present` open in a browser tab, admin logged in

## Running the show (primary)

1. Projector on **live** `/present` — guests scan the QR.
2. Run the show from **live** `/admin` on laptop or phone.
3. **Polls:** create question → tap **Open** when ready.
4. **Q&A:** after questions arrive → **Group questions**.
5. **Schedule:** paste agenda → **Parse & publish**.

## Failover (if primary breaks)

1. Switch projector to **backup** `/present` (or show printed backup QR).
2. Log into **backup** `/admin` if not already.
3. Re-open any active poll / re-publish schedule on backup.
4. Tell guests: "Scan the new code to rejoin."

**Note:** Guest signups, votes, and questions from primary do **not** carry over.
Guests must sign up again on backup.

## Environment variables (per Vercel project)

| Variable | Live | Backup |
|----------|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Live Supabase URL | Backup Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Live anon key | Backup anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Live service role | Backup service role |
| `ADMIN_PASSWORD` | Your password | Same |
| `NEXT_PUBLIC_BASE_URL` | `https://brisbane-ai-cfo.vercel.app` | `https://brisbane-ai-cfo-842x.vercel.app` |
| `OPENAI_API_KEY` | Optional | Optional |

## Local dev

```bash
cd backup
cp .env.example .env.local
# fill in one Supabase project's keys
npm install
npm run dev
```
