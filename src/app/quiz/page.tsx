"use client";

import Link from "next/link";
import { useAssessment } from "@/context/AssessmentContext";
import { SUBDOMAINS } from "@/data/subdomains";
import { computeSubdomainAverage } from "@/lib/baselineRollup";

/**
 * Temporary placeholder for Stage 2 (The Assessment / Quiz Engine).
 * Confirms that Stage 1 -> Stage 2 routing and persisted state work.
 * Will be replaced by the full quiz engine in Milestone 3.
 */
export default function QuizPlaceholderPage() {
  const { state, isHydrated } = useAssessment();

  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
        Stage 2 of 3
      </p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">
        The Assessment
      </h1>
      <p className="mt-3 max-w-md text-slate-500 dark:text-slate-400">
        The quiz engine is coming in Milestone 3. Your Stage 1 baseline has
        been saved.
      </p>

      {isHydrated && (
        <div className="mt-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-left text-sm">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Saved baseline ratings:
          </p>
          <ul className="mt-2 space-y-1 text-slate-500 dark:text-slate-400">
            {state.baseline.map((b) => {
              const subdomain = SUBDOMAINS.find((s) => s.id === b.subdomainId);
              const avg = subdomain ? computeSubdomainAverage(subdomain, b) : null;
              return (
                <li key={b.subdomainId}>
                  {b.subdomainId}: {avg !== null ? avg.toFixed(1) : "—"}/4
                  {b.isFocusArea ? " · focus area" : ""}
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-slate-400">Current stage: {state.currentStage}</p>
        </div>
      )}

      <Link
        href="/baseline"
        className="mt-8 text-sm text-indigo-600 underline hover:text-indigo-700"
      >
        ← Back to baseline
      </Link>
    </main>
  );
}
