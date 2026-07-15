import { AssessmentState, DomainId } from "@/types/nice";

export const STORAGE_KEY = "nice-assessment:state";
// v2: baseline entries moved from per-domain to per-subdomain granularity.
// v3: subdomain rating replaced with per-topic ratings (averaged), plus separate focus/notes meta.
// v4: quiz queue moved from per-domain to per-subdomain pools (4 easy/3 medium/3 hard,
//     sampled from a 30-question pool per sub-domain); added skip tracking and the
//     ability to explicitly skip the baseline stage.
export const SCHEMA_VERSION = 4;

const EMPTY_SKIP_COUNTS: Record<DomainId, number> = {
  OG: 0,
  DD: 0,
  IO: 0,
  PD: 0,
  IN: 0,
};

/** Builds a fresh, empty assessment state (used on first visit or after reset). */
export function createInitialState(): AssessmentState {
  return {
    schemaVersion: SCHEMA_VERSION,
    currentStage: "not-started",
    baseline: [],
    baselineSkipped: false,
    responses: [],
    quizQuestionIds: {},
    currentSubdomainIndex: 0,
    currentQuestionIndex: 0,
    skipsUsedByDomain: { ...EMPTY_SKIP_COUNTS },
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
