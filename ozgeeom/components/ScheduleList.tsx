"use client";

import type { ScheduleItem } from "@/lib/types";

type ScheduleListProps = {
  items: ScheduleItem[];
  large?: boolean;
};

const ScheduleList = ({ items, large }: ScheduleListProps) => {
  if (items.length === 0) {
    return (
      <p className="text-center text-ink-muted">
        The agenda will appear here once it is published.
      </p>
    );
  }

  return (
    <ol className="flex flex-col gap-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="panel flex items-start gap-4 rounded-xl p-4"
        >
          <div
            className={`shrink-0 font-semibold text-brand ${
              large ? "w-40 text-xl" : "w-24 text-sm"
            }`}
          >
            {item.start_time ?? "—"}
            {item.end_time ? ` – ${item.end_time}` : ""}
          </div>
          <div className="min-w-0">
            <p
              className={`font-semibold text-ink ${
                large ? "text-2xl" : "text-base"
              }`}
            >
              {item.title}
            </p>
            {item.speaker ? (
              <p className="text-sm text-ink-muted">{item.speaker}</p>
            ) : null}
            {item.description ? (
              <p className="mt-1 text-sm text-ink-faint">{item.description}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
};

export default ScheduleList;
