import { AssessmentState, DomainId } from "@/types/nice";
import { DEFAULT_QUESTIONS_PER_SUBDOMAIN } from "@/lib/quizEngine";

export const STORAGE_KEY = "nice-assessment:state";
// v2: baseline entries moved from per-domain to per-subdomain granularity.
// v3: subdomain rating replaced with per-topic ratings (averaged), plus separate focus/notes meta.
// v4: quiz queue moved from per-domain to per-subdomain pools (4 easy/3 medium/3 hard,
//     sampled from a 30-question pool per sub-domain); added skip tracking and the
//     ability to explicitly skip the baseline stage.
// v5: added the ability to skip an entire sub-domain during the quiz
//     (skippedSubdomains), shown as a zeroed-out, explicitly flagged
//     section in the results dashboard.
// v6: added questionsPerSubdomain — the user now chooses quiz length (10,
//     20, or all 30 questions per sub-domain) before Stage 2 starts.
export const SCHEMA_VERSION = 6;

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
    questionsPerSubdomain: DEFAULT_QUESTIONS_PER_SUBDOMAIN,
    currentSubdomainIndex: 0,
    currentQuestionIndex: 0,
    skipsUsedByDomain: { ...EMPTY_SKIP_COUNTS },
    skippedSubdomains: [],
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
