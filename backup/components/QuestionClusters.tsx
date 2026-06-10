"use client";

import type { GroupedQuestions } from "@/lib/types";

type QuestionClustersProps = {
  groups: GroupedQuestions[];
  large?: boolean;
  present?: boolean;
};

const COUNT_COLORS = [
  "bg-brand/25 text-brand-light border-brand/50",
  "bg-accent-pink/20 text-accent-pink border-accent-pink/40",
  "bg-accent-cyan/20 text-accent-cyan border-accent-cyan/40",
  "bg-accent-amber/20 text-accent-amber border-accent-amber/40",
  "bg-accent-green/20 text-accent-green border-accent-green/40",
];

const emptyMessage =
  "No grouped themes yet — questions appear here after admin runs Group.";

const QuestionClusters = ({
  groups,
  large,
  present = false,
}: QuestionClustersProps) => {
  if (groups.length === 0) {
    return (
      <p
        className={`text-center text-white/45 ${present ? "text-sm leading-relaxed" : ""}`}
      >
        {emptyMessage}
      </p>
    );
  }

  return (
    <ol className={`flex flex-col ${present ? "gap-1.5" : "gap-3"}`}>
      {groups.map((group, index) => {
        const count = group.questions.length;
        const question =
          group.proposed_question?.trim() ||
          group.questions[0]?.text ||
          group.label;
        return (
          <li
            key={group.id}
            className={`animate-pop-in flex items-start gap-3 rounded-xl border border-stage-border/60 bg-stage-bg/40 ${
              present ? "px-3 py-2" : "panel gap-4 rounded-2xl p-4"
            }`}
          >
            <span
              className={`flex shrink-0 items-center justify-center rounded-full border font-bold ${
                COUNT_COLORS[index % COUNT_COLORS.length]
              } ${
                present
                  ? "h-8 min-w-8 px-2 text-xs"
                  : large
                    ? "gap-1 px-4 py-2 text-xl"
                    : "px-3 py-1 text-sm"
              }`}
            >
              {count}
            </span>
            <p
              className={`min-w-0 font-medium leading-snug text-white/90 ${
                present ? "text-sm" : large ? "text-2xl" : "text-base"
              }`}
            >
              {question}
            </p>
          </li>
        );
      })}
    </ol>
  );
};

export default QuestionClusters;
