# Brisbane AI CFO — Live Event App

A live event companion web app for the Brisbane AI CFO conference: attendees
scan a QR code, sign up, vote in live polls, and submit questions that an AI
engine groups into themes. A presenter screen shows everything live on the big
screen, and an admin dashboard drives the show. Built with Next.js (App Router),
Supabase (Postgres + Realtime), and the Vercel AI SDK.

This `backup/` folder is the **deployable production app**. It powers both the
primary and backup Vercel stacks. See [`DEMO_RUNBOOK.md`](DEMO_RUNBOOK.md) for
URLs and failover steps.

## Features

- **QR signup** (`/join`) — name + email + optional company, lightweight cookie
  session (no password).
- **Live polls** (`/live`) — vote and watch results update in real time.
- **AI Q&A grouping** — submit questions; the admin clusters them into themes
  shown as sized bubbles. Falls back to an offline clustering engine if no AI
  key is set.
- **Schedule** — admin uploads/pastes an agenda; AI parses it into a structured
  schedule shown live.
- **Presenter screen** (`/present`) — big-screen dashboard with QR, live poll,
  question themes, and agenda.
- **Admin dashboard** (`/admin`) — password-protected controls.

## Routes

| Route      | Purpose                                  |
| ---------- | ---------------------------------------- |
| `/`        | Landing                                  |
| `/join`    | Attendee signup                          |
| `/live`    | Attendee hub (poll / Q&A / schedule)     |
| `/present` | Big-screen presenter view                |
| `/admin`   | Presenter control panel (password)       |

## Setup

### 1. Install

```bash
npm install
```

### 2. Supabase

Create a project, then run `supabase/schema.sql` in the Supabase SQL editor
(or it is applied automatically via MCP migration). Grab these from
**Project Settings → API**:

- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY` (server only)

### 3. Environment

Copy `.env.example` to `.env.local` and fill it in:

```bash
cp .env.example .env.local
```

`OPENAI_API_KEY` is optional — without it the app uses a built-in mock
grouping/parsing engine so the demo still works offline.

### 4. Run

```bash
npm run dev
```

Open http://localhost:3000.

## Deploy (Vercel)

Two Vercel projects connect to `llRSll/Brisbane-AI-CFO` with **Root Directory:
`backup`**:

| Stack | URL |
|-------|-----|
| Live | https://brisbane-ai-cfo.vercel.app |
| Backup | https://brisbane-ai-cfo-842x.vercel.app |

1. Push to `main` on GitHub (auto-deploys via Vercel Git integration).
2. Set environment variables per project (see `DEMO_RUNBOOK.md`).
3. `NEXT_PUBLIC_BASE_URL` must match **that project's own URL** so the QR
   code points to the correct `/join` path.

CI runs on every push via GitHub Actions (lint + build in `backup/`).

## Architecture notes

- All writes go through server route handlers using the Supabase
  **service-role** key (bypasses RLS). The browser only ever uses the **anon**
  key for read-only realtime subscriptions.
- RLS is enabled on every table. Public SELECT is allowed on display tables
  (polls, votes, questions, question_groups, schedule_items). `attendees` has
  no select policy, so attendee PII is never exposed via the anon key.
- Admin access is a password (`ADMIN_PASSWORD`) stored in an httpOnly cookie.
