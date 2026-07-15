"use client";

import Link from "next/link";
import { DOMAINS } from "@/data/domains";
import { useAssessment } from "@/context/AssessmentContext";

export default function HomePage() {
  const { state, isHydrated, resetAssessment } = useAssessment();

  const hasProgress = isHydrated && state.currentStage !== "not-started";

  return (
    <main className="mx-auto flex max-w-4xl flex-1 flex-col px-6 py-16">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          NIST NICE Framework v2.2.0
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
          Cybersecurity Skills Assessment
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
          Discover how your self-perceived familiarity compares to your actual
          performance across the 5 core NICE Work Role Categories.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {DOMAINS.map((domain) => (
          <div
            key={domain.id}
            className="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"
          >
            <span
              className="mt-1 h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: domain.color }}
              aria-hidden
            />
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                {domain.name}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {domain.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center gap-3">
        <Link
          href="/baseline"
          className="rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white shadow transition-colors hover:bg-indigo-700"
        >
          {hasProgress ? "Continue Assessment" : "Start Assessment"}
        </Link>

        {hasProgress && (
          <button
            type="button"
            onClick={resetAssessment}
            className="text-sm text-slate-400 underline hover:text-slate-600 dark:hover:text-slate-300"
          >
            Reset progress and start over
          </button>
        )}
      </div>
    </main>
  );
}
