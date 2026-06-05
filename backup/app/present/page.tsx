"use client";

import { useEffect, useState } from "react";
import { useEventData } from "@/components/useEventData";
import JoinQR from "@/components/JoinQR";
import PollResults from "@/components/PollResults";
import QuestionClusters from "@/components/QuestionClusters";
import ScheduleList from "@/components/ScheduleList";

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
      <header className="mb-8 flex items-end justify-between">
        <h1 className="text-4xl font-bold">Live Event</h1>
        <p className="text-xl text-white/50">
          {data.questions.length} questions · {data.pollTotal} votes
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="panel flex flex-col items-center justify-center rounded-3xl p-8">
          <h2 className="mb-6 text-2xl font-semibold">Join now</h2>
          {joinUrl ? <JoinQR url={joinUrl} size={260} /> : null}
        </section>

        <section className="panel rounded-3xl p-8 lg:col-span-2">
          <h2 className="mb-6 text-2xl font-semibold text-brand-light">
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
            <p className="text-center text-xl text-white/40">
              No poll open right now.
            </p>
          )}
        </section>

        <section className="panel rounded-3xl p-8 lg:col-span-2">
          <h2 className="mb-6 text-2xl font-semibold text-brand-light">
            Question themes
          </h2>
          <QuestionClusters groups={data.groupedQuestions} large />
        </section>

        <section className="panel rounded-3xl p-8">
          <h2 className="mb-6 text-2xl font-semibold text-brand-light">
            Agenda
          </h2>
          <ScheduleList items={data.schedule} />
        </section>
      </div>
    </main>
  );
};

export default PresentPage;
