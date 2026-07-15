import { DOMAINS } from "@/data/domains";
import { Question, QuestionBank } from "@/types/nice";
import batch1 from "@/data/question-pools/batch1.json";
import batch2 from "@/data/question-pools/batch2.json";
import batch3 from "@/data/question-pools/batch3.json";

/**
 * Loads and assembles the full question bank from the per-sub-domain
 * question pools. Each sub-domain has a pool of 30 questions (10 easy / 10
 * medium / 10 hard); the quiz engine samples a fixed mix from each pool
 * (see src/lib/quizEngine.ts). Pools are split into a few batch files under
 * src/data/question-pools/ purely to keep individual files manageable —
 * they're merged into one flat list here.
 */
export function loadQuestionBank(): QuestionBank {
  return {
    version: "2.2.0",
    domains: DOMAINS,
    questions: [...batch1, ...batch2, ...batch3] as Question[],
  };
}

export function getQuestionsBySubdomain(subdomainId: string): Question[] {
  return loadQuestionBank().questions.filter((q) => q.subdomainId === subdomainId);
}

export function getQuestionsByDomain(domainId: string): Question[] {
  return loadQuestionBank().questions.filter((q) => q.domainId === domainId);
}
