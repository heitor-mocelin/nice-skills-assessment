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
import { MAX_SKIPS_PER_DOMAIN, findReplacementQuestion } from "@/lib/quizEngine";

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
  startQuiz: (quizQuestionIds: Record<SubdomainId, string[]>) => void;
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
  completeQuiz: () => void;
  resetAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

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
  const isHydrated = typeof window !== "undefined";

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

  const startQuiz = useCallback((quizQuestionIds: Record<SubdomainId, string[]>) => {
    setAssessmentState((prev) => ({
      ...prev,
      quizQuestionIds,
      currentSubdomainIndex: 0,
      currentQuestionIndex: 0,
    }));
  }, []);

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
      return MAX_SKIPS_PER_DOMAIN - (state.skipsUsedByDomain[domainId] ?? 0);
    },
    [state.skipsUsedByDomain]
  );

  const skipQuestion = useCallback(
    (
      subdomainId: SubdomainId,
      domainId: DomainId,
      questionId: string,
      tier: "easy" | "medium" | "hard"
    ): boolean => {
      const prev = getSnapshot();
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
