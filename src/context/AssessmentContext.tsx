"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  AssessmentState,
  DomainId,
  FamiliarityRating,
  QuestionResponse,
  QuestionsPerSubdomain,
  SubdomainBaseline,
  SubdomainId,
} from "@/types/nice";
import {
  getServerSnapshot,
  getSnapshot,
  resetAssessmentState,
  setAssessmentState,
  subscribe,
} from "@/lib/assessmentStore";
import {
  MAX_SKIPS_PER_DOMAIN,
  findNextNonEmptySubdomainIndexFrom,
  findReplacementQuestion,
  getOrderedSubdomains,
  isAllQuestionsMode,
} from "@/lib/quizEngine";

type SubdomainMetaPatch = Partial<Pick<SubdomainBaseline, "isFocusArea" | "notes">>;

interface AssessmentContextValue {
  state: AssessmentState;
  /** true once the client has mounted and the useSyncExternalStore snapshot reflects localStorage */
  isHydrated: boolean;
  getSubdomainBaseline: (subdomainId: SubdomainId) => SubdomainBaseline | null;
  /** Rates a single topic (bullet point) within a sub-domain, 0-4. */
  setTopicRating: (
    subdomainId: SubdomainId,
    domainId: DomainId,
    topicIndex: number,
    rating: FamiliarityRating
  ) => void;
  /** Updates the sub-domain's career-focus flag and/or free-text notes. */
  updateSubdomainMeta: (
    subdomainId: SubdomainId,
    domainId: DomainId,
    patch: SubdomainMetaPatch
  ) => void;
  completeBaseline: () => void;
  /** Skips Stage 1 entirely — jumps straight to the quiz with no baseline recorded. */
  skipBaseline: () => void;
  startQuiz: (
    quizQuestionIds: Record<SubdomainId, string[]>,
    questionsPerSubdomain: QuestionsPerSubdomain
  ) => void;
  recordResponse: (response: QuestionResponse) => void;
  advanceQuestion: (subdomainIndex: number, questionIndex: number) => void;
  /**
   * Skips the current question, swapping it for an unused same-tier
   * question from the same sub-domain's pool (up to MAX_SKIPS_PER_DOMAIN
   * per parent domain). Returns false if the domain's skip cap is reached
   * or no replacement is available.
   */
  skipQuestion: (
    subdomainId: SubdomainId,
    domainId: DomainId,
    questionId: string,
    tier: "easy" | "medium" | "hard"
  ) => boolean;
  remainingSkips: (domainId: DomainId) => number;
  /**
   * Skips an entire sub-domain's remaining questions in one action (distinct
   * from skipping a single question). Clears the sub-domain's queue and any
   * already-recorded responses for it, marks it as explicitly skipped, and
   * advances to the next available sub-domain (or completes the quiz if
   * none remain). No-op if the sub-domain is already fully skipped.
   */
  skipSubdomain: (subdomainId: SubdomainId) => void;
  isSubdomainSkipped: (subdomainId: SubdomainId) => boolean;
  completeQuiz: () => void;
  resetAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

// Stable references for the hydration flag below — `useSyncExternalStore`
// is the React-recommended way to know "have we hydrated on the client
// yet?" without the cascading-render pitfalls of setState-in-an-effect: the
// server snapshot is false, the client snapshot is true, and React handles
// swapping from one to the other safely after hydration completes.
const subscribeNever = () => () => {};
const getHydratedSnapshot = () => true;
const getHydratingServerSnapshot = () => false;

function ensureBaselineEntry(
  prev: AssessmentState,
  subdomainId: SubdomainId,
  domainId: DomainId
): SubdomainBaseline {
  return (
    prev.baseline.find((b) => b.subdomainId === subdomainId) ?? {
      subdomainId,
      domainId,
      topicRatings: {},
      isFocusArea: null,
      notes: "",
    }
  );
}

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  // Synchronizes with the external localStorage-backed store. On the server
  // and during the first client render this returns the empty initial state
  // (avoiding hydration mismatches); React then re-renders with the real
  // persisted value once mounted.
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // `typeof window !== "undefined"` is true even during the client's first
  // (hydration) render pass, not just after mount — so using it directly
  // here caused hydration mismatches for any UI that renders differently
  // once "hydrated" (e.g. a picker screen replacing a loading placeholder).
  // This mirrors `state` above: false on the server/hydration pass, true
  // once the client has taken over.
  const isHydrated = useSyncExternalStore(
    subscribeNever,
    getHydratedSnapshot,
    getHydratingServerSnapshot
  );

