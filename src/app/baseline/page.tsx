import { BaselineForm } from "@/components/baseline/BaselineForm";

export default function BaselinePage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-1 flex-col px-6 py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Stage 1 of 3
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">
          Familiarity Baseline
        </h1>
        <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">
          Before the quiz begins, rate your comfort level with each domain from
          1 (no familiarity) to 5 (expert). This establishes a self-perception
          baseline we&apos;ll compare against your actual quiz performance in
          the final results.
        </p>
      </div>

      <BaselineForm />
    </main>
  );
}
