# 🎤 Live Build Prompt Deck

Paste these prompts into Cursor (Agent mode) **in order** during the demo. The
boring, invisible plumbing is already done in this `live/` folder — Supabase
client, types, session, the AI engine, and **all API routes**. So every prompt
below builds something **visible** and works immediately, while you make the
design calls live.

> 🛟 Safety net: the finished, deployed app lives in `../backup` and at your
> production URL. If a prompt misbehaves and you can't fix it in ~30s, switch
> the projector to the backup URL and keep narrating. The agent can also read
> `../backup/...` for the exact reference implementation any time.

---

## ✅ Before you go on stage (not part of the 20 min)

- [ ] `cd live && npm install`
- [ ] `.env.local` has the Supabase keys + `OPENAI_API_KEY` + `ADMIN_PASSWORD`
- [ ] `npm run dev` running at http://localhost:3000
- [ ] Backup URL open in another tab as the fallback
- [ ] Reset demo data: open `/admin` later and use the Reset buttons, or run
      this once so you start clean.

## 🔌 What's already wired (tell the agent if it asks)

These API routes exist and work — your UI just needs to call them:

| Route | Method | Body | Does |
| --- | --- | --- | --- |
| `/api/signup` | POST | `{name,email,company?}` | creates attendee + cookie |
| `/api/vote` | POST | `{pollId,optionIndex}` | one vote per attendee |
| `/api/questions` | POST | `{text}` | submits a question |
| `/api/admin/login` | GET/POST/DELETE | `{password}` | admin session |
| `/api/admin/polls` | POST | `{action:'create'|'toggle'|'delete', ...}` | manage polls |
| `/api/admin/group` | POST | — | AI-group questions → combined questions |
| `/api/admin/schedule` | POST | `{raw}` | AI-parse agenda text |
| `/api/admin/extract` | POST | form-data `file` | .docx/text → plain text |
| `/api/admin/reset` | POST | `{scope}` | clear votes/questions/all |

Realtime tables (subscribe with the browser client): `polls`, `votes`,
`questions`, `question_groups`, `schedule_items`. Types are in `lib/types.ts`.

---

## ⏱️ Prompt 0 — Pick the vibe (≈1 min) 🎨

**🎤 Say:** "First, let's give it a look. What's our vibe — sleek dark, or
bright and energetic? What accent colour?"

**⌨️ Prompt** (fill in the choices you call out):

```
In tailwind.config.ts, set the brand/accent palette for a live-event app.
Theme: <dark stage | clean light>. Primary accent: <indigo | emerald | pink | cyan | amber>.
Update app/globals.css so the background uses the theme and add a `.stage-gradient`
and `.panel` helper. Keep it high-contrast and readable on a big projector screen.
```

**✅ Result:** instant visual identity everyone can see.

---

## ⏱️ Prompt 1 — Landing page (≈2 min)

**🎤 Say:** "Now the front door — what attendees see first."

**⌨️ Prompt:**

```
Build app/page.tsx as a bold landing page for our live event app.
A hero with the event name "<EVENT NAME>", a one-line tagline, and a primary
"Join the event" button linking to /join. Use the theme + .stage-gradient.
Add small footer links to /present and /admin. Tailwind only, accessible.
```

**🎨 Choice:** event name + tagline.

---

## ⏱️ Prompt 2 — QR signup (≈3 min)

**🎤 Say:** "Everyone will scan a code to join. Let's build the signup."

**⌨️ Prompt:**

```
Build app/join/page.tsx: a client signup form with Name, Email, and optional
Company. On submit, POST to /api/signup (JSON) and on success router.push('/live').
Show inline validation errors from the API. Style it as a centered card using
.panel and the theme. Use a handleSubmit handler and typed state.
```

**✅ Result:** a real signup writing to Supabase. Sign up on your phone to prove
it.

---

## ⏱️ Prompt 3 — Presenter screen + QR (≈2 min)

**🎤 Say:** "This is the big screen. It shows the QR people scan."

**⌨️ Prompt:**

```
Build app/present/page.tsx as a big-screen dashboard (client component).
Top: event title. Use the existing components/JoinQR.tsx to render a QR that
links to `${NEXT_PUBLIC_BASE_URL || window.location.origin}/join`.
Lay out a responsive grid with placeholder panels titled "Live poll",
"Top questions", and "Agenda" — we'll fill these next. Use .panel + theme.
```

**🎨 Choice:** big and centered, or multi-panel grid.

---

## ⏱️ Prompt 4 — Realtime + live polls (≈4 min)

**🎤 Say:** "Let's make it live. Poll opens, you vote, results move in real time."

**⌨️ Prompt:**

```
Create a client hook components/useEventData.ts using the browser Supabase
client (lib/supabase/client.ts) that loads polls, votes, questions,
question_groups and schedule_items, derives the open poll and its per-option
vote counts, groups questions by group_id, and re-fetches on realtime changes
to those tables. Then build app/live/page.tsx: if a poll is open, show its
options as buttons that POST to /api/vote; after voting, show a live results
bar chart computed from the hook. Use the theme. Reference ../backup if helpful
but apply our design.
```

**✅ Result:** open a poll from `/admin` (next) and watch bars fill live.

---

## ⏱️ Prompt 5 — Admin control panel (≈2 min)

**🎤 Say:** "I need a control panel to run the show."

**⌨️ Prompt:**

```
Build app/admin/page.tsx (client). First check GET /api/admin/login; if not
admin, show a password form POSTing to /api/admin/login. Once in, show controls:
create a poll (question + 2-6 options) and open/close it via /api/admin/polls;
a "Group questions" button hitting /api/admin/group that shows the returned
engine + count; and Reset buttons calling /api/admin/reset. Use the theme.
```

---

## ⏱️ Prompt 6 — AI Q&A grouping (≈3 min)

**🎤 Say:** "Here's the clever bit — AI merges similar questions into one."

**⌨️ Prompt:**

```
On app/live/page.tsx add a "Ask a question" box that POSTs to /api/questions.
Create components/QuestionClusters.tsx that renders groupedQuestions from the
hook as a ranked list: each item shows the group's proposed_question (the
AI-combined question) with a badge of how many questions it merged. Render it on
both /live and /present "Top questions" panel. Use the theme.
```

**🎤 Say (after clicking Group in admin):** "Watch — it just merged N similar
questions into one I can actually answer."

---

## ⏱️ Prompt 7 — Live agenda from a Word doc (≈2 min)

**🎤 Say:** "Finally — I'll drop in tonight's run sheet and it reads it live."

**⌨️ Prompt:**

```
In app/admin/page.tsx add a Schedule section: a file input (accept .docx,.txt,.md,.csv)
that POSTs the file as form-data to /api/admin/extract, puts the returned text in
a textarea, and a "Publish agenda" button that POSTs {raw} to /api/admin/schedule.
Create components/ScheduleList.tsx and show the schedule_items from the hook on
/present and /live. Use the theme.
```

**🎤 Say:** upload the organisers' `.docx` → Publish → it appears on the big
screen.

---

## 🎬 Wrap (≈1 min)

**🎤 Say:** "In 20 minutes: QR signup, live polls, AI that groups Q&A, and a
schedule it read from a Word doc — all live, all deployed on Vercel with a
Supabase backend."

Show `/present` with everything populated.

---

## 🧯 If something breaks

- Re-run the prompt with: *"that errored with `<paste error>` — fix it"*.
- Still stuck after ~30s → switch projector to the **backup URL** and continue.
- Need the exact known-good code → tell the agent: *"match the implementation
  in ../backup/<file>"*.
