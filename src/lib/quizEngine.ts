import { DomainId, Question, Subdomain, SubdomainId } from "@/types/nice";
import { DOMAINS } from "@/data/domains";
import { SUBDOMAINS } from "@/data/subdomains";
import { loadQuestionBank } from "@/lib/questionBank";

/** How many questions of each tier are shown per sub-domain (out of a 10/10/10 pool). */
export const TIER_COMPOSITION = { easy: 4, medium: 3, hard: 3 } as const;

/** Max number of "skip and get another" actions a user may use per parent domain. */
export const MAX_SKIPS_PER_DOMAIN = 3;

/**
 * Sub-domains in traversal order: grouped by parent Domain (in DOMAINS
 * order — OG, DD, IO, PD, IN), then by their original order within
 * SUBDOMAINS. This is the fixed order the quiz walks through.
 */
export function getOrderedSubdomains(): Subdomain[] {
  const ordered: Subdomain[] = [];
  for (const domain of DOMAINS) {
    ordered.push(...SUBDOMAINS.filter((s) => s.domainId === domain.id));
  }
  return ordered;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Builds the initial quiz queue: for every sub-domain, samples 4 easy + 3
 * medium + 3 hard questions (shuffled within tier, then interleaved) from
 * that sub-domain's 30-question pool. Keyed by SubdomainId, in the order
 * questions will be served within that sub-domain.
 */
export function buildQuizQueue(): Record<SubdomainId, string[]> {
  const bank = loadQuestionBank();
  const queue = {} as Record<SubdomainId, string[]>;

  for (const subdomain of getOrderedSubdomains()) {
    const pool = bank.questions.filter((q) => q.subdomainId === subdomain.id);
    const picked: Question[] = [];
    (Object.keys(TIER_COMPOSITION) as (keyof typeof TIER_COMPOSITION)[]).forEach((tier) => {
      const tierQuestions = shuffle(pool.filter((q) => q.tier === tier));
      picked.push(...tierQuestions.slice(0, TIER_COMPOSITION[tier]));
    });
    queue[subdomain.id] = shuffle(picked).map((q) => q.id);
  }

  return queue;
}

export function getQuestionById(questionId: string): Question | undefined {
  return loadQuestionBank().questions.find((q) => q.id === questionId);
}

/** Total question count across all sub-domains in the queue. */
export function getTotalQuestionCount(queue: Record<SubdomainId, string[]>): number {
  return getOrderedSubdomains().reduce((sum, s) => sum + (queue[s.id]?.length ?? 0), 0);
}

/** How many questions have been completed so far, counting full sub-domains plus progress in the current one. */
export function getCompletedQuestionCount(
  queue: Record<SubdomainId, string[]>,
  subdomainIndex: number,
  questionIndex: number
): number {
  const ordered = getOrderedSubdomains();
  let completed = 0;
  for (let i = 0; i < subdomainIndex; i++) {
    completed += queue[ordered[i].id]?.length ?? 0;
  }
  completed += questionIndex;
  return completed;
}

/** Finds the index of the first sub-domain in the queue that has at least one question. */
export function getFirstNonEmptySubdomainIndex(queue: Record<SubdomainId, string[]>): number {
  const ordered = getOrderedSubdomains();
  for (let i = 0; i < ordered.length; i++) {
    if ((queue[ordered[i].id]?.length ?? 0) > 0) return i;
  }
  return 0;
}

/**
 * Given the current position, returns the next { subdomainIndex, questionIndex }
 * or null if the quiz is complete (last question of last sub-domain answered).
 */
export function getNextPosition(
  queue: Record<SubdomainId, string[]>,
  subdomainIndex: number,
  questionIndex: number
): { subdomainIndex: number; questionIndex: number } | null {
  const ordered = getOrderedSubdomains();
  const currentSubdomainQuestions = queue[ordered[subdomainIndex]?.id]?.length ?? 0;

  if (questionIndex + 1 < currentSubdomainQuestions) {
    return { subdomainIndex, questionIndex: questionIndex + 1 };
  }

  for (let nextIndex = subdomainIndex + 1; nextIndex < ordered.length; nextIndex++) {
    if ((queue[ordered[nextIndex].id]?.length ?? 0) > 0) {
      return { subdomainIndex: nextIndex, questionIndex: 0 };
    }
  }

  return null;
}

/**
 * Given the current position, returns the previous { subdomainIndex,
 * questionIndex } or null if already at the very first question.
 */
export function getPreviousPosition(
  queue: Record<SubdomainId, string[]>,
  subdomainIndex: number,
  questionIndex: number
): { subdomainIndex: number; questionIndex: number } | null {
  const ordered = getOrderedSubdomains();

  if (questionIndex - 1 >= 0) {
    return { subdomainIndex, questionIndex: questionIndex - 1 };
  }

  for (let prevIndex = subdomainIndex - 1; prevIndex >= 0; prevIndex--) {
    const len = queue[ordered[prevIndex].id]?.length ?? 0;
    if (len > 0) {
      return { subdomainIndex: prevIndex, questionIndex: len - 1 };
    }
  }

  return null;
}

/**
 * Finds an unused question of the same tier from the given sub-domain's full
 * pool to replace a skipped question, keeping the fixed easy/medium/hard mix
 * intact. `excludeIds` should include every question id already present
 * anywhere in the current queue (so a replacement is never a duplicate of
 * one already served/queued elsewhere) plus any previously skipped-away ids.
 * Returns null if the sub-domain's pool has no spare question of that tier.
 */
export function findReplacementQuestion(
  subdomainId: SubdomainId,
  tier: Question["tier"],
  excludeIds: Set<string>
): Question | null {
  const bank = loadQuestionBank();
  const candidates = bank.questions.filter(
    (q) => q.subdomainId === subdomainId && q.tier === tier && !excludeIds.has(q.id)
  );
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/** Domain a given sub-domain belongs to. */
export function getDomainIdForSubdomain(subdomainId: SubdomainId): DomainId | undefined {
  return SUBDOMAINS.find((s) => s.id === subdomainId)?.domainId;
}
