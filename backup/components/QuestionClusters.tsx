"use client";

import type { GroupedQuestions } from "@/lib/types";

type QuestionClustersProps = {
  groups: GroupedQuestions[];
  large?: boolean;
};

const BUBBLE_COLORS = [
  "from-brand/30 to-brand/5 border-brand/40",
  "from-accent-pink/30 to-accent-pink/5 border-accent-pink/40",
  "from-accent-cyan/30 to-accent-cyan/5 border-accent-cyan/40",
  "from-accent-amber/30 to-accent-amber/5 border-accent-amber/40",
  "from-accent-green/30 to-accent-green/5 border-accent-green/40",
];

// Scale a cluster's visual size by how many questions it merged.
const sizeFor = (count: number, large: boolean): string => {
  const base = large ? 150 : 110;
  const px = base + Math.min(count - 1, 8) * (large ? 26 : 16);
  return `${px}px`;
};

const QuestionClusters = ({ groups, large }: QuestionClustersProps) => {
  if (groups.length === 0) {
    return (
      <p className="text-center text-white/50">
        No questions grouped yet. They will appear here as themes.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {groups.map((group, index) => {
        const dimension = sizeFor(group.questions.length, Boolean(large));
        return (
          <div
            key={group.id}
            className={`animate-pop-in flex flex-col items-center justify-center rounded-full border bg-gradient-to-br p-4 text-center ${
              BUBBLE_COLORS[index % BUBBLE_COLORS.length]
            }`}
            style={{ width: dimension, height: dimension }}
            title={group.summary ?? group.label}
          >
            <span
              className={`font-bold ${large ? "text-2xl" : "text-base"}`}
            >
              {group.questions.length}
            </span>
            <span
              className={`mt-1 line-clamp-3 px-1 leading-tight text-white/80 ${
                large ? "text-base" : "text-xs"
              }`}
            >
              {group.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default QuestionClusters;
