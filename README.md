# Brisbane AI CFO — Live Event Demo

Live event companion web app for the Brisbane AI CFO conference: attendees scan a
QR code, sign up, vote in live polls, and submit questions that an AI engine
groups into themes. Includes a big-screen presenter view and an admin
dashboard.

## Folders

- **`backup/`** — complete, deployable production app (primary + backup Vercel
  stacks). Next.js + Supabase + Vercel AI SDK. See [`backup/README.md`](backup/README.md)
  and [`backup/DEMO_RUNBOOK.md`](backup/DEMO_RUNBOOK.md) for deployment and
  failover.
- **`live/`** — on-stage starter with connectors only (Supabase, OpenAI,
  Vercel, GitHub). Build the full app live via agent prompts in
  [`live/BUILD_SCRIPT.md`](live/BUILD_SCRIPT.md) — no reference to `backup/`
  required.
- **`live-scaffold-snapshot/`** — pristine copy of the live scaffold used by
  `RESET.ps1` to reset `live/` between rehearsals.

## Stack

Next.js (App Router) · Supabase (Postgres + Realtime) · Vercel AI SDK · Tailwind CSS · Deployed on Vercel

## Local dev (backup)

```powershell
.\DEV-BACKUP.ps1
```

Opens http://localhost:3000 — see `backup/DEMO_RUNBOOK.md` for routes.

## Production URLs

| Stack | URL |
|-------|-----|
| Live | https://brisbane-ai-cfo.vercel.app |
| Backup | https://brisbane-ai-cfo-842x.vercel.app |
