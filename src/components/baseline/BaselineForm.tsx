"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { DOMAINS } from "@/data/domains";
import { useAssessment } from "@/context/AssessmentContext";
import { DomainRatingCard } from "@/components/baseline/DomainRatingCard";
import { RadarChart } from "@/components/charts/RadarChart";
import { FamiliarityRating } from "@/types/nice";

export function BaselineForm() {
  const router = useRouter();
  const { state, setBaselineRating, getBaselineRating, completeBaseline } = useAssessment();

  const allRated = DOMAINS.every((d) => getBaselineRating(d.id) !== null);

  const radarData = useMemo(
    () =>
      DOMAINS.map((d) => {
        const rating = getBaselineRating(d.id);
        return {
          label: d.id,
          value: rating ? (rating / 5) * 100 : 0,
          color: d.color,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.baseline]
  );

  const handleSubmit = () => {
    if (!allRated) return;
    completeBaseline();
    router.push("/quiz");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-4">
        {DOMAINS.map((domain) => (
          <DomainRatingCard
            key={domain.id}
            domain={domain}
            value={getBaselineRating(domain.id) as FamiliarityRating | null}
            onChange={(rating) => setBaselineRating(domain.id, rating)}
          />
        ))}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allRated}
          className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
        >
          {allRated ? "Begin Assessment →" : `Rate all ${DOMAINS.length} domains to continue`}
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h3 className="text-center font-semibold text-slate-900 dark:text-slate-100">
          Your Familiarity Baseline
        </h3>
        <p className="mt-1 text-center text-xs text-slate-400">
          Updates live as you rate each domain
        </p>
        <div className="mx-auto mt-4 aspect-square max-w-xs">
          <RadarChart data={radarData} />
        </div>
      </div>
    </div>
  );
}
