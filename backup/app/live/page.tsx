"use client";

import { useState } from "react";
import Link from "next/link";
import { useEventData } from "@/components/useEventData";
import PollResults from "@/components/PollResults";
import QuestionClusters from "@/components/QuestionClusters";
import ScheduleList from "@/components/ScheduleList";

type Tab = "poll" | "qa" | "schedule";

const TABS: { value: Tab; label: string }[] = [
  { value: "poll", label: "Poll" },
  { value: "qa", label: "Q&A" },
  { value: "schedule", label: "Agenda" },
];

const LivePage = () => {
  const data = useEventData();
  const [tab, setTab] = useState<Tab>("poll");
  const [votedIndex, setVotedIndex] = useState<number | null>(null);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [questionSent, setQuestionSent] = useState(false);
  const [questionError, setQuestionError] = useState<string | null>(null);

  const handleVote = async (optionIndex: number) => {
    if (!data.activePoll) return;
    setVoteError(null);
    setVotedIndex(optionIndex);

    const response = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pollId: data.activePoll.id, optionIndex }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setVoteError(body.error ?? "Could not vote");
      setVotedIndex(null);
    }
  };

  const handleSubmitQuestion = async (event: React.FormEvent) => {
    event.preventDefault();
    setQuestionError(null);

    const response = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: questionText }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setQuestionError(body.error ?? "Could not submit");
      return;
    }

    setQuestionText("");
    setQuestionSent(true);
    setTimeout(() => setQuestionSent(false), 2500);
  };

  return (
    <main className="stage-gradient min-h-screen px-4 py-6">
      <div className="mx-auto max-w-2xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
              Live hub
            </p>
            <h1 className="text-2xl font-bold tracking-tight">You&apos;re in</h1>
          </div>
          <Link
            href="/"
            className="text-sm text-white/40 transition hover:text-white/70"
          >
            Home
          </Link>
        </header>

        <nav
          className="mb-6 flex gap-1 rounded-xl border border-stage-border bg-stage-panel/80 p-1"
          aria-label="Sections"
        >
          {TABS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              aria-pressed={tab === value}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                tab === value
                  ? "bg-brand text-white shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {tab === "poll" ? (
          <section className="panel panel-glow rounded-2xl p-6">
            {!data.activePoll ? (
              <div className="py-8 text-center">
                <p className="text-white/50">No poll open right now.</p>
                <p className="mt-1 text-sm text-white/35">
                  We&apos;ll notify you here when voting starts.
                </p>
              </div>
            ) : votedIndex !== null ? (
              <>
                <p className="mb-4 rounded-lg border border-accent-green/30 bg-accent-green/10 px-3 py-2 text-sm text-accent-green">
                  Thanks for voting — live results below.
                </p>
                <PollResults
                  poll={data.activePoll}
                  counts={data.pollCounts}
                  total={data.pollTotal}
                />
              </>
            ) : (
              <>
                <h2 className="mb-5 text-xl font-semibold leading-snug">
                  {data.activePoll.question}
                </h2>
                <div className="flex flex-col gap-2.5">
                  {data.activePoll.options.map((option, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleVote(index)}
                      className="rounded-xl border border-stage-border bg-stage-bg/50 px-4 py-3.5 text-left font-medium transition hover:border-brand hover:bg-brand/10"
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {voteError ? (
                  <p className="mt-3 text-sm text-red-300" role="alert">
                    {voteError}
                  </p>
                ) : null}
              </>
            )}
          </section>
        ) : null}

        {tab === "qa" ? (
          <section className="flex flex-col gap-4">
            <form
              onSubmit={handleSubmitQuestion}
              className="panel panel-glow rounded-2xl p-6"
            >
              <h2 className="mb-1 text-lg font-semibold">Ask a question</h2>
              <p className="mb-4 text-sm text-white/45">
                Submitted questions are grouped into themes for the panel.
              </p>
              <textarea
                value={questionText}
                onChange={(event) => setQuestionText(event.target.value)}
                rows={3}
                maxLength={400}
                aria-label="Your question"
                placeholder="What would you like to ask the panel?"
                className="input-field w-full resize-none"
              />
              {questionError ? (
                <p className="mt-2 text-sm text-red-300" role="alert">
                  {questionError}
                </p>
              ) : null}
              {questionSent ? (
                <p className="mt-2 text-sm text-accent-green">
                  Question submitted — thank you!
                </p>
              ) : null}
              <button type="submit" className="btn-primary mt-4 w-full">
                Submit question
              </button>
            </form>

            <div className="panel panel-glow rounded-2xl p-6">
              <h2 className="mb-4 text-lg font-semibold">Grouped themes</h2>
              <QuestionClusters groups={data.groupedQuestions} />
            </div>
          </section>
        ) : null}

        {tab === "schedule" ? (
          <section className="panel panel-glow rounded-2xl p-6">
            <h2 className="mb-4 text-lg font-semibold">Today&apos;s agenda</h2>
            <ScheduleList items={data.schedule} />
          </section>
        ) : null}
      </div>
    </main>
  );
};

export default LivePage;
