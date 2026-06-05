# 🎤 Live Build Script (15–20 min)

A timed playbook for building the event app on stage. The `live/` folder has
all the plumbing done (Supabase client, types, session, QR, styling). You
build the **features**. If anything goes wrong, switch the projector to the
deployed **backup** URL — it has everything working.

> Before you start: `cd live`, run `npm install` ahead of time, have
> `npm run dev` already running, and have `backup/` open in a second window as
> reference. Keep the deployed backup URL in a browser tab as the safety net.

---

## 0. Setup (do this BEFORE going on stage — not counted in the 20 min)

- [ ] `cd live && npm install`
- [ ] `.env.local` filled in (Supabase URL + anon + service_role key)
- [ ] `npm run dev` running on http://localhost:3000
- [ ] Backup deployed + its URL in a tab
- [ ] `backup/` open in editor for copy-paste reference

---

## 1. QR signup → 4 min

**Goal:** attendee scans QR, enters name/email, lands on the live page.

1. Open `app/join/page.tsx`. Build the form (reference
   `backup/app/join/page.tsx`): name, email, optional company; POST to
   `/api/signup`.
2. Create `app/api/signup/route.ts` (reference `backup/app/api/signup/route.ts`):
   insert attendee with the service-role client, set the attendee cookie.
3. Show the QR on the landing/presenter screen with `<JoinQR url=… />`
   (already in `components/JoinQR.tsx`).

**Talking point:** "Everyone scan the code on screen — you're now in the
database in real time."

**Demo:** scan with your phone, sign up, watch the row appear (Supabase table
editor on the side screen is a nice touch).

---

## 2. Live polls → 5 min

**Goal:** open a poll, audience votes, results update live.

1. `app/api/vote/route.ts` (reference backup): upsert one vote per attendee.
2. On `app/live/page.tsx`, render the active poll's options as buttons → POST
   `/api/vote`.
3. Wire realtime: subscribe to `votes` + `polls` (reference
   `backup/components/useEventData.ts`) and render `PollResults`.
4. Pre-seed one poll via `/admin` (or the SQL editor) so it's ready to open.

**Talking point:** "Vote now —" then flip to the results bars filling live.

---

## 3. AI Q&A grouping → 5 min

**Goal:** submit questions, AI clusters them into themes shown as bubbles.

1. `app/api/questions/route.ts` (reference backup): insert question text.
2. Add a question box on `/live`.
3. `lib/ai.ts` + `app/api/admin/group/route.ts` (reference backup): cluster
   with the AI SDK (mock fallback if no key), write `question_groups` and set
   each question's `group_id`.
4. Render `QuestionClusters` — bubbles sized by how many questions merged.

**Talking point:** "Ask anything. Watch the AI merge duplicates — see this
bubble? It just combined 6 similar questions into one theme."

---

## 4. Live schedule → 3 min

**Goal:** paste/upload the agenda; AI parses it; it displays live.

1. `app/api/admin/schedule/route.ts` + `parseSchedule` in `lib/ai.ts`
   (reference backup).
2. In `/admin`, paste the agenda text → parse & publish.
3. Render `ScheduleList` on `/live` and `/present`.

**Talking point:** "I'll paste tonight's agenda — the AI structures it and
it's instantly live on everyone's phone."

---

## 5. Wrap → 1–2 min

- Show `/present` on the big screen: QR + live poll + question themes + agenda
  all together.
- "Everything you just saw — signup, polls, AI Q&A, schedule — built live, and
  it's already deployed on Vercel with a Supabase backend."

---

## 🛟 Fallback rules

- If a step breaks and you can't fix it in ~30s, say "here's the finished
  version" and switch the projector to the **deployed backup URL**. Keep
  narrating from there.
- The backup has identical UI, so the audience won't notice a seam.
- Reset demo data anytime from `/admin` → Reset controls.

## Copy-paste source map

| Building this           | Copy from backup                          |
| ----------------------- | ----------------------------------------- |
| Signup form             | `backup/app/join/page.tsx`                |
| Signup API              | `backup/app/api/signup/route.ts`          |
| Vote API                | `backup/app/api/vote/route.ts`            |
| Realtime data hook      | `backup/components/useEventData.ts`       |
| Poll results UI         | `backup/components/PollResults.tsx`       |
| Questions API           | `backup/app/api/questions/route.ts`       |
| AI grouping             | `backup/lib/ai.ts` + `app/api/admin/group/route.ts` |
| Question bubbles        | `backup/components/QuestionClusters.tsx`  |
| Schedule parse + UI     | `backup/app/api/admin/schedule/route.ts` + `components/ScheduleList.tsx` |
| Admin dashboard         | `backup/app/admin/page.tsx`               |
