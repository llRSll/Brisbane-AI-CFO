"use client";

import type { Question } from "@/lib/types";

type SubmittedQuestionsProps = {
  questions: Question[];
};

const SubmittedQuestions = ({ questions }: SubmittedQuestionsProps) => {
  if (questions.length === 0) {
    return (
      <p className="text-center text-sm text-white/50">
        No questions in the queue yet — be the first to ask.
      </p>
    );
  }

  return (
    <ol className="flex flex-col gap-2.5">
      {questions.map((question) => (
        <li
          key={question.id}
          className="rounded-xl border border-stage-border bg-stage-bg/80 px-4 py-3 text-sm leading-relaxed text-white/85"
        >
          {question.text}
        </li>
      ))}
    </ol>
  );
};

export default SubmittedQuestions;
