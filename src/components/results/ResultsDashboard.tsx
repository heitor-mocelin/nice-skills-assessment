"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAssessment } from "@/context/AssessmentContext";
import { DOMAINS } from "@/data/domains";
import { SUBDOMAINS } from "@/data/subdomains";
import { RadarChart } from "@/components/charts/RadarChart";
import { computeDomainResults, computeSubdomainResults } from "@/lib/resultsCompute";
import { getSubdomainColor } from "@/lib/domainColors";

function confidenceGapLabel(gap: number | null): { text: string; className: string } {
  if (gap === null) {
    return { text: "No baseline to compare", className: "text-slate-400" };
  }
  if (Math.abs(gap) <= 5) {
    return { text: "Well calibrated", className: "text-emerald-600 dark:text-emerald-400" };
  }
  if (gap < 0) {
    return {
      text: `Overconfident by ${Math.abs(gap)} pts`,
      className: "text-red-600 dark:text-red-400",
    };
  }
  return {
    text: `Underconfident by ${gap} pts`,
    className: "text-amber-600 dark:text-amber-400",
  };
}

export function ResultsDashboard() {
  const router = useRouter();
  const { state, resetAssessment } = useAssessment();

  const results = useMemo(
    () => computeDomainResults(state.baseline, state.responses, state.skippedSubdomains),
    [state.baseline, state.responses, state.skippedSubdomains]
  );

  const subdomainResults = useMemo(
    () => computeSubdomainResults(state.baseline, state.responses, state.skippedSubdomains),
    [state.baseline, state.responses, state.skippedSubdomains]
  );
  const focusAreaResults = useMemo(
    () => subdomainResults.filter((s) => s.isFocusArea),
    [subdomainResults]
  );

  const totalQuestions = results.reduce((sum, r) => sum + r.totalQuestions, 0);
  const totalCorrect = results.reduce((sum, r) => sum + r.correctCount, 0);
  const totalIdk = results.reduce((sum, r) => sum + r.idkCount, 0);
  const totalPointsEarned = results.reduce((sum, r) => sum + r.pointsEarned, 0);
  const totalPointsPossible = results.reduce((sum, r) => sum + r.pointsPossible, 0);
  const overallAccuracy =
    totalQuestions === 0 ? 0 : Math.round((totalCorrect / totalQuestions) * 100);

  const radarLabels = DOMAINS.map((d) => d.id);
  const radarSeries = useMemo(() => {
    const series = [
      {
        name: "Actual performance",
        color: "#0ea5e9",
        values: results.map((r) => r.performancePercent),
      },
    ];
    if (!state.baselineSkipped) {
      series.unshift({
        name: "Self-rated baseline",
        color: "#6366f1",
        values: results.map((r) => r.baselineScorePercent ?? 0),
      });
    }
    return series;
  }, [results, state.baselineSkipped]);

  const handleRestart = () => {
    resetAssessment();
    router.push("/");
  };

  return (
    <div className="space-y-8">
      {/* Overview summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard label="Questions answered" value={String(totalQuestions)} />
        <SummaryCard label="Overall accuracy" value={`${overallAccuracy}%`} />
        <SummaryCard label="Points earned" value={`${totalPointsEarned} / ${totalPointsPossible}`} />
        <SummaryCard label={"“I don't know”"} value={String(totalIdk)} />
      </div>

      {/* Career focus areas */}
      {focusAreaResults.length > 0 && (
        <div className="rounded-xl border-2 border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/20 p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
            <span aria-hidden>⭐</span>
            Your Career Focus Areas
          </h2>
          <p className="mt-1 text-xs text-amber-800/80 dark:text-amber-400/80">
            You flagged {focusAreaResults.length === 1 ? "this sub-domain" : "these sub-domains"}{" "}
            as a focus area for your career during the self-assessment. Here&apos;s how you
            actually performed:
          </p>
          <div className="mt-4 space-y-3">
            {focusAreaResults.map((fa) => {
              const subdomain = SUBDOMAINS.find((s) => s.id === fa.subdomainId);
              const domain = DOMAINS.find((d) => d.id === fa.domainId);
              const color = getSubdomainColor(fa.subdomainId);
              const needsAttention = !fa.skipped && fa.totalQuestions > 0 && fa.performancePercent < 60;

              return (
                <div
                  key={fa.subdomainId}
                  className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-white dark:bg-slate-900 p-3.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                        aria-hidden
                      />
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {fa.subdomainId}
                        {subdomain ? ` — ${subdomain.title}` : ""}
                      </span>
                      <span className="text-xs text-slate-400">({domain?.name ?? fa.domainId})</span>
                    </div>
                    {fa.skipped ? (
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Skipped
                      </span>
                    ) : needsAttention ? (
                      <span className="rounded-full bg-red-100 dark:bg-red-950/50 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:text-red-400">
                        Needs attention
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        On track
                      </span>
                    )}
                  </div>

                  {fa.skipped ? (
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      You skipped this entire section, so there is no performance data for a
                      declared focus area. Consider revisiting it since this is a priority for
                      your career.
                    </p>
                  ) : (
                    <>
                      <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <Metric
                          label="Baseline"
                          value={fa.baselineScorePercent === null ? "—" : `${fa.baselineScorePercent}%`}
                        />
                        <Metric label="Performance" value={`${fa.performancePercent}%`} />
                        <Metric
                          label="Correct"
                          value={`${fa.correctCount} / ${fa.totalQuestions}`}
                        />
                      </div>
                      {needsAttention && (
                        <p className="mt-2 text-xs font-medium text-red-700 dark:text-red-400">
                          This is a declared focus area for your career, but your actual
                          performance ({fa.performancePercent}%) suggests it needs more attention
                          before you rely on it.
                        </p>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Radar comparison */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="text-center font-semibold text-slate-900 dark:text-slate-100">
          Baseline vs. Actual Performance
        </h2>
        {state.baselineSkipped && (
          <p className="mt-1 text-center text-xs text-amber-600 dark:text-amber-400">
            Self-assessment was skipped, so only actual performance is shown.
          </p>
        )}
        <div className="mx-auto mt-4 aspect-square max-w-sm">
          <RadarChart labels={radarLabels} series={radarSeries} />
        </div>
        <div className="mt-4 flex justify-center gap-6 text-xs">
          {radarSeries.map((s) => (
            <div key={s.name} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: s.color }}
                aria-hidden
              />
              <span className="text-slate-500 dark:text-slate-400">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Per-domain breakdown */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Per-Domain Breakdown
        </h2>
        {DOMAINS.map((domain) => {
          const result = results.find((r) => r.domainId === domain.id);
          if (!result) return null;
          const gap = confidenceGapLabel(result.confidenceGap);
          const domainFocusAreas = focusAreaResults.filter((fa) => fa.domainId === domain.id);

          return (
            <div
              key={domain.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: domain.color }}
                    aria-hidden
                  />
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {domain.name}{" "}
                    <span className="text-xs font-normal text-slate-400">({domain.id})</span>
                  </h3>
                  {domainFocusAreas.length > 0 && (
                    <span
                      className="flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400"
                      title={`Career focus area: ${domainFocusAreas.map((fa) => fa.subdomainId).join(", ")}`}
                    >
                      ⭐ Focus: {domainFocusAreas.map((fa) => fa.subdomainId).join(", ")}
                    </span>
                  )}
                </div>
                <span className={`text-xs font-semibold ${gap.className}`}>{gap.text}</span>
              </div>

              {result.skippedSubdomainIds.length > 0 && (
                <div className="mt-3 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 p-3">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    ⏭ {result.skippedSubdomainIds.length === result.totalSubdomains
                      ? "Entire domain skipped"
                      : `${result.skippedSubdomainIds.length} of ${result.totalSubdomains} sections skipped`}
                  </p>
                  <ul className="mt-1 space-y-0.5 text-xs text-amber-700/90 dark:text-amber-400/90">
                    {result.skippedSubdomainIds.map((subdomainId) => {
                      const subdomain = SUBDOMAINS.find((s) => s.id === subdomainId);
                      return (
                        <li key={subdomainId} className="flex items-center gap-1.5">
                          <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: getSubdomainColor(subdomainId) }}
                            aria-hidden
                          />
                          <span>
                            <span className="font-mono">{subdomainId}</span>
                            {subdomain ? ` — ${subdomain.title}` : ""}: shown as 0% (skipped),
                            excluded from the domain score above.
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Metric
                  label="Baseline"
                  value={
                    result.baselineScorePercent === null ? "—" : `${result.baselineScorePercent}%`
                  }
                />
                <Metric label="Performance" value={`${result.performancePercent}%`} />
                <Metric
                  label="Correct"
                  value={`${result.correctCount} / ${result.totalQuestions}`}
                />
                <Metric label={"“I don't know”"} value={String(result.idkCount)} />
              </div>

              {/* Comparison bars */}
              <div className="mt-4 space-y-2">
                <ComparisonBar
                  label="Baseline"
                  percent={result.baselineScorePercent ?? 0}
                  color="#6366f1"
                  showEmpty={result.baselineScorePercent === null}
                />
                <ComparisonBar
                  label="Performance"
                  percent={result.performancePercent}
                  color={domain.color}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center pb-4">
        <button
          type="button"
          onClick={handleRestart}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-center shadow-sm">
      <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}

function ComparisonBar({
  label,
  percent,
  color,
  showEmpty,
}: {
  label: string;
  percent: number;
  color: string;
  showEmpty?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-20 shrink-0 text-slate-400">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        {!showEmpty && (
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${percent}%`, backgroundColor: color }}
          />
        )}
      </div>
      <span className="w-10 shrink-0 text-right text-slate-500 dark:text-slate-400">
        {showEmpty ? "—" : `${percent}%`}
      </span>
    </div>
  );
}
