"use client";

import { useState } from "react";
import Link from "next/link";
import { useEventData } from "@/components/useEventData";
import PollResults from "@/components/PollResults";
import QuestionClusters from "@/components/QuestionClusters";
import ScheduleList from "@/components/ScheduleList";

type Tab = "poll" | "qa" | "schedule";

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
          <h1 className="text-xl font-bold">Live</h1>
          <Link href="/" className="text-sm text-white/40 hover:text-white/70">
            Home
          </Link>
        </header>

        <nav className="mb-6 flex gap-2" aria-label="Sections">
          {(
            [
              ["poll", "Poll"],
              ["qa", "Q&A"],
              ["schedule", "Schedule"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tab === value
                  ? "bg-brand text-white"
                  : "panel text-white/70 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {tab === "poll" ? (
          <section className="panel rounded-2xl p-6">
            {!data.activePoll ? (
              <p className="text-center text-white/50">
                No poll is open right now. Hang tight!
              </p>
            ) : votedIndex !== null ? (
              <>
                <p className="mb-4 rounded-lg bg-accent-green/10 px-3 py-2 text-sm text-accent-green">
                  Thanks for voting! Live results below.
                </p>
                <PollResults
                  poll={data.activePoll}
                  counts={data.pollCounts}
                  total={data.pollTotal}
                />
              </>
            ) : (
              <>
                <h2 className="mb-4 text-xl font-semibold">
                  {data.activePoll.question}
                </h2>
                <div className="flex flex-col gap-3">
                  {data.activePoll.options.map((option, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleVote(index)}
                      className="rounded-xl border border-stage-border px-4 py-3 text-left transition hover:border-brand hover:bg-brand/10"
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {voteError ? (
                  <p className="mt-3 text-sm text-red-300">{voteError}</p>
                ) : null}
              </>
            )}
          </section>
        ) : null}

        {tab === "qa" ? (
          <section className="flex flex-col gap-6">
            <form onSubmit={handleSubmitQuestion} className="panel rounded-2xl p-6">
              <h2 className="mb-3 text-xl font-semibold">Ask a question</h2>
              <textarea
                value={questionText}
                onChange={(event) => setQuestionText(event.target.value)}
                rows={3}
                maxLength={400}
                aria-label="Your question"
                placeholder="What would you like to ask?"
                className="w-full rounded-lg border border-stage-border bg-stage-bg px-3 py-2 outline-none focus:border-brand"
              />
              {questionError ? (
                <p className="mt-2 text-sm text-red-300">{questionError}</p>
              ) : null}
              {questionSent ? (
                <p className="mt-2 text-sm text-accent-green">Question submitted!</p>
              ) : null}
              <button
                type="submit"
                className="mt-3 w-full rounded-xl bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
              >
                Submit question
              </button>
            </form>

            <div className="panel rounded-2xl p-6">
              <h2 className="mb-4 text-xl font-semibold">Grouped themes</h2>
              <QuestionClusters groups={data.groupedQuestions} />
            </div>
          </section>
        ) : null}

        {tab === "schedule" ? (
          <section className="panel rounded-2xl p-6">
            <h2 className="mb-4 text-xl font-semibold">Tonight&apos;s agenda</h2>
            <ScheduleList items={data.schedule} />
          </section>
        ) : null}
      </div>
    </main>
  );
};

export default LivePage;
