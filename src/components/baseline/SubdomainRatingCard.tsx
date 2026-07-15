"use client";

import { Subdomain } from "@/types/nice";
import { useAssessment } from "@/context/AssessmentContext";

const RATING_LABELS: Record<number, string> = {
  0: "No familiarity",
  1: "Slight familiarity",
  2: "Somewhat comfortable",
  3: "Comfortable",
  4: "Expert",
};

interface SubdomainRatingCardProps {
  subdomain: Subdomain;
  accentColor: string;
}

/**
 * Renders a single sub-domain worksheet card: NICE work role references,
 * the "what lives here" topic checklist, a 0-4 rating scale, a career-focus
 * YES/NO flag, and a free-text notes area — mirroring the paper worksheet.
 */
export function SubdomainRatingCard({ subdomain, accentColor }: SubdomainRatingCardProps) {
  const { getSubdomainBaseline, updateSubdomainBaseline } = useAssessment();
  const baseline = getSubdomainBaseline(subdomain.id);

  const rating = baseline?.rating ?? null;
  const isFocusArea = baseline?.isFocusArea ?? null;
  const notes = baseline?.notes ?? "";

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="p-5" style={{ borderLeft: `4px solid ${accentColor}` }}>
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          {subdomain.id} — {subdomain.title}
        </h3>
        <p className="mt-1 text-xs italic text-slate-500 dark:text-slate-400">
          NICE work roles:{" "}
          {subdomain.workRoles
            .map((wr) => `${wr.name} (${wr.code})`)
            .join(", ")}
        </p>

        <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
          What lives here (rate yourself against this whole list):
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
          {subdomain.topics.map((topic, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden />
              <span>{topic}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Rating (0–4):
          </span>
          {([0, 1, 2, 3, 4] as const).map((value) => {
            const isSelected = rating === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() =>
                  updateSubdomainBaseline(subdomain.id, subdomain.domainId, { rating: value })
                }
                aria-pressed={isSelected}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                  isSelected
                    ? "text-white shadow"
                    : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
                style={isSelected ? { backgroundColor: accentColor } : undefined}
              >
                {value}
              </button>
            );
          })}
          <span className="ml-1 text-xs text-slate-400">
            {rating !== null ? RATING_LABELS[rating] : ""}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Focus area for my career?
          </span>
          <div className="flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() =>
                updateSubdomainBaseline(subdomain.id, subdomain.domainId, { isFocusArea: true })
              }
              aria-pressed={isFocusArea === true}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                isFocusArea === true
                  ? "bg-indigo-600 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              YES
            </button>
            <button
              type="button"
              onClick={() =>
                updateSubdomainBaseline(subdomain.id, subdomain.domainId, { isFocusArea: false })
              }
              aria-pressed={isFocusArea === false}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                isFocusArea === false
                  ? "bg-slate-600 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              NO
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 p-5">
        <label
          htmlFor={`notes-${subdomain.id}`}
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          In your own words — how comfortable are you here? Call out uneven spots (e.g.,
          &ldquo;TCP/IP solid, BGP theoretical only&rdquo;):
        </label>
        <textarea
          id={`notes-${subdomain.id}`}
          value={notes}
          onChange={(e) =>
            updateSubdomainBaseline(subdomain.id, subdomain.domainId, { notes: e.target.value })
          }
          rows={3}
          placeholder="Optional notes..."
          className="mt-2 w-full resize-y rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}
