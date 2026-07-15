import { DomainId, FamiliarityRating, Subdomain, SubdomainBaseline } from "@/types/nice";
import { SUBDOMAINS } from "@/data/subdomains";

const MAX_RATING = 4; // rating scale is 0-4

/**
 * Computes a sub-domain's overall rating as the average of its individually
 * rated topics. Returns null if no topics have been rated yet.
 */
export function computeSubdomainAverage(
  subdomain: Subdomain,
  baseline: SubdomainBaseline | null | undefined
): number | null {
  if (!baseline) return null;
  const ratings = subdomain.topics
    .map((_, i) => baseline.topicRatings[i])
    .filter((r): r is FamiliarityRating => r !== undefined);

  if (ratings.length === 0) return null;
  return ratings.reduce((sum: number, r) => sum + r, 0) / ratings.length;
}

/** True once every topic in the sub-domain has been rated. */
export function isSubdomainFullyRated(
  subdomain: Subdomain,
  baseline: SubdomainBaseline | null | undefined
): boolean {
  if (!baseline) return false;
  return subdomain.topics.every((_, i) => baseline.topicRatings[i] !== undefined);
}

/**
 * Rolls up sub-domain averages (each itself an average of rated topics) into
 * a single 0-100 percent per domain, driving the domain-level radar chart.
 * Domains with no rated topics yet return 0.
 */
export function computeDomainBaselinePercents(
  baseline: SubdomainBaseline[]
): Record<DomainId, number> {
  const domainIds = Array.from(new Set(SUBDOMAINS.map((s) => s.domainId))) as DomainId[];
  const result = {} as Record<DomainId, number>;

  for (const domainId of domainIds) {
    const subdomains = SUBDOMAINS.filter((s) => s.domainId === domainId);
    const averages = subdomains
      .map((s) => computeSubdomainAverage(s, baseline.find((b) => b.subdomainId === s.id)))
      .filter((avg): avg is number => avg !== null);

    if (averages.length === 0) {
      result[domainId] = 0;
      continue;
    }

    const avg = averages.reduce((sum: number, a) => sum + a, 0) / averages.length;
    result[domainId] = Math.round((avg / MAX_RATING) * 100);
  }

  return result;
}
