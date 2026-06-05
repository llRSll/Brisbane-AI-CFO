"use client";

import type { Poll } from "@/lib/types";

type PollResultsProps = {
  poll: Poll;
  counts: number[];
  total: number;
  large?: boolean;
};

const BAR_COLORS = [
  "bg-brand",
  "bg-accent-green",
  "bg-accent-amber",
  "bg-accent-pink",
  "bg-accent-cyan",
];

const PollResults = ({ poll, counts, total, large }: PollResultsProps) => {
  return (
    <div className="w-full">
      <h3
        className={`mb-4 font-semibold ${large ? "text-3xl" : "text-xl"}`}
      >
        {poll.question}
      </h3>
      <ul className="flex flex-col gap-3">
        {poll.options.map((option, index) => {
          const count = counts[index] ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <li key={index}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className={large ? "text-xl" : ""}>{option}</span>
                <span className="tabular-nums text-white/70">
                  {pct}% ({count})
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-stage-border">
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
      <p className="mt-3 text-sm text-white/50">{total} vote(s)</p>
    </div>
  );
};

export default PollResults;
