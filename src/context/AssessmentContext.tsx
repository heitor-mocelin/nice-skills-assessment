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
  startQuiz: (quizQuestionIds: Record<DomainId, string[]>) => void;
  recordResponse: (response: QuestionResponse) => void;
  advanceQuestion: (domainIndex: number, questionIndex: number) => void;
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

  const startQuiz = useCallback((quizQuestionIds: Record<DomainId, string[]>) => {
    setAssessmentState((prev) => ({
      ...prev,
      quizQuestionIds,
      currentDomainIndex: 0,
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

  const advanceQuestion = useCallback((domainIndex: number, questionIndex: number) => {
    setAssessmentState((prev) => ({
      ...prev,
      currentDomainIndex: domainIndex,
      currentQuestionIndex: questionIndex,
    }));
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
      startQuiz,
      recordResponse,
      advanceQuestion,
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
      startQuiz,
      recordResponse,
      advanceQuestion,
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