  const getSubdomainBaseline = useCallback(
    (subdomainId: SubdomainId): SubdomainBaseline | null => {
      return state.baseline.find((b) => b.subdomainId === subdomainId) ?? null;
    },
    [state.baseline]
  );

  const setTopicRating = useCallback(
    (
      subdomainId: SubdomainId,
      domainId: DomainId,
      topicIndex: number,
      rating: FamiliarityRating
    ) => {
      setAssessmentState((prev) => {
        const existing = ensureBaselineEntry(prev, subdomainId, domainId);
        const next: SubdomainBaseline = {
          ...existing,
          topicRatings: { ...existing.topicRatings, [topicIndex]: rating },
        };
        return {
          ...prev,
          currentStage: prev.currentStage === "not-started" ? "baseline" : prev.currentStage,
          baseline: [...prev.baseline.filter((b) => b.subdomainId !== subdomainId), next],
        };
      });
    },
    []
  );

  const updateSubdomainMeta = useCallback(
    (subdomainId: SubdomainId, domainId: DomainId, patch: SubdomainMetaPatch) => {
      setAssessmentState((prev) => {
        const existing = ensureBaselineEntry(prev, subdomainId, domainId);
        const next: SubdomainBaseline = { ...existing, ...patch };
        return {
          ...prev,
          baseline: [...prev.baseline.filter((b) => b.subdomainId !== subdomainId), next],
        };
      });
    },
    []
  );

  const completeBaseline = useCallback(() => {
    setAssessmentState((prev) => ({
      ...prev,
      currentStage: "quiz",
      startedAt: prev.startedAt ?? Date.now(),
    }));
  }, []);

  const skipBaseline = useCallback(() => {
    setAssessmentState((prev) => ({
      ...prev,
      currentStage: "quiz",
      baselineSkipped: true,
      startedAt: prev.startedAt ?? Date.now(),
    }));
  }, []);

  const startQuiz = useCallback(
    (quizQuestionIds: Record<SubdomainId, string[]>, questionsPerSubdomain: QuestionsPerSubdomain) => {
      setAssessmentState((prev) => ({
        ...prev,
        quizQuestionIds,
        questionsPerSubdomain,
        currentSubdomainIndex: 0,
        currentQuestionIndex: 0,
      }));
    },
    []
  );

  const recordResponse = useCallback((response: QuestionResponse) => {
    setAssessmentState((prev) => ({
      ...prev,
      responses: [
        ...prev.responses.filter((r) => r.questionId !== response.questionId),
        response,
      ],
    }));
  }, []);

  const advanceQuestion = useCallback((subdomainIndex: number, questionIndex: number) => {
    setAssessmentState((prev) => ({
      ...prev,
      currentSubdomainIndex: subdomainIndex,
      currentQuestionIndex: questionIndex,
    }));
  }, []);

  const remainingSkips = useCallback(
    (domainId: DomainId): number => {
      if (isAllQuestionsMode(state.questionsPerSubdomain)) return 0;
      return MAX_SKIPS_PER_DOMAIN - (state.skipsUsedByDomain[domainId] ?? 0);
    },
    [state.skipsUsedByDomain, state.questionsPerSubdomain]
  );

  const skipQuestion = useCallback(
    (
      subdomainId: SubdomainId,
      domainId: DomainId,
      questionId: string,
      tier: "easy" | "medium" | "hard"
    ): boolean => {
      const prev = getSnapshot();
      if (isAllQuestionsMode(prev.questionsPerSubdomain)) return false;
      const usedSoFar = prev.skipsUsedByDomain[domainId] ?? 0;
      if (usedSoFar >= MAX_SKIPS_PER_DOMAIN) return false;

      const allQueuedIds = new Set(Object.values(prev.quizQuestionIds).flat());
      const replacement = findReplacementQuestion(subdomainId, tier, allQueuedIds);
      if (!replacement) return false;

      setAssessmentState((p) => {
        const currentQueue = p.quizQuestionIds[subdomainId] ?? [];
        const swapIndex = currentQueue.indexOf(questionId);
        if (swapIndex === -1) return p;

        const nextQueue = [...currentQueue];
        nextQueue[swapIndex] = replacement.id;

        return {
          ...p,
          quizQuestionIds: { ...p.quizQuestionIds, [subdomainId]: nextQueue },
          skipsUsedByDomain: {
            ...p.skipsUsedByDomain,
            [domainId]: (p.skipsUsedByDomain[domainId] ?? 0) + 1,
          },
        };
      });

      return true;
    },
    []
  );

