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

type SubdomainBaselinePatch = Partial<
  Pick<SubdomainBaseline, "rating" | "isFocusArea" | "notes">
>;

interface AssessmentContextValue {
  state: AssessmentState;
  /** true once the client has mounted and the useSyncExternalStore snapshot reflects localStorage */
  isHydrated: boolean;
  getSubdomainBaseline: (subdomainId: SubdomainId) => SubdomainBaseline | null;
  updateSubdomainBaseline: (
    subdomainId: SubdomainId,
    domainId: DomainId,
    patch: SubdomainBaselinePatch
  ) => void;
  completeBaseline: () => void;
  startQuiz: (quizQuestionIds: Record<DomainId, string[]>) => void;
  recordResponse: (response: QuestionResponse) => void;
  advanceQuestion: (domainIndex: number, questionIndex: number) => void;
  completeQuiz: () => void;
  resetAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

const DEFAULT_RATING: FamiliarityRating = 0;

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

  const updateSubdomainBaseline = useCallback(
    (subdomainId: SubdomainId, domainId: DomainId, patch: SubdomainBaselinePatch) => {
      setAssessmentState((prev) => {
        const existing = prev.baseline.find((b) => b.subdomainId === subdomainId);
        const next: SubdomainBaseline = existing
          ? { ...existing, ...patch }
          : {
              subdomainId,
              domainId,
              rating: DEFAULT_RATING,
              isFocusArea: null,
              notes: "",
              ...patch,
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
      updateSubdomainBaseline,
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
      updateSubdomainBaseline,
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
