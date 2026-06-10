"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useEventData } from "@/components/useEventData";
import PollResults from "@/components/PollResults";
import QuestionClusters from "@/components/QuestionClusters";
import ScheduleList from "@/components/ScheduleList";

const JoinQR = dynamic(() => import("@/components/JoinQR"), { ssr: false });

const PresentPage = () => {
  const data = useEventData();
  const [joinUrl, setJoinUrl] = useState("");

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    setJoinUrl(`${base.replace(/\/$/, "")}/join`);
  }, []);

  return (
    <main className="present-shell stage-gradient">
      <header className="present-header">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">
            Brisbane AI CFO
          </h1>
          <span className="badge">Live</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="stat-pill">{data.questions.length} questions</span>
          <span className="stat-pill">{data.pollTotal} votes</span>
          {data.activePoll ? (
            <span className="rounded-full border border-accent-green/40 bg-accent-green/15 px-3 py-1 text-sm font-medium text-accent-green">
              Poll open
            </span>
          ) : null}
        </div>
      </header>

      <div className="present-grid">
        <section className="present-panel col-span-12 row-span-1 lg:col-span-3">
          <div className="present-panel-head">
            <h2 className="section-label">Join</h2>
          </div>
          <div className="present-panel-body flex items-center justify-center">
            {joinUrl ? <JoinQR url={joinUrl} present /> : null}
          </div>
        </section>

        <section className="present-panel col-span-12 row-span-1 lg:col-span-9">
          <div className="present-panel-head">
            <h2 className="section-label">Live poll</h2>
            {data.activePoll && data.pollTotal > 0 ? (
              <span className="text-xs tabular-nums text-white/45">
                {data.pollTotal} votes
              </span>
            ) : null}
          </div>
          <div className="present-panel-body flex items-center">
            {data.activePoll ? (
              <PollResults
                poll={data.activePoll}
                counts={data.pollCounts}
                total={data.pollTotal}
                present
              />
            ) : (
              <p className="w-full text-center text-sm text-white/40">
                Waiting for the next poll…
              </p>
            )}
          </div>
        </section>

        <section className="present-panel col-span-12 row-span-1 lg:col-span-8">
          <div className="present-panel-head">
            <h2 className="section-label">Q&amp;A themes</h2>
            {data.groupedQuestions.length > 0 ? (
              <span className="text-xs text-white/45">
                {data.groupedQuestions.length} topics
              </span>
            ) : null}
          </div>
          <div className="present-panel-body">
            <QuestionClusters groups={data.groupedQuestions} present />
          </div>
        </section>

        <section className="present-panel col-span-12 row-span-1 lg:col-span-4">
          <div className="present-panel-head">
            <h2 className="section-label">Agenda</h2>
          </div>
          <div className="present-panel-body">
            <ScheduleList items={data.schedule} present />
          </div>
        </section>
      </div>
    </main>
  );
};

export default PresentPage;