  const isSubdomainSkipped = useCallback(
    (subdomainId: SubdomainId): boolean => {
      return state.skippedSubdomains.includes(subdomainId);
    },
    [state.skippedSubdomains]
  );

  const skipSubdomain = useCallback((subdomainId: SubdomainId) => {
    setAssessmentState((prev) => {
      if (isAllQuestionsMode(prev.questionsPerSubdomain)) return prev;
      if (prev.skippedSubdomains.includes(subdomainId)) return prev;

      const nextQueue: Record<SubdomainId, string[]> = {
        ...prev.quizQuestionIds,
        [subdomainId]: [],
      };
      const nextSkippedSubdomains = [...prev.skippedSubdomains, subdomainId];
      // Drop any responses already recorded for this sub-domain so the
      // results dashboard shows it as a clean, explicit zero rather than a
      // partial score blended in with the skip.
      const nextResponses = prev.responses.filter((r) => r.subdomainId !== subdomainId);

      const ordered = getOrderedSubdomains();
      let currentSubdomainIndex = prev.currentSubdomainIndex;
      let currentQuestionIndex = prev.currentQuestionIndex;
      let currentStage = prev.currentStage;
      let completedAt = prev.completedAt;

      // Advance whenever the sub-domain the user is currently sitting on has
      // run out of questions — rather than only when it exactly matches the
      // sub-domain just skipped. Comparing IDs here left a window where a
      // stale/out-of-sync currentSubdomainIndex (e.g. a concurrent position
      // reset) would silently mark the sub-domain as skipped without ever
      // moving the user forward, making "confirm" appear to do nothing.
      const currentSubdomainHasQuestionsLeft =
        (nextQueue[ordered[currentSubdomainIndex]?.id]?.length ?? 0) > 0;

      if (!currentSubdomainHasQuestionsLeft) {
        const nextIndex = findNextNonEmptySubdomainIndexFrom(nextQueue, currentSubdomainIndex);
        if (nextIndex !== null) {
          currentSubdomainIndex = nextIndex;
          currentQuestionIndex = 0;
        } else {
          // Nothing left ahead — the quiz is complete.
          currentStage = "results";
          completedAt = completedAt ?? Date.now();
        }
      }

      return {
        ...prev,
        quizQuestionIds: nextQueue,
        skippedSubdomains: nextSkippedSubdomains,
        responses: nextResponses,
        currentSubdomainIndex,
        currentQuestionIndex,
        currentStage,
        completedAt,
      };
    });
  }, []);

  const completeQuiz = useCallback(() => {
    setAssessmentState((prev) => ({
      ...prev,
      currentStage: "results",
      completedAt: Date.now(),
    }));
  }, []);

  const resetAssessment = useCallback(() => {
    resetAssessmentState();
  }, []);

  const value = useMemo<AssessmentContextValue>(
    () => ({
      state,
      isHydrated,
      getSubdomainBaseline,
      setTopicRating,
      updateSubdomainMeta,
      completeBaseline,
      skipBaseline,
      startQuiz,
      recordResponse,
      advanceQuestion,
      skipQuestion,
      remainingSkips,
      skipSubdomain,
      isSubdomainSkipped,
      completeQuiz,
      resetAssessment,
    }),
    [
      state,
      isHydrated,
      getSubdomainBaseline,
      setTopicRating,
      updateSubdomainMeta,
      completeBaseline,
      skipBaseline,
      startQuiz,
      recordResponse,
      advanceQuestion,
      skipQuestion,
      remainingSkips,
      skipSubdomain,
      isSubdomainSkipped,
      completeQuiz,
      resetAssessment,
    ]
  );

  return (
    <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>
  );
}

export function useAssessment(): AssessmentContextValue {
  const ctx = useContext(AssessmentContext);
  if (!ctx) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return ctx;
}
