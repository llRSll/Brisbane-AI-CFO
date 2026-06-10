"use client";

import type { Poll } from "@/lib/types";

type PollResultsProps = {
  poll: Poll;
  counts: number[];
  total: number;
  large?: boolean;
  present?: boolean;
};

const BAR_COLORS = [
  "bg-brand",
  "bg-accent-green",
  "bg-accent-amber",
  "bg-accent-pink",
  "bg-accent-cyan",
];

const PollResults = ({
  poll,
  counts,
  total,
  large,
  present = false,
}: PollResultsProps) => {
  const questionClass = present
    ? "mb-3 text-lg font-semibold leading-snug"
    : large
      ? "mb-4 text-3xl font-semibold"
      : "mb-4 text-xl font-semibold";

  const optionClass = present ? "text-sm" : large ? "text-xl" : "";
  const barHeight = present ? "h-2" : "h-3";
  const gap = present ? "gap-2" : "gap-3";

  return (
    <div className="w-full">
      <h3 className={questionClass}>{poll.question}</h3>
      <ul className={`flex flex-col ${gap}`}>
        {poll.options.map((option, index) => {
          const count = counts[index] ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <li key={index}>
              <div
                className={`mb-0.5 flex items-center justify-between gap-2 ${present ? "text-xs" : "text-sm"}`}
              >
                <span className={`min-w-0 truncate ${optionClass}`}>{option}</span>
                <span className="shrink-0 tabular-nums text-white/60">
                  {pct}% <span className="text-white/40">({count})</span>
                </span>
              </div>
              <div
                className={`w-full overflow-hidden rounded-full bg-stage-border/80 ${barHeight}`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    BAR_COLORS[index % BAR_COLORS.length]
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      {!present ? (
        <p className="mt-3 text-sm text-white/50">{total} vote(s)</p>
      ) : null}
    </div>
  );
};

export default PollResults;
