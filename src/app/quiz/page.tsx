import { QuizRunner } from "@/components/quiz/QuizRunner";

export default function QuizPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col px-6 py-12">
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Stage 2 of 3
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">
          The Assessment
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Answer honestly — use &ldquo;I don&apos;t know&rdquo; instead of guessing when you&apos;re
          unsure. It helps identify real blind spots.
        </p>
      </div>

      <QuizRunner />
    </main>
  );
}
