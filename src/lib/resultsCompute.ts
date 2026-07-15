import { DomainResult, QuestionResponse, SubdomainBaseline } from "@/types/nice";
import { DOMAINS } from "@/data/domains";
import { loadQuestionBank } from "@/lib/questionBank";
import { computeDomainBaselinePercentsOrNull } from "@/lib/baselineRollup";

/**
 * Computes the Stage 3 results: for every domain, combines the Stage 1
 * self-rated familiarity baseline with the Stage 2 actual quiz performance,
 * producing a per-domain comparison (including the "confidence gap" —
 * positive means the user under-rated themselves relative to how they
 * actually performed, negative means they over-rated themselves).
 */
export function computeDomainResults(
  baseline: SubdomainBaseline[],
  responses: QuestionResponse[]
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
    };
  });
}
