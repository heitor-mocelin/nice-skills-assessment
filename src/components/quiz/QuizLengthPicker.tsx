"use client";

import { QuestionsPerSubdomain } from "@/types/nice";
import {
  QUESTIONS_PER_SUBDOMAIN_OPTIONS,
  getOrderedSubdomains,
  isAllQuestionsMode,
} from "@/lib/quizEngine";

const OPTION_COPY: Record<
  QuestionsPerSubdomain,
  { label: string; blurb: string }
> = {
  10: { label: "10 per section", blurb: "Quickest — a solid snapshot of each area." },
  20: { label: "20 per section", blurb: "More precise — better signal on where you stand." },
  30: {
    label: "All questions",
    blurb: "Every question in every section — the most accurate read, but no skipping.",
  },
};

interface QuizLengthPickerProps {
  selected: QuestionsPerSubdomain;
  onSelect: (value: QuestionsPerSubdomain) => void;
  onStart: () => void;
}

/**
 * Shown once, right before Stage 2 begins: lets the user choose how many
 * questions to answer per sub-domain (out of the 30-question pool). More
 * questions means a more precise result; choosing "All questions" uses the
 * entire pool, so there's nothing left in reserve to skip to — the skip
 * mechanics (both per-question and per-section) are disabled in that mode.
 */
export function QuizLengthPicker({ selected, onSelect, onStart }: QuizLengthPickerProps) {
  const subdomainCount = getOrderedSubdomains().length;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          How many questions would you like to answer?
        </h2>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          The more questions you answer, the more precise your results will be.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {QUESTIONS_PER_SUBDOMAIN_OPTIONS.map((option) => {
            const isSelected = selected === option;
            const total = option * subdomainCount;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onSelect(option)}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 ring-1 ring-indigo-500"
                    : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {OPTION_COPY[option].label}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {total} questions total
                </p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {OPTION_COPY[option].blurb}
                </p>
              </button>
            );
          })}
        </div>

        {isAllQuestionsMode(selected) && (
          <p className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-950/40 p-3 text-xs font-medium text-amber-800 dark:text-amber-300">
            ⚠️ With all questions selected, there are no spare questions left in reserve — so
            skipping a question or an entire section won&apos;t be available.
          </p>
        )}

        <button
          type="button"
          onClick={onStart}
          className="mt-5 w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition-opacity hover:opacity-90"
        >
          Start Assessment →
        </button>
      </div>
    </div>
  );
}
