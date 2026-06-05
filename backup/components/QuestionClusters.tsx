"use client";

import type { GroupedQuestions } from "@/lib/types";

type QuestionClustersProps = {
  groups: GroupedQuestions[];
  large?: boolean;
};

const COUNT_COLORS = [
  "bg-brand/20 text-brand-light border-brand/40",
  "bg-accent-pink/20 text-accent-pink border-accent-pink/40",
  "bg-accent-cyan/20 text-accent-cyan border-accent-cyan/40",
  "bg-accent-amber/20 text-accent-amber border-accent-amber/40",
  "bg-accent-green/20 text-accent-green border-accent-green/40",
];

const QuestionClusters = ({ groups, large }: QuestionClustersProps) => {
  if (groups.length === 0) {
    return (
      <p className="text-center text-white/50">
        No questions grouped yet. Themes will appear here as a single
        generalised question per topic.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {groups.map((group, index) => {
        const count = group.questions.length;
        const proposed =
          group.proposed_question?.trim() ||
          group.questions[0]?.text ||
          group.label;
        return (
          <li
            key={group.id}
            className="animate-pop-in panel flex items-center gap-4 rounded-2xl p-4"
          >
            <div
              className={`flex shrink-0 flex-col items-center justify-center rounded-full border ${
                COUNT_COLORS[index % COUNT_COLORS.length]
              } ${large ? "h-20 w-20" : "h-14 w-14"}`}
            >
              <span className={`font-bold ${large ? "text-3xl" : "text-xl"}`}>
                {count}
              </span>
              <span className="text-[10px] uppercase tracking-wide opacity-70">
                merged
              </span>
            </div>
            <div className="min-w-0">
              <p
                className={`font-semibold leading-snug ${
                  large ? "text-2xl" : "text-base"
                }`}
              >
                {proposed}
              </p>
              <p
                className={`mt-1 uppercase tracking-wide text-white/40 ${
                  large ? "text-sm" : "text-xs"
                }`}
              >
                {group.label}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default QuestionClusters;
