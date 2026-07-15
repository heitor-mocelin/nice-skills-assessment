import { AssessmentState } from "@/types/nice";
import { clearState, createInitialState, loadState, saveState } from "@/lib/storage";

/**
 * Minimal external store for the assessment state, designed to be consumed
 * via React's useSyncExternalStore. This keeps localStorage reads/writes
 * outside of React's render/effect cycle (avoiding cascading setState-in-effect
 * renders) while still giving components a reactive, always-in-sync value.
 */
type Listener = () => void;

let currentState: AssessmentState = createInitialState();
let hasLoadedFromStorage = false;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => listener());
}

/** Client-only snapshot: lazily loads from localStorage on first access. */
export function getSnapshot(): AssessmentState {
  if (!hasLoadedFromStorage) {
    currentState = loadState();
    hasLoadedFromStorage = true;
  }
  return currentState;
}

/** Server snapshot: always the empty initial state (no localStorage on server). */
export function getServerSnapshot(): AssessmentState {
  return createInitialState();
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setAssessmentState(
  updater: AssessmentState | ((prev: AssessmentState) => AssessmentState)
) {
  const prev = getSnapshot();
  const next = typeof updater === "function" ? updater(prev) : updater;
  currentState = next;
  saveState(next);
  notify();
}

export function resetAssessmentState() {
  clearState();
  currentState = createInitialState();
  notify();
}
