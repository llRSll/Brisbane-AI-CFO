"use client";

import { useEffect, useState } from "react";
import { useEventData } from "@/components/useEventData";

const AdminLogin = ({ onSuccess }: { onSuccess: () => void }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      setError("Wrong password");
      return;
    }
    onSuccess();
  };

  return (
    <main className="stage-gradient flex min-h-screen items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="panel w-full max-w-sm rounded-2xl p-8">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="mt-1 text-sm text-white/60">Enter the presenter password.</p>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-label="Admin password"
          placeholder="Password"
          className="mt-6 w-full rounded-lg border border-stage-border bg-stage-bg px-3 py-2 outline-none focus:border-brand"
        />
        {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
        >
          Enter
        </button>
      </form>
    </main>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="panel rounded-2xl p-6">
    <h2 className="mb-4 text-lg font-semibold text-brand-light">{title}</h2>
    {children}
  </section>
);

const AdminDashboard = () => {
  const data = useEventData();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [scheduleRaw, setScheduleRaw] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const flash = (message: string, durationMs = 3000) => {
    setStatus(message);
    setTimeout(() => setStatus(null), durationMs);
  };

  const handleOptionChange = (index: number, value: string) => {
    setOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
  };

  const handleCreatePoll = async (event: React.FormEvent) => {
    event.preventDefault();
    const cleaned = options.map((o) => o.trim()).filter(Boolean);
    const response = await fetch("/api/admin/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", question, options: cleaned }),
    });
    if (!response.ok) {
      flash("Could not create poll (need a question + 2 options)");
      return;
    }
    setQuestion("");
    setOptions(["", ""]);
    flash("Poll created");
  };

  const handleToggle = async (pollId: string, isOpen: boolean) => {
    await fetch("/api/admin/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle", pollId, isOpen }),
    });
  };

  const handleDeletePoll = async (pollId: string) => {
    await fetch("/api/admin/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", pollId }),
    });
  };

  const handleGroup = async () => {
    flash("Grouping…");
    const response = await fetch("/api/admin/group", { method: "POST" });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      flash("Grouping failed");
      return;
    }
    const engineLabel = body.engine === "openai" ? "AI" : "offline mock";
    const suffix = body.error ? ` — reason: ${body.error}` : "";
    flash(
      `Grouped into ${body.clusters} theme(s) via ${engineLabel}${suffix}`,
      12000,
    );
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    flash("Reading file…");
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/admin/extract", { method: "POST", body });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      flash(data.error ?? "Could not read file");
      return;
    }
    setScheduleRaw(data.text ?? "");
    flash("File loaded — review then publish");
  };

  const handlePublishSchedule = async (event: React.FormEvent) => {
    event.preventDefault();
    flash("Parsing agenda…");
    const response = await fetch("/api/admin/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ raw: scheduleRaw }),
    });
    const body = await response.json().catch(() => ({}));
    flash(response.ok ? `Published ${body.items} item(s)` : body.error ?? "Failed");
  };

  const handleReset = async (scope: "questions" | "votes" | "all") => {
    await fetch("/api/admin/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scope }),
    });
    flash(`Reset ${scope}`);
  };

  return (
    <main className="stage-gradient min-h-screen px-4 py-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Presenter dashboard</h1>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span>{data.questions.length} questions</span>
            <span>{data.pollTotal} votes</span>
            <a className="text-brand-light hover:underline" href="/present">
              Open presenter screen ↗
            </a>
          </div>
        </header>

        {status ? (
          <p className="rounded-lg bg-brand/15 px-4 py-2 text-sm text-brand-light">
            {status}
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Section title="Create a poll">
            <form onSubmit={handleCreatePoll} className="flex flex-col gap-3">
              <input
                type="text"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Poll question"
                aria-label="Poll question"
                className="rounded-lg border border-stage-border bg-stage-bg px-3 py-2 outline-none focus:border-brand"
              />
              {options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(event) => handleOptionChange(index, event.target.value)}
                  placeholder={`Option ${index + 1}`}
                  aria-label={`Option ${index + 1}`}
                  className="rounded-lg border border-stage-border bg-stage-bg px-3 py-2 outline-none focus:border-brand"
                />
              ))}
              <div className="flex gap-2">
                {options.length < 6 ? (
                  <button
                    type="button"
                    onClick={() => setOptions((prev) => [...prev, ""])}
                    className="rounded-lg border border-stage-border px-3 py-2 text-sm hover:border-brand"
                  >
                    + Option
                  </button>
                ) : null}
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-brand px-3 py-2 font-semibold hover:bg-brand-dark"
                >
                  Create poll
                </button>
              </div>
            </form>
          </Section>

          <Section title="Polls">
            {data.polls.length === 0 ? (
              <p className="text-sm text-white/50">No polls yet.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {data.polls.map((poll) => (
                  <li
                    key={poll.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-stage-border p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{poll.question}</p>
                      <p className="text-xs text-white/40">
                        {poll.options.length} options
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggle(poll.id, !poll.is_open)}
                        className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                          poll.is_open
                            ? "bg-accent-green/20 text-accent-green"
                            : "border border-stage-border hover:border-brand"
                        }`}
                      >
                        {poll.is_open ? "Open ●" : "Open"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePoll(poll.id)}
                        aria-label="Delete poll"
                        className="rounded-lg border border-stage-border px-2 py-1.5 text-sm text-red-300 hover:border-red-400"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="AI Q&A grouping">
            <p className="mb-3 text-sm text-white/60">
              Cluster all submitted questions into themes.
            </p>
            <button
              type="button"
              onClick={handleGroup}
              className="w-full rounded-lg bg-brand px-3 py-2 font-semibold hover:bg-brand-dark"
            >
              Group {data.questions.length} questions
            </button>
            {data.groupedQuestions.length > 0 ? (
              <ul className="mt-4 flex flex-col gap-2 text-sm text-white/80">
                {data.groupedQuestions.map((group) => (
                  <li key={group.id} className="flex items-start gap-2">
                    <span className="shrink-0 rounded-full bg-brand/20 px-2 py-0.5 text-xs font-semibold text-brand-light">
                      {group.questions.length}
                    </span>
                    <span>
                      {group.proposed_question?.trim() ||
                        group.questions[0]?.text ||
                        group.label}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Section>

          <Section title="Schedule">
            <form onSubmit={handlePublishSchedule} className="flex flex-col gap-3">
              <input
                type="file"
                accept=".docx,.txt,.md,.csv"
                onChange={handleFile}
                aria-label="Upload schedule file"
                className="text-sm text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-white"
              />
              <p className="text-xs text-white/40">
                Word (.docx), text, markdown or CSV — or paste below.
              </p>
              <textarea
                value={scheduleRaw}
                onChange={(event) => setScheduleRaw(event.target.value)}
                rows={6}
                placeholder="Or paste the schedule here…"
                aria-label="Schedule text"
                className="rounded-lg border border-stage-border bg-stage-bg px-3 py-2 text-sm outline-none focus:border-brand"
              />
              <button
                type="submit"
                className="rounded-lg bg-brand px-3 py-2 font-semibold hover:bg-brand-dark"
              >
                Parse & publish agenda
              </button>
            </form>
          </Section>
        </div>

        <Section title="Reset (demo controls)">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleReset("votes")}
              className="rounded-lg border border-stage-border px-3 py-2 text-sm hover:border-brand"
            >
              Clear votes
            </button>
            <button
              type="button"
              onClick={() => handleReset("questions")}
              className="rounded-lg border border-stage-border px-3 py-2 text-sm hover:border-brand"
            >
              Clear questions
            </button>
            <button
              type="button"
              onClick={() => handleReset("all")}
              className="rounded-lg border border-red-500/40 px-3 py-2 text-sm text-red-300 hover:border-red-400"
            >
              Clear all
            </button>
          </div>
        </Section>
      </div>
    </main>
  );
};

const AdminPage = () => {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/api/admin/login")
      .then((res) => res.json())
      .then((body) => setAuthed(Boolean(body.admin)))
      .catch(() => setAuthed(false))
      .finally(() => setChecked(true));
  }, []);

  if (!checked) {
    return (
      <main className="stage-gradient flex min-h-screen items-center justify-center">
        <p className="text-white/50">Loading…</p>
      </main>
    );
  }

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;
  return <AdminDashboard />;
};

export default AdminPage;
