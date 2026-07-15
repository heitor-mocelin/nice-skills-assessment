import { DomainId, FamiliarityRating, SubdomainBaseline } from "@/types/nice";
import { SUBDOMAINS } from "@/data/subdomains";

const MAX_RATING = 4; // rating scale is 0-4

/**
 * Rolls up subdomain-level baseline ratings into a single 0-100 percent per
 * domain (average of that domain's subdomain ratings, normalized). Used to
 * drive the domain-level radar chart from granular subdomain input.
 * Domains with no rated subdomains yet return 0.
 */
export function computeDomainBaselinePercents(
  baseline: SubdomainBaseline[]
): Record<DomainId, number> {
  const domainIds = Array.from(new Set(SUBDOMAINS.map((s) => s.domainId))) as DomainId[];
  const result = {} as Record<DomainId, number>;

  for (const domainId of domainIds) {
    const subdomainIds = SUBDOMAINS.filter((s) => s.domainId === domainId).map((s) => s.id);
    const ratings = subdomainIds
      .map((id) => baseline.find((b) => b.subdomainId === id)?.rating)
      .filter((r): r is FamiliarityRating => r !== undefined);

    if (ratings.length === 0) {
      result[domainId] = 0;
      continue;
    }

    const avg = ratings.reduce((sum: number, r) => sum + r, 0) / ratings.length;
    result[domainId] = Math.round((avg / MAX_RATING) * 100);
  }

  return result;
}
