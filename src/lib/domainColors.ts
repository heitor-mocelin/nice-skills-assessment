import { DomainId, SubdomainId } from "@/types/nice";
import { SUBDOMAINS } from "@/data/subdomains";

/**
 * Per-domain color scales. Each domain gets its own hue family; within a
 * domain, sub-domains are shaded from light (first sub-domain, e.g. OG-A)
 * to dark (last sub-domain, e.g. OG-D) so related areas are visually
 * grouped by hue while still being individually distinguishable. Sized to
 * 6 shades to leave headroom if a domain ever grows past today's max of 4
 * sub-domains; index is clamped if exceeded.
 */
export const DOMAIN_COLOR_SCALES: Record<DomainId, string[]> = {
  // Oversight & Governance — purple/violet
  OG: ["#ddd6fe", "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9"],
  // Design & Development — blue
  DD: ["#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8"],
  // Implementation & Operation — green
  IO: ["#bbf7d0", "#86efac", "#4ade80", "#22c55e", "#16a34a", "#15803d"],
  // Protection & Defense — yellow/amber
  PD: ["#fde68a", "#fcd34d", "#fbbf24", "#f59e0b", "#d97706", "#b45309"],
  // Investigation — red
  IN: ["#fecaca", "#fca5a5", "#f87171", "#ef4444", "#dc2626", "#b91c1c"],
};

const FALLBACK_COLOR = "#64748b"; // slate-500, used if a subdomain/domain id is ever unrecognized

/**
 * Returns the mid-scale color for a whole domain (used for domain-level
 * badges, chart series, etc). Kept in sync with the scale's middle shade
 * so a domain's own color always sits between its lightest and darkest
 * sub-domain shades.
 */
export function getDomainColor(domainId: DomainId): string {
  const scale = DOMAIN_COLOR_SCALES[domainId];
  return scale ? scale[3] : FALLBACK_COLOR;
}

/**
 * Returns a sub-domain's shade within its parent domain's color scale,
 * based on its position among sibling sub-domains (A = lightest,
 * progressively darker for B, C, D...).
 */
export function getSubdomainColor(subdomainId: SubdomainId): string {
  const subdomain = SUBDOMAINS.find((s) => s.id === subdomainId);
  if (!subdomain) return FALLBACK_COLOR;

  const siblings = SUBDOMAINS.filter((s) => s.domainId === subdomain.domainId);
  const index = siblings.findIndex((s) => s.id === subdomainId);
  const scale = DOMAIN_COLOR_SCALES[subdomain.domainId];
  if (!scale) return FALLBACK_COLOR;

  return scale[Math.min(Math.max(index, 0), scale.length - 1)];
}
