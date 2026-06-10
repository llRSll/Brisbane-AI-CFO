"use client";

import { useCallback, useEffect, useState } from "react";
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
  "No grouped themes yet — the host groups questions from the queue in admin.";

const GroupDetailModal = ({
  group,
  colorClass,
  onClose,
}: {
  group: GroupedQuestions;
  colorClass: string;
  onClose: () => void;
}) => {
  const title =
    group.proposed_question?.trim() ||
    group.questions[0]?.text ||
    group.label;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="group-detail-title"
      onClick={onClose}
    >
      <div
        className="panel-glow panel max-h-[80vh] w-full max-w-lg overflow-hidden rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-stage-border px-5 py-4">
          <div className="flex min-w-0 items-start gap-3">
            <span
              className={`flex shrink-0 items-center justify-center rounded-full border px-3 py-1 text-sm font-bold ${colorClass}`}
            >
              {group.questions.length}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
                Grouped theme
              </p>
              <h3
                id="group-detail-title"
                className="mt-1 font-semibold leading-snug text-white"
              >
                {title}
              </h3>
              {group.label && group.label !== title ? (
                <p className="mt-1 text-sm text-white/50">{group.label}</p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-stage-border px-2.5 py-1 text-sm text-white/60 transition hover:border-white/30 hover:text-white"
            aria-label="Close group details"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
            Individual questions ({group.questions.length})
          </p>
          <ol className="flex flex-col gap-2">
            {group.questions.map((question, index) => (
              <li
                key={question.id}
                className="flex gap-3 rounded-lg border border-stage-border bg-stage-bg/60 px-3 py-2.5"
              >
                <span className="shrink-0 text-xs font-bold tabular-nums text-white/35">
                  {index + 1}
                </span>
                <p className="text-sm leading-snug text-white/85">{question.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

const QuestionClusters = ({
  groups,
  large,
  present = false,
}: QuestionClustersProps) => {
  const [selectedGroup, setSelectedGroup] = useState<GroupedQuestions | null>(
    null,
  );
  const [selectedColor, setSelectedColor] = useState("");

  const handleOpenGroup = (group: GroupedQuestions, colorClass: string) => {
    setSelectedGroup(group);
    setSelectedColor(colorClass);
  };

  const handleCloseGroup = () => {
    setSelectedGroup(null);
    setSelectedColor("");
  };

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
    <>
      <ol className={`flex flex-col ${present ? "gap-1.5" : "gap-3"}`}>
        {groups.map((group, index) => {
          const count = group.questions.length;
          const question =
            group.proposed_question?.trim() ||
            group.questions[0]?.text ||
            group.label;
          const colorClass = COUNT_COLORS[index % COUNT_COLORS.length];

          return (
            <li key={group.id}>
              <button
                type="button"
                onClick={() => handleOpenGroup(group, colorClass)}
                className={`animate-pop-in flex w-full cursor-pointer items-start gap-3 rounded-xl border border-stage-border bg-stage-bg/80 text-left transition hover:border-brand/40 hover:bg-stage-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  present ? "px-3 py-2" : "p-4"
                }`}
                aria-label={`View ${count} grouped questions: ${question}`}
              >
                <span
                  className={`flex shrink-0 items-center justify-center rounded-full border font-bold ${colorClass} ${
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
              </button>
            </li>
          );
        })}
      </ol>

      {selectedGroup ? (
        <GroupDetailModal
          group={selectedGroup}
          colorClass={selectedColor}
          onClose={handleCloseGroup}
        />
      ) : null}
    </>
  );
};

export default QuestionClusters;
