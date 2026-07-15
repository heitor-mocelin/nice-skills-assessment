/**
 * Core type definitions for the NIST NICE Framework v2.2.0
 * Cybersecurity Skills Assessment application.
 */

/** The 5 core Work Role Categories (Domains) defined by NICE v2.2.0 */
export type DomainId = "OG" | "DD" | "IO" | "PD" | "IN";

/** Sub-domain identifier, e.g. "DD-A", "PD-C". Unique across the whole framework. */
export type SubdomainId = string;

/** Difficulty rating applied to every question, 1 (easiest) to 5 (hardest) */
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Self-attestation comfort/familiarity rating for a sub-domain, 0 (no
 * familiarity) to 4 (expert). Matches the paper worksheet's 0-4 scale.
 */
export type FamiliarityRating = 0 | 1 | 2 | 3 | 4;

export interface Domain {
  id: DomainId;
  name: string;
  shortName: string;
  description: string;
  /** Tailwind-friendly accent color used for charts/badges for this domain */
  color: string;
}

/** A referenced NICE work role, e.g. { code: "DD-WRL-001", name: "Cybersecurity Architecture" } */
export interface NiceWorkRole {
  code: string;
  name: string;
}

/**
 * A sub-domain: a focused cluster of skills within a parent Domain, mapped to
 * one or more official NICE work roles. This is the actual unit the user
 * self-rates against in Stage 1 (not the broad parent Domain), matching the
 * granularity of the source worksheet (e.g. "DD-A — Security & Enterprise
 * Architecture").
 */
export interface Subdomain {
  id: SubdomainId; // e.g. "DD-A"
  domainId: DomainId;
  title: string; // e.g. "Security & Enterprise Architecture"
  workRoles: NiceWorkRole[];
  /** The "what lives here" checklist the user rates themselves against as a whole */
  topics: string[];
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

/** Stage 1: user's self-rated familiarity for a single sub-domain, captured before the quiz */
export interface SubdomainBaseline {
  subdomainId: SubdomainId;
  domainId: DomainId;
  rating: FamiliarityRating; // 0-4
  /** whether the user flagged this sub-domain as a career focus area */
  isFocusArea: boolean | null;
  /** free-form notes, e.g. "TCP/IP solid, BGP theoretical only" */
  notes: string;
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
  baseline: SubdomainBaseline[];
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
  baselineScorePercent: number; // avg of subdomain ratings (0-4) normalized to 0-100
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
