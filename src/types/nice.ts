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
 * Coarse difficulty tier used to build the quiz's fixed question mix per
 * sub-domain (4 easy + 3 medium + 3 hard shown out of a pool of 10/10/10).
 */
export type DifficultyTier = "easy" | "medium" | "hard";

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
 * A single ratable topic ("what lives here" bullet) within a sub-domain.
 * The short label is the headline text shown next to the rating buttons;
 * the description gives tangible, concrete context (example actions/tools/
 * scenarios) shown in a hover tooltip so users know what they're rating
 * themselves against.
 */
export interface SubdomainTopic {
  label: string;
  description: string;
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
  /** The "what lives here" checklist the user rates themselves against, topic by topic */
  topics: SubdomainTopic[];
}

export interface AnswerOption {
  id: string; // e.g. "a", "b", "c", "d"
  text: string;
}

export interface Question {
  id: string; // unique id, e.g. "DD-A-E-01" (subdomain + tier initial + index)
  domainId: DomainId;
  subdomainId: SubdomainId;
  /** NICE Task/Competency/Work Role reference this question maps to (optional metadata) */
  niceReference?: string;
  tier: DifficultyTier;
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

/**
 * The full question bank. Designed around a fixed pool per sub-domain: 30
 * questions (10 easy / 10 medium / 10 hard). The quiz engine samples a fixed
 * mix (4 easy + 3 medium + 3 hard = 10 shown) from each sub-domain's pool,
 * and the skip mechanic draws replacements from the same tier's remainder.
 */
export interface QuestionBank {
  version: string; // NICE framework version, e.g. "2.2.0"
  domains: Domain[];
  questions: Question[];
}

/* ---------------------------------------------------------------------- */
/* User progress / response tracking                                       */
/* ---------------------------------------------------------------------- */

/**
 * Stage 1: user's self-rated familiarity for a single sub-domain, captured
 * before the quiz. Each topic in the sub-domain's checklist is rated
 * individually (0-4); the sub-domain's overall rating is the computed
 * average of its rated topics (see computeSubdomainAverage in
 * src/lib/baselineRollup.ts) rather than a single manually-entered value.
 */
export interface SubdomainBaseline {
  subdomainId: SubdomainId;
  domainId: DomainId;
  /** rating per topic, keyed by the topic's index within Subdomain.topics */
  topicRatings: Record<number, FamiliarityRating>;
  /** whether the user flagged this sub-domain as a career focus area */
  isFocusArea: boolean | null;
  /** free-form notes, e.g. "TCP/IP solid, BGP theoretical only" */
  notes: string;
}

/** Stage 2: a single user response to a single question */
export interface QuestionResponse {
  questionId: string;
  domainId: DomainId;
  subdomainId: SubdomainId;
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
  /** true when the user explicitly clicked "Skip Assessment" instead of rating every topic */
  baselineSkipped: boolean;
  responses: QuestionResponse[];
  /**
   * Ids of questions served in this session, per sub-domain (4 easy + 3
   * medium + 3 hard, sampled from that sub-domain's 30-question pool),
   * preserving serve order. Skipping a question swaps its id in-place for
   * an unused same-tier question from the same sub-domain's pool.
   */
  quizQuestionIds: Record<SubdomainId, string[]>;
  /** index into the ordered sub-domain traversal (see getOrderedSubdomains) */
  currentSubdomainIndex: number;
  /** index of the current question within the current sub-domain's quiz queue */
  currentQuestionIndex: number;
  /** how many questions the user has skipped so far, per parent domain (cap: 3) */
  skipsUsedByDomain: Record<DomainId, number>;
  /**
   * Sub-domains the user explicitly opted to skip entirely (distinct from
   * skipping a single question). Any recorded responses for a skipped
   * sub-domain are removed so the results dashboard shows it as a true
   * zero, flagged as skipped rather than blended into the score.
   */
  skippedSubdomains: SubdomainId[];
  startedAt: number | null;
  completedAt: number | null;
}

/* ---------------------------------------------------------------------- */
/* Derived / computed results                                              */
/* ---------------------------------------------------------------------- */

export interface DomainResult {
  domainId: DomainId;
  /** avg of subdomain ratings (0-4) normalized to 0-100; null if the baseline was skipped or has no rated topics */
  baselineScorePercent: number | null;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  idkCount: number;
  skippedCount: number;
  pointsEarned: number;
  pointsPossible: number;
  performancePercent: number; // 0-100, actual quiz performance
  /** performancePercent - baselineScorePercent; null when there's no baseline to compare against */
  confidenceGap: number | null;
  /** sub-domain ids within this domain that the user explicitly skipped entirely */
  skippedSubdomainIds: SubdomainId[];
  /** total number of sub-domains that belong to this domain (for "N of M skipped" display) */
  totalSubdomains: number;
}
