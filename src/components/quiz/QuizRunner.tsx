"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAssessment } from "@/context/AssessmentContext";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import {
  buildQuizQueue,
  getCompletedQuestionCount,
  getDomainIdForSubdomain,
  getFirstNonEmptySubdomainIndex,
  getNextPosition,
  getOrderedSubdomains,
  getPreviousPosition,
  getQuestionById,
  getTotalQuestionCount,
  MAX_SKIPS_PER_DOMAIN,
} from "@/lib/quizEngine";
import { getSubdomainColor } from "@/lib/domainColors";

export function QuizRunner() {
  const router = useRouter();
  const {
    state,
    isHydrated,
    startQuiz,
    recordResponse,
    advanceQuestion,
    skipQuestion,
    remainingSkips,
    skipSubdomain,
    completeQuiz,
  } = useAssessment();

  const hasQueue = getTotalQuestionCount(state.quizQuestionIds) > 0;
  const orderedSubdomains = useMemo(() => getOrderedSubdomains(), []);

  // Initialize the quiz queue on first arrival at this stage (client-only,
  // after hydration so we don't clobber a queue restored from localStorage).
  useEffect(() => {
    if (!isHydrated || hasQueue) return;
    const queue = buildQuizQueue();
    startQuiz(queue);
  }, [isHydrated, hasQueue, startQuiz]);

  const currentSubdomain = orderedSubdomains[state.currentSubdomainIndex];
  const currentQuestionIds = state.quizQuestionIds[currentSubdomain?.id] ?? [];
  const currentQuestionId = currentQuestionIds[state.currentQuestionIndex];
  const currentQuestion = currentQuestionId ? getQuestionById(currentQuestionId) : undefined;

  const totalQuestions = useMemo(
    () => getTotalQuestionCount(state.quizQuestionIds),
    [state.quizQuestionIds]
  );
  const completedQuestions = useMemo(
    () =>
      getCompletedQuestionCount(
        state.quizQuestionIds,
        state.currentSubdomainIndex,
        state.currentQuestionIndex
      ),
    [state.quizQuestionIds, state.currentSubdomainIndex, state.currentQuestionIndex]
  );

  // Defensive fallback: queue exists but position points nowhere valid
  // (e.g., stale localStorage after question data changes) — reset position
  // to the first available question rather than crashing.
  useEffect(() => {
    if (isHydrated && hasQueue && !currentQuestion) {
      const firstIndex = getFirstNonEmptySubdomainIndex(state.quizQuestionIds);
      advanceQuestion(firstIndex, 0);
    }
  }, [isHydrated, hasQueue, currentQuestion, state.quizQuestionIds, advanceQuestion]);

  // Redirect to /results whenever the quiz reaches its completed stage —
  // covers both normal completion (last question answered) and completion
  // triggered by skipping the final remaining sub-domain.
  useEffect(() => {
    if (state.currentStage === "results") {
      router.push("/results");
    }
  }, [state.currentStage, router]);

  const existingResponse = currentQuestion
    ? state.responses.find((r) => r.questionId === currentQuestion.id) ?? null
    : null;

  const previousPosition = currentQuestion
    ? getPreviousPosition(
        state.quizQuestionIds,
        state.currentSubdomainIndex,
        state.currentQuestionIndex
      )
    : null;

  const handleBack = () => {
    if (!previousPosition) return;
    advanceQuestion(previousPosition.subdomainIndex, previousPosition.questionIndex);
  };

  const handleSkip = () => {
    if (!currentQuestion || !currentSubdomain) return;
    const domainId = getDomainIdForSubdomain(currentSubdomain.id);
    if (!domainId) return;
    skipQuestion(currentSubdomain.id, domainId, currentQuestion.id, currentQuestion.tier);
  };

  const handleSkipSubdomain = () => {
    if (!currentSubdomain) return;
    const confirmed = window.confirm(
      `Skip the entire "${currentSubdomain.title}" (${currentSubdomain.id}) section? ` +
        "Any answers already given in this section will be cleared, and it will show as 0% (skipped) on your final report."
    );
    if (!confirmed) return;
    skipSubdomain(currentSubdomain.id);
  };

  const handleSubmit = (result: {
    selectedOptionId: string | null;
    idkSelected: boolean;
    isCorrect: boolean;
    pointsEarned: number;
    notes: string;
  }) => {
    if (!currentQuestion || !currentSubdomain) return;

    recordResponse({
      questionId: currentQuestion.id,
      domainId: currentQuestion.domainId,
      subdomainId: currentQuestion.subdomainId,
      selectedOptionId: result.selectedOptionId,
      idkSelected: result.idkSelected,
      isCorrect: result.isCorrect,
      pointsEarned: result.pointsEarned,
      notes: result.notes,
      answeredAt: Date.now(),
    });

    const next = getNextPosition(
      state.quizQuestionIds,
      state.currentSubdomainIndex,
      state.currentQuestionIndex
    );

    if (next) {
      advanceQuestion(next.subdomainIndex, next.questionIndex);
    } else {
      completeQuiz();
      router.push("/results");
    }
  };

  if (!isHydrated || !hasQueue || !currentQuestion || !currentSubdomain) {
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-slate-400">
        Loading quiz…
      </div>
    );
  }

  const progressPercent = Math.round((completedQuestions / totalQuestions) * 100);
  const domainId = getDomainIdForSubdomain(currentSubdomain.id);
  const skipsRemaining = domainId ? remainingSkips(domainId) : 0;
  const accentColor = getSubdomainColor(currentSubdomain.id);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            {completedQuestions} / {totalQuestions} questions
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progressPercent}%`, backgroundColor: accentColor }}
          />
        </div>
        {domainId && (
          <p className="mt-1.5 text-right text-xs text-slate-400">
            {skipsRemaining}/{MAX_SKIPS_PER_DOMAIN} skips left in {domainId}
          </p>
        )}
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={handleSkipSubdomain}
            className="text-xs font-medium text-slate-400 underline decoration-dotted underline-offset-2 transition-colors hover:text-red-500 dark:hover:text-red-400"
          >
            Skip this entire section ({currentSubdomain.id}) →
          </button>
        </div>
      </div>

      <QuestionCard
        key={currentQuestion.id}
        question={currentQuestion}
        questionNumber={state.currentQuestionIndex + 1}
        totalInSubdomain={currentQuestionIds.length}
        existingResponse={existingResponse}
        canGoBack={previousPosition !== null}
        skipsRemaining={skipsRemaining}
        accentColor={accentColor}
        onSubmit={handleSubmit}
        onBack={handleBack}
        onSkip={handleSkip}
      />
    </div>
  );
}
