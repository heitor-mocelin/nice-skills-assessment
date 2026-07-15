"use client";

import { useState } from "react";
import { Question, QuestionResponse } from "@/types/nice";

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Very Easy",
  2: "Easy",
  3: "Moderate",
  4: "Hard",
  5: "Expert",
};

const TIER_LABELS: Record<Question["tier"], string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

interface QuestionCardProps {
  question: Question;
  questionNumber: number; // 1-based within the sub-domain
  totalInSubdomain: number;
  /** Previously recorded response for this question, if the user navigated back to review it. */
  existingResponse: QuestionResponse | null;
  canGoBack: boolean;
  /** Skips remaining for this question's parent domain (0 disables the Skip button). */
  skipsRemaining: number;
  /** This question's sub-domain shade (see src/lib/domainColors.ts) — used for the badge and selection accents. */
  accentColor: string;
  onSubmit: (result: {
    selectedOptionId: string | null;
    idkSelected: boolean;
    isCorrect: boolean;
    pointsEarned: number;
    notes: string;
  }) => void;
  onBack: () => void;
  onSkip: () => void;
}

/**
 * Renders a single quiz question: multiple-choice options, a dedicated
 * "I don't know" button, a notes textarea, difficulty metadata, and submits
 * the result. Shows immediate correct/incorrect feedback with the
 * explanation before the user advances to the next question. Supports
 * reviewing a previously-answered question (via Back) and skipping the
 * current question for a same-difficulty replacement.
 */
export function QuestionCard({
  question,
  questionNumber,
  totalInSubdomain,
  existingResponse,
  canGoBack,
  skipsRemaining,
  accentColor,
  onSubmit,
  onBack,
  onSkip,
}: QuestionCardProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    existingResponse?.selectedOptionId ?? null
  );
  const [idkSelected, setIdkSelected] = useState(existingResponse?.idkSelected ?? false);
  const [notes, setNotes] = useState(existingResponse?.notes ?? "");
  const [hasAnswered, setHasAnswered] = useState(existingResponse !== null);

  const canSubmit = (selectedOptionId !== null || idkSelected) && !hasAnswered;

  const handleSelectOption = (optionId: string) => {
    if (hasAnswered) return;
    setSelectedOptionId(optionId);
    setIdkSelected(false);
  };

  const handleIdk = () => {
    if (hasAnswered) return;
    setIdkSelected(true);
    setSelectedOptionId(null);
  };

  const handleSubmitAnswer = () => {
    if (!canSubmit) return;
    setHasAnswered(true);
  };

  const isCorrect = selectedOptionId === question.correctOptionId;
  const pointsEarned = idkSelected || !isCorrect ? 0 : question.points;

  const handleContinue = () => {
    onSubmit({
      selectedOptionId,
      idkSelected,
      isCorrect: !idkSelected && isCorrect,
      pointsEarned,
      notes,
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span
          className="rounded-full px-2.5 py-1 font-medium"
          style={{ backgroundColor: `${accentColor}1a`, color: accentColor }}
        >
          {question.subdomainId} · Question {questionNumber} of {totalInSubdomain}
        </span>
        <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 font-medium text-slate-500 dark:text-slate-400">
          {TIER_LABELS[question.tier]} · {DIFFICULTY_LABELS[question.difficulty]} (
          {question.difficulty}/5)
        </span>
      </div>

      <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
        {question.prompt}
      </h2>

      <div className="mt-5 space-y-2">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const showCorrect = hasAnswered && option.id === question.correctOptionId;
          const showIncorrectSelection =
            hasAnswered && isSelected && option.id !== question.correctOptionId;

          return (
            <button
              key={option.id}
              type="button"
              disabled={hasAnswered}
              onClick={() => handleSelectOption(option.id)}
              className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${
                showCorrect
                  ? "border-green-400 bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300"
                  : showIncorrectSelection
                  ? "border-red-400 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300"
                  : isSelected
                  ? "text-slate-900 dark:text-slate-100"
                  : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              } ${hasAnswered ? "cursor-default" : "cursor-pointer"}`}
              style={
                isSelected && !showCorrect && !showIncorrectSelection
                  ? { borderColor: accentColor, backgroundColor: `${accentColor}14` }
                  : undefined
              }
            >
              <span className="mr-2 font-semibold uppercase">{option.id}.</span>
              {option.text}
            </button>
          );
        })}

        <button
          type="button"
          disabled={hasAnswered}
          onClick={handleIdk}
          className={`w-full rounded-lg border border-dashed p-3 text-left text-sm font-medium transition-colors ${
            idkSelected
              ? "border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
              : "border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-amber-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          } ${hasAnswered ? "cursor-default" : "cursor-pointer"}`}
        >
          🤷 I don&apos;t know
        </button>
      </div>

      {hasAnswered && (
        <div
          className={`mt-4 rounded-lg p-4 text-sm ${
            idkSelected
              ? "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
              : isCorrect
              ? "bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300"
              : "bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300"
          }`}
        >
          <p className="font-semibold">
            {idkSelected
              ? "Marked as \u201cI don't know\u201d — 0 points, but noted as a blind spot."
              : isCorrect
              ? `Correct! +${pointsEarned} points`
              : "Not quite — 0 points"}
          </p>
          {question.explanation && <p className="mt-1.5">{question.explanation}</p>}
        </div>
      )}

      <div className="mt-5">
        <label
          htmlFor={`notes-${question.id}`}
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Notes (optional) — jot down your reasoning or thoughts:
        </label>
        <textarea
          id={`notes-${question.id}`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Optional notes..."
          className="mt-2 w-full resize-y rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          className="shrink-0 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Back
        </button>

        {!hasAnswered ? (
          <button
            type="button"
            onClick={handleSubmitAnswer}
            disabled={!canSubmit}
            className="flex-1 rounded-lg py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
            style={canSubmit ? { backgroundColor: accentColor } : undefined}
          >
            Submit Answer
          </button>
        ) : (
          <button
            type="button"
            onClick={handleContinue}
            className="flex-1 rounded-lg py-3 font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: accentColor }}
          >
            Continue →
          </button>
        )}
      </div>

      {!hasAnswered && (
        <button
          type="button"
          onClick={onSkip}
          disabled={skipsRemaining <= 0}
          className="mt-3 w-full rounded-lg border border-dashed border-slate-300 dark:border-slate-600 py-2.5 text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          title={
            skipsRemaining <= 0
              ? "No skips remaining for this domain"
              : `Swap this question for another of the same difficulty (${skipsRemaining} skip${
                  skipsRemaining === 1 ? "" : "s"
                } left in this domain)`
          }
        >
          ⏭ Skip this question — get another {TIER_LABELS[question.tier].toLowerCase()} one (
          {skipsRemaining} left in this domain)
        </button>
      )}
    </div>
  );
}
