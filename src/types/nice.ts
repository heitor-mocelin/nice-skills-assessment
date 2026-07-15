/**
 * Core type definitions for the NIST NICE Framework v2.2.0
 * Cybersecurity Skills Assessment application.
 */

/** The 5 core Work Role Categories (Domains) defined by NICE v2.2.0 */
export type DomainId = "OG" | "DD" | "IO" | "PD" | "IN";

/** Difficulty rating applied to every question, 1 (easiest) to 5 (hardest) */
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

/** Self-attestation comfort/familiarity rating, 1 (no familiarity) to 5 (expert) */
export type FamiliarityRating = 1 | 2 | 3 | 4 | 5;

export interface Domain {
  id: DomainId;
  name: string;
  shortName: string;
  description: string;
  /** Tailwind-friendly accent color used for charts/badges for this domain */
  color: string;
}

export interface AnswerOption {
  id: string; // e.g. "a", "b", "c", "d"
  text: string;
}

export interface Question {
  id: string; // unique id, e.g. "OG-001"
  domainId: DomainId;
  /** NICE Task/Competency/Work Role reference this question maps to (optional metadata) */
  niceReference?: string;
  difficulty: DifficultyLevel;
  prompt: string;
  options: AnswerOption[];
  /** id of the correct AnswerOption */
  correctOptionId: string;
  /** Explanation shown after answering, reinforces learning */
  explanation?: string;
  /** Points awarded for a correct answer at this difficulty (defaults can be derived from difficulty) */
  points: number;
  tags?: string[];
}

/** The full question bank, keyed by domain, designed to scale to 20-40 questions per domain */
export interface QuestionBank {
  version: string; // NICE framework version, e.g. "2.2.0"
  domains: Domain[];
  questions: Question[];
}

/* ---------------------------------------------------------------------- */
/* User progress / response tracking                                       */
/* ---------------------------------------------------------------------- */

/** Stage 1: user's self-rated familiarity per domain, captured before the quiz */
export interface FamiliarityBaseline {
  domainId: DomainId;
  rating: FamiliarityRating;
}

/** Stage 2: a single user response to a single question */
export interface QuestionResponse {
  questionId: string;
  domainId: DomainId;
  /** id of the option the user selected; null if they used "I don't know" */
  selectedOptionId: string | null;
  /** true when the user explicitly clicked "I don't know" instead of guessing */
  idkSelected: boolean;
  isCorrect: boolean;
  /** points earned for this question (0 if incorrect or idk) */
  pointsEarned: number;
  /** free-form notes/rationale the user typed while answering */
  notes: string;
  /** ms timestamp when the question was answered */
  answeredAt: number;
}

/** Overall persisted app state (stored in localStorage) */
export interface AssessmentState {
  schemaVersion: number; // bump if shape changes, to safely migrate/reset localStorage
  currentStage: "baseline" | "quiz" | "results" | "not-started";
  baseline: FamiliarityBaseline[];
  responses: QuestionResponse[];
  /** ids of questions served in this session, per domain, preserves ordering */
  quizQuestionIds: Record<DomainId, string[]>;
  /** index of the current question within the current domain's quiz queue */
  currentDomainIndex: number;
  currentQuestionIndex: number;
  startedAt: number | null;
  completedAt: number | null;
}

/* ---------------------------------------------------------------------- */
/* Derived / computed results                                              */
/* ---------------------------------------------------------------------- */

export interface DomainResult {
  domainId: DomainId;
  baselineRating: FamiliarityRating | null; // Stage 1 self-attestation (1-5)
  baselineScorePercent: number; // baselineRating normalized to 0-100 for chart comparison
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  idkCount: number;
  pointsEarned: number;
  pointsPossible: number;
  performancePercent: number; // 0-100, actual quiz performance
  /** performancePercent - baselineScorePercent; negative = overconfident, positive = underconfident */
  confidenceGap: number;
}
