"use client";

import type { ScheduleItem } from "@/lib/types";

type ScheduleListProps = {
  items: ScheduleItem[];
  large?: boolean;
  present?: boolean;
};

const ScheduleList = ({ items, large, present = false }: ScheduleListProps) => {
  if (items.length === 0) {
    return (
      <p
        className={`text-center text-white/45 ${present ? "text-sm" : ""}`}
      >
        Agenda publishes here once ready.
      </p>
    );
  }

  return (
    <ol className={`flex flex-col ${present ? "gap-1" : "gap-3"}`}>
      {items.map((item) => (
        <li
          key={item.id}
          className={`flex items-start gap-3 rounded-lg border border-stage-border/50 bg-stage-bg/30 ${
            present ? "px-2.5 py-2" : "panel gap-4 rounded-xl p-4"
          }`}
        >
          <div
            className={`shrink-0 font-semibold tabular-nums text-brand-light ${
              present ? "w-[4.5rem] text-[11px] leading-tight" : large ? "w-40 text-xl" : "w-24 text-sm"
            }`}
          >
            {item.start_time ?? "—"}
            {item.end_time && !present ? ` – ${item.end_time}` : null}
          </div>
          <div className="min-w-0">
            <p
              className={`font-semibold leading-snug ${
                present ? "text-sm" : large ? "text-2xl" : "text-base"
              }`}
            >
              {item.title}
            </p>
            {item.speaker ? (
              <p className={`text-white/55 ${present ? "text-[11px]" : "text-sm"}`}>
                {item.speaker}
              </p>
            ) : null}
            {item.description && !present ? (
              <p className="mt-1 text-sm text-white/50">{item.description}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
};

export default ScheduleList;
