"use client";

import Link from "next/link";
import { useAssessment } from "@/context/AssessmentContext";
import { ResultsDashboard } from "@/components/results/ResultsDashboard";

/**
 * Stage 3: Results Dashboard. Compares the user's Stage 1 self-rated
 * familiarity baseline against their Stage 2 actual quiz performance, per
 * domain, including a "confidence gap" callout (over/underconfident).
 */
export default function ResultsPage() {
  const { isHydrated } = useAssessment();

  return (
    <main className="mx-auto flex max-w-4xl flex-1 flex-col px-6 py-12">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Stage 3 of 3
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">
          Results Dashboard
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          How your self-perception compared to your actual performance, per domain.
        </p>
      </div>

      {isHydrated ? (
        <ResultsDashboard />
      ) : (
        <div className="flex flex-1 items-center justify-center py-24 text-slate-400">
          Loading results…
        </div>
      )}

      <Link
        href="/"
        className="mt-8 text-center text-sm text-indigo-600 underline hover:text-indigo-700"
      >
        ← Back to home
      </Link>
    </main>
  );
}
