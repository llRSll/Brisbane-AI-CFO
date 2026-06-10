# Live build script — agent prompts

Use these prompts **in order** with Cursor (or any coding agent) in the `live/`
repo. Each prompt is self-contained. Paste one prompt, let the agent finish,
verify it works, then move to the next.

**Do not skip Prompt 0.** It is the master brief — every later prompt assumes
the agent already understands the full product.

---

## Before you start (you, not the agent)

- [ ] `npm install` and `npm run dev` running
- [ ] `.env.local` filled in (see `.env.example`)
- [ ] Home page shows connectors green
- [ ] Supabase tables exist (`supabase/schema.sql` if needed)

**Timing guide** (~15–20 min on stage): Prompt 1 → 3 min · 2 → 4 min · 3 → 5 min ·
4 → 5 min · 5 → 3 min · 6 → 3 min

---

## Prompt 0 — Master brief (read this to the agent first)

Copy everything inside the block:

```
You are building a live event companion web app for a conference (Brisbane AI CFO).
Attendees scan a QR code on the big screen, sign up with name/email, vote in live
polls, submit questions, and see an agenda. A presenter runs the show from a
password-protected admin panel. A big-screen /present view shows QR + live results.

## Stack (already wired in this repo — do not replace)

- Next.js 15 App Router, TypeScript, Tailwind CSS
- Supabase (Postgres + Realtime) — `lib/supabase/client.ts` (browser anon key),
  `lib/supabase/server.ts` (service-role admin client)
- OpenAI via Vercel AI SDK — `lib/ai.ts` exports `getOpenAIModel()`
- Dark "stage" UI — `app/globals.css`, `tailwind.config.ts` (brand indigo, stage
  bg/panel/border colours). Use Tailwind only, no extra CSS files.

## Routes to build (nothing exists yet except `/` connector status)

| Route      | Who        | Purpose |
|------------|------------|---------|
| `/`        | Everyone   | Landing with links to join, live, present, admin |
| `/join`    | Attendees  | Signup form → cookie session → redirect to /live |
| `/live`    | Attendees  | Tabs: Poll · Q&A · Schedule (realtime updates) |
| `/present` | Projector  | Big-screen: QR, live poll bars, question themes, agenda |
| `/admin`   | Presenter  | Password gate; create/open polls, cluster questions, paste agenda, reset |

## Database (Supabase — see `supabase/schema.sql`)

Tables: attendees, polls, votes, questions, question_groups, schedule_items.
Votes are unique per (poll_id, attendee_id). Poll options stored as jsonb string
array. question_groups has label, summary, proposed_question, count.
schedule_items ordered by position.

RLS: enabled on all tables. Public SELECT only on polls, votes, questions,
question_groups, schedule_items. attendees has NO select policy (PII never via
anon key). All INSERT/UPDATE/DELETE go through Next.js API routes using the
service-role client.

Realtime: polls, votes, questions, question_groups, schedule_items must be in
the supabase_realtime publication (schema.sql handles this).

## Architecture rules (follow strictly)

1. **Writes** — only in `app/api/**` route handlers via `createAdminClient()`.
2. **Reads in browser** — Supabase anon client + Realtime subscriptions for live
   UI. Never put service-role key in client code.
3. **Attendee identity** — httpOnly cookie `attendee_id` (uuid), set on signup.
   Voting and question submit require this cookie.
4. **Admin** — httpOnly cookie `admin_ok` after password check against
   `ADMIN_PASSWORD` env var. Guard all `/api/admin/*` routes.
5. **Validation** — use zod in API routes. Return `{ error: string }` with 4xx/5xx.
6. **Accessibility** — labels, aria-labels, keyboard-friendly buttons.
7. **Code style** — const arrow functions, `handle` prefix for event handlers,
   early returns, types in `lib/types.ts`.

## Environment variables

- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (server only)
- OPENAI_API_KEY
- ADMIN_PASSWORD
- NEXT_PUBLIC_BASE_URL (for QR link, e.g. https://your-app.vercel.app)

## AI features

1. **Question clustering** — admin clicks "Group questions". Send all question
   {id, text} to OpenAI (gpt-4o-mini) with structured output: clusters with
   label, summary, a single proposed_question for the presenter, and questionIds.
   Write groups to question_groups, set questions.group_id. Re-cluster from
   scratch each run. If no API key, use a simple token-overlap mock fallback.

2. **Schedule parsing** — admin pastes raw agenda text. AI extracts ordered
   items: title, start_time, end_time, speaker, description (nulls ok). Replace
   all schedule_items. Mock fallback: line-by-line regex parse.

## Key UI components to create

- JoinQR — QR code to NEXT_PUBLIC_BASE_URL/join (use qrcode.react)
- useEventData — hook: initial fetch + Realtime on 5 tables; exposes activePoll,
  pollCounts, groupedQuestions, schedule, loading
- PollResults — horizontal bar chart per option
- QuestionClusters — list of merged themes with count badge + proposed question
- ScheduleList — ordered agenda items

## What already exists

Connectors only: home page status, `/api/health`, supabase clients, minimal
`lib/ai.ts`. No features, no types, no session helpers yet.

Acknowledge this brief. Do not write code yet — I will send build prompts one
feature at a time.
```

---

## Prompt 1 — Foundation (~3 min)

```
Build the foundation for the live event app (per the master brief).

1. Add `lib/types.ts` — TypeScript types for Attendee, Poll, Vote, Question,
   QuestionGroup, ScheduleItem, GroupedQuestions.

2. Add `lib/session.ts` — httpOnly cookies: get/set attendee_id, isAdmin/setAdmin
   (admin cookie value "1"). One-year maxAge, secure in production.

3. Extend `.env.example` with ADMIN_PASSWORD.

4. Replace the home page (`app/page.tsx`) with a proper landing: headline about
   joining/voting/Q&A, links to /join, /live, /present, /admin. Keep the dark
   stage aesthetic. Remove connector-status UI (or move it to a small footer link
   to /api/health if you like).

5. Verify `npm run build` passes.

Do not build signup, polls, or admin yet.
```

---

## Prompt 2 — Attendee signup (~4 min)

```
Build attendee signup for the live event app.

1. `app/api/signup/route.ts` (POST) — validate name, email, optional company with
   zod. Upsert attendee by email (case-insensitive). Use service-role Supabase
   client. Set attendee_id cookie. Return { attendee }.

2. `app/join/page.tsx` — client form: name, email, company (optional). POST to
   /api/signup, show errors, redirect to /live on success. Accessible inputs,
   Tailwind panel styling.

3. `components/JoinQR.tsx` — client component, qrcode.react, props: url, size.
   White rounded background behind QR. Install qrcode.react if needed.

4. On the landing page, mention scanning the QR on /present (don't embed QR on
   / yet unless you want a small preview).

Test: submit signup, confirm row in Supabase attendees table, cookie set.
```

---

## Prompt 3 — Live polls + realtime (~5 min)

```
Build live polls with realtime updates.

1. `components/useEventData.ts` — client hook using anon Supabase client. Fetch
   polls, votes, questions, question_groups, schedule_items. Subscribe to
   postgres_changes on all five tables. Derive: activePoll (is_open), pollCounts,
   pollTotal, groupedQuestions, ungroupedQuestions, loading.

2. `app/api/vote/route.ts` (POST) — require attendee_id cookie. Body: pollId,
   optionIndex. Upsert vote (unique per poll+attendee). Validate poll is open
   and index in range.

3. `components/PollResults.tsx` — show question + option bars with counts and
   percentages. Support `large` prop for presenter view.

4. `app/live/page.tsx` — client page with tabs: Poll | Q&A | Schedule. Poll tab:
   if active poll, render options as buttons → POST /api/vote; show PollResults
   below. Handle vote errors and "already voted" UX. Q&A and Schedule tabs can
   be placeholders for now.

5. `app/api/admin/polls/route.ts` (POST) — admin only. Actions: "create"
   (question + options array), "toggle" (pollId, isOpen). Only one poll should
   be open at a time — closing others when opening one.

Test: create a poll via API or temporary curl, open it, vote from /live, watch
bars update without refresh.
```

---

## Prompt 4 — Q&A + AI grouping (~5 min)

```
Build audience questions and AI clustering.

1. `app/api/questions/route.ts` (POST) — require attendee_id cookie. Body: text.
   Insert question linked to attendee.

2. Expand `lib/ai.ts` — add groupQuestions(questions) using generateObject + zod
   schema (clusters with label, summary, question, questionIds). Use
   getOpenAIModel(). Mock fallback: token-overlap clustering when no API key or
   on error. Export types for clusters.

3. `app/api/admin/group/route.ts` (POST) — admin only. Load all questions, run
   groupQuestions, clear existing groups, insert question_groups (with
   proposed_question, count), update questions.group_id.

4. `components/QuestionClusters.tsx` — render grouped themes: count badge,
   proposed_question (or first question text), sorted by size. `large` prop.

5. On `app/live/page.tsx` Q&A tab — textarea + submit → /api/questions. Show
   QuestionClusters for grouped questions. Brief success feedback on submit.

Test: submit questions from two browsers, run Group from admin (next prompt) or
curl, see clusters appear live.
```

---

## Prompt 5 — Schedule (~3 min)

```
Build the live event schedule.

1. Expand `lib/ai.ts` — add parseSchedule(rawText) → ordered items with title,
   start_time, end_time, speaker, description. generateObject + mock line parser
   fallback.

2. `app/api/admin/schedule/route.ts` (POST) — admin only. Body: raw text.
   Parse, delete all schedule_items, insert new rows with position index.

3. `components/ScheduleList.tsx` — render ordered items: time range, title,
   speaker. Handle nulls gracefully.

4. On `app/live/page.tsx` Schedule tab — render ScheduleList from useEventData.

Test: paste a multi-line agenda in admin, see it appear on /live Schedule tab.
```

---

## Prompt 6 — Admin + presenter (~3 min)

```
Build the admin dashboard and presenter screen.

1. `app/api/admin/login/route.ts` (POST) — check password against ADMIN_PASSWORD,
   set admin cookie.

2. `app/api/admin/reset/route.ts` (POST) — admin only. Clear votes, questions,
   groups, schedule (keep attendees and polls, or document what you reset).

3. `app/admin/page.tsx` — login form, then dashboard sections:
   - Polls: create form (question + dynamic options), list polls with open/close
   - Q&A: "Group questions" button → POST /api/admin/group, show status
   - Schedule: textarea + "Parse & publish" → POST /api/admin/schedule
   - Reset button with confirm
   Use useEventData for live lists. Flash status messages.

4. `app/present/page.tsx` — big-screen layout: JoinQR (NEXT_PUBLIC_BASE_URL/join),
   PollResults (large), QuestionClusters (large), ScheduleList. Live stats header
   (question count, vote total).

5. Final pass on landing page links and mobile-friendly /live layout.

Test full flow: signup → vote → ask questions → admin groups → present screen on
projector.
```

---

## Prompt 7 — Polish (optional, if time)

```
Polish the live event app:

- Add loading skeletons to useEventData consumers
- Ensure only one poll open at a time (admin toggle)
- npm run build clean
- Any empty states with helpful copy
- Confirm all admin routes return 401 without cookie
```

---

## If something breaks on stage

- Re-send the **current step's prompt** with the error message appended.
- Or send Prompt 0 again plus "fix [specific feature] — here is the error: …"
- Keep `npm run dev` running; hard-refresh the browser after API changes.
