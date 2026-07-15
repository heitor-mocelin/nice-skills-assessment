import {
  DomainResult,
  QuestionResponse,
  SubdomainBaseline,
  SubdomainId,
  SubdomainResult,
} from "@/types/nice";
import { DOMAINS } from "@/data/domains";
import { SUBDOMAINS } from "@/data/subdomains";
import { loadQuestionBank } from "@/lib/questionBank";
import { computeDomainBaselinePercentsOrNull, computeSubdomainAverage } from "@/lib/baselineRollup";

/**
 * Computes the Stage 3 results: for every domain, combines the Stage 1
 * self-rated familiarity baseline with the Stage 2 actual quiz performance,
 * producing a per-domain comparison (including the "confidence gap" —
 * positive means the user under-rated themselves relative to how they
 * actually performed, negative means they over-rated themselves).
 */
export function computeDomainResults(
  baseline: SubdomainBaseline[],
  responses: QuestionResponse[],
  skippedSubdomains: SubdomainId[] = []
): DomainResult[] {
  const baselinePercents = computeDomainBaselinePercentsOrNull(baseline);
  const bank = loadQuestionBank();
  const pointsById = new Map(bank.questions.map((q) => [q.id, q.points]));

  return DOMAINS.map((domain) => {
    const domainResponses = responses.filter((r) => r.domainId === domain.id);
    const correctCount = domainResponses.filter((r) => r.isCorrect).length;
    const idkCount = domainResponses.filter((r) => r.idkSelected).length;
    const incorrectCount = domainResponses.length - correctCount - idkCount;
    const totalQuestions = domainResponses.length;

    const pointsEarned = domainResponses.reduce((sum, r) => sum + r.pointsEarned, 0);
    const pointsPossible = domainResponses.reduce(
      (sum, r) => sum + (pointsById.get(r.questionId) ?? 0),
      0
    );

    const performancePercent =
      totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100);

    const baselineScorePercent = baselinePercents[domain.id];
    const confidenceGap =
      baselineScorePercent === null ? null : performancePercent - baselineScorePercent;

    const domainSubdomains = SUBDOMAINS.filter((s) => s.domainId === domain.id);
    const skippedSubdomainIds = domainSubdomains
      .map((s) => s.id)
      .filter((id) => skippedSubdomains.includes(id));

    return {
      domainId: domain.id,
      baselineScorePercent,
      totalQuestions,
      correctCount,
      incorrectCount,
      idkCount,
      skippedCount: 0, // skipped questions are swapped out in the queue, never recorded as a response
      pointsEarned,
      pointsPossible,
      performancePercent,
      confidenceGap,
      skippedSubdomainIds,
      totalSubdomains: domainSubdomains.length,
    };
  });
}

/**
 * Computes Stage 3 results at the sub-domain level so the "focus area for
 * my career?" flag captured in Stage 1 can actually be surfaced somewhere
 * (previously it was stored but never read back).
 */
export function computeSubdomainResults(
  baseline: SubdomainBaseline[],
  responses: QuestionResponse[],
  skippedSubdomains: SubdomainId[] = []
): SubdomainResult[] {
  return SUBDOMAINS.map((subdomain) => {
    const subBaseline = baseline.find((b) => b.subdomainId === subdomain.id);
    const average = computeSubdomainAverage(subdomain, subBaseline);
    const baselineScorePercent = average === null ? null : Math.round((average / 4) * 100);

    const skipped = skippedSubdomains.includes(subdomain.id);
    const subResponses = responses.filter((r) => r.subdomainId === subdomain.id);
    const correctCount = subResponses.filter((r) => r.isCorrect).length;
    const totalQuestions = subResponses.length;
    const performancePercent =
      totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100);

    return {
      subdomainId: subdomain.id,
      domainId: subdomain.domainId,
      isFocusArea: subBaseline?.isFocusArea === true,
      baselineScorePercent,
      totalQuestions,
      correctCount,
      performancePercent,
      skipped,
    };
  });
}
