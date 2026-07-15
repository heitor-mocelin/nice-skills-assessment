"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { DOMAINS } from "@/data/domains";
import { SUBDOMAINS, getSubdomainsByDomain } from "@/data/subdomains";
import { useAssessment } from "@/context/AssessmentContext";
import { SubdomainRatingCard } from "@/components/baseline/SubdomainRatingCard";
import { RadarChart } from "@/components/charts/RadarChart";
import { computeDomainBaselinePercents } from "@/lib/baselineRollup";

export function BaselineForm() {
  const router = useRouter();
  const { state, completeBaseline } = useAssessment();

  const totalTopics = SUBDOMAINS.reduce((sum, s) => sum + s.topics.length, 0);
  const ratedTopics = state.baseline.reduce(
    (sum, b) => sum + Object.keys(b.topicRatings).length,
    0
  );
  const allRated = ratedTopics >= totalTopics;

  const domainPercents = useMemo(
    () => computeDomainBaselinePercents(state.baseline),
    [state.baseline]
  );

  const radarData = useMemo(
    () =>
      DOMAINS.map((d) => ({
        label: d.id,
        value: domainPercents[d.id] ?? 0,
        color: d.color,
      })),
    [domainPercents]
  );

  const handleSubmit = () => {
    if (!allRated) return;
    completeBaseline();
    router.push("/quiz");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div className="space-y-10">
        {DOMAINS.map((domain) => (
          <section key={domain.id}>
            <div className="mb-4 flex items-center gap-2">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: domain.color }}
                aria-hidden
              />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {domain.name}{" "}
                <span className="text-sm font-normal text-slate-400">({domain.id})</span>
              </h2>
            </div>
            <div className="space-y-4">
              {getSubdomainsByDomain(domain.id).map((subdomain) => (
                <SubdomainRatingCard
                  key={subdomain.id}
                  subdomain={subdomain}
                  accentColor={domain.color}
                />
              ))}
            </div>
          </section>
        ))}

        <div className="sticky bottom-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allRated}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
          >
            {allRated
              ? "Begin Assessment →"
              : `Rate all subjects to continue (${ratedTopics}/${totalTopics})`}
          </button>
        </div>
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h3 className="text-center font-semibold text-slate-900 dark:text-slate-100">
            Your Familiarity Baseline
          </h3>
          <p className="mt-1 text-center text-xs text-slate-400">
            Domain average across all rated subjects — updates live
          </p>
          <div className="mx-auto mt-4 aspect-square max-w-xs">
            <RadarChart data={radarData} />
          </div>
          <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
            {ratedTopics} / {totalTopics} subjects rated
          </p>
        </div>
      </div>
    </div>
  );
}
