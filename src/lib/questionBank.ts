import { DOMAINS } from "@/data/domains";
import { Question, QuestionBank } from "@/types/nice";
import sampleQuestions from "@/data/question-bank.sample.json";

/**
 * Loads and assembles the question bank.
 *
 * Today this reads from a static sample JSON file containing a handful of
 * questions (enough to prove out the schema and app logic). The schema is
 * designed to scale to 20-40 questions per domain without any code changes —
 * simply append more entries to the questions array (or split into per-domain
 * JSON files and merge them here) once the full bank is authored.
 */
export function loadQuestionBank(): QuestionBank {
  return {
    version: sampleQuestions.version,
    domains: DOMAINS,
    questions: sampleQuestions.questions as Question[],
  };
}

export function getQuestionsByDomain(domainId: string): Question[] {
  return loadQuestionBank().questions.filter((q) => q.domainId === domainId);
}
