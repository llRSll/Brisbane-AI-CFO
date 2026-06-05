"use client";

import { useEffect, useState } from "react";
import EventLogo from "@/components/EventLogo";
import { useEventData } from "@/components/useEventData";
import JoinQR from "@/components/JoinQR";
import PollResults from "@/components/PollResults";
import QuestionClusters from "@/components/QuestionClusters";
import ScheduleList from "@/components/ScheduleList";
import { branding } from "@/lib/branding";

const PresentPage = () => {
  const data = useEventData();
  const [joinUrl, setJoinUrl] = useState("");

  useEffect(() => {
    const base =
      process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    setJoinUrl(`${base.replace(/\/$/, "")}/join`);
  }, []);

  return (
    <main className="stage-gradient min-h-screen px-8 py-8">
      <div className="accent-bar fixed left-0 right-0 top-0" />

      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 pt-2">
        <div>
          <EventLogo size="lg" />
          <p className="mt-2 text-lg text-ink-muted">{branding.eventTitle}</p>
        </div>
        <p className="text-xl text-ink-muted">
          {data.questions.length} questions · {data.pollTotal} votes
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="panel flex flex-col items-center justify-center rounded-3xl p-8">
          <h2 className="mb-6 font-display text-2xl font-semibold text-ink">
            Scan to join
          </h2>
          {joinUrl ? <JoinQR url={joinUrl} size={260} /> : null}
        </section>

        <section className="panel rounded-3xl p-8 lg:col-span-2">
          <h2 className="mb-6 font-display text-2xl font-semibold text-brand">
            Live poll
          </h2>
          {data.activePoll ? (
            <PollResults
              poll={data.activePoll}
              counts={data.pollCounts}
              total={data.pollTotal}
              large
            />
          ) : (
            <p className="text-center text-xl text-ink-faint">
              No poll open right now.
            </p>
          )}
        </section>

        <section className="panel rounded-3xl p-8 lg:col-span-2">
          <h2 className="mb-6 font-display text-2xl font-semibold text-brand">
            Question themes
          </h2>
          <QuestionClusters groups={data.groupedQuestions} large />
        </section>

        <section className="panel rounded-3xl p-8">
          <h2 className="mb-6 font-display text-2xl font-semibold text-brand">
            Agenda
          </h2>
          <ScheduleList items={data.schedule} />
        </section>
      </div>
    </main>
  );
};

export default PresentPage;
