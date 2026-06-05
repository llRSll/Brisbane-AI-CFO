# Brisbane Event Demo

Live event companion web app for a conference/meetup: attendees scan a QR
code, sign up, vote in live polls, and submit questions that an AI engine
groups into themes. Includes a big-screen presenter view and an admin
dashboard.

## Folders

- **`backup/`** — the complete, deployed, bulletproof version (the safety net
  for the live demo). Next.js + Supabase + Vercel AI SDK.
- **`live/`** — a pre-scaffolded starter used to live-build features on stage.
  See `live/BUILD_SCRIPT.md` for the timed on-stage playbook.

See `backup/README.md` for full setup and deployment instructions.

## Stack

Next.js (App Router) · Supabase (Postgres + Realtime) · Vercel AI SDK · Tailwind CSS · Deployed on Vercel.
