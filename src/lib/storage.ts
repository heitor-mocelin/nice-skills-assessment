import { AssessmentState, DomainId } from "@/types/nice";

export const STORAGE_KEY = "nice-assessment:state";
// Bumped: baseline entries moved from per-domain to per-subdomain granularity.
export const SCHEMA_VERSION = 2;

const EMPTY_QUIZ_QUEUE: Record<DomainId, string[]> = {
  OG: [],
  DD: [],
  IO: [],
  PD: [],
  IN: [],
};

/** Builds a fresh, empty assessment state (used on first visit or after reset). */
export function createInitialState(): AssessmentState {
  return {
    schemaVersion: SCHEMA_VERSION,
    currentStage: "not-started",
    baseline: [],
    responses: [],
    quizQuestionIds: { ...EMPTY_QUIZ_QUEUE },
    currentDomainIndex: 0,
    currentQuestionIndex: 0,
    startedAt: null,
    completedAt: null,
  };
}

/**
 * Reads persisted state from localStorage. Returns a fresh initial state if
 * nothing is stored, storage is unavailable (SSR), the data is corrupt, or
 * the schema version has changed (safe migration strategy: reset).
 */
export function loadState(): AssessmentState {
  if (typeof window === "undefined") return createInitialState();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();

    const parsed = JSON.parse(raw) as AssessmentState;
    if (parsed.schemaVersion !== SCHEMA_VERSION) {
      return createInitialState();
    }
    return parsed;
  } catch {
    return createInitialState();
  }
}

/** Persists state to localStorage. No-ops during SSR. */
export function saveState(state: AssessmentState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage may be unavailable (private browsing quota, etc.) - fail silently
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
