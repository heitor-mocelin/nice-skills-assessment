"use client";

import { Subdomain } from "@/types/nice";
import { useAssessment } from "@/context/AssessmentContext";
import { computeSubdomainAverage, isSubdomainFullyRated } from "@/lib/baselineRollup";

interface SubdomainRatingCardProps {
  subdomain: Subdomain;
  accentColor: string;
}

/**
 * Renders a single sub-domain worksheet card: NICE work role references,
 * and one 0-4 rating control per topic ("what lives here" bullet). The
 * sub-domain's overall score is the computed average of its rated topics
 * (shown live), a career-focus YES/NO flag, and a free-text notes area.
 */
export function SubdomainRatingCard({ subdomain, accentColor }: SubdomainRatingCardProps) {
  const { getSubdomainBaseline, setTopicRating, updateSubdomainMeta } = useAssessment();
  const baseline = getSubdomainBaseline(subdomain.id);

  const average = computeSubdomainAverage(subdomain, baseline);
  const fullyRated = isSubdomainFullyRated(subdomain, baseline);
  const isFocusArea = baseline?.isFocusArea ?? null;
  const notes = baseline?.notes ?? "";

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="p-5" style={{ borderLeft: `4px solid ${accentColor}` }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              {subdomain.id} — {subdomain.title}
            </h3>
            <p className="mt-1 text-xs italic text-slate-500 dark:text-slate-400">
              NICE work roles:{" "}
              {subdomain.workRoles.map((wr) => `${wr.name} (${wr.code})`).join(", ")}
            </p>
          </div>

          <div className="shrink-0 rounded-lg bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-center">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Sub-domain avg
            </p>
            <p
              className="text-lg font-bold"
              style={{ color: average !== null ? accentColor : undefined }}
            >
              {average !== null ? average.toFixed(1) : "—"}
              <span className="text-xs font-normal text-slate-400"> / 4</span>
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-300">
          Rate yourself 0–4 on each subject:
        </p>
        <div className="mt-3 space-y-3">
          {subdomain.topics.map((topic, i) => {
            const topicRating = baseline?.topicRatings[i] ?? null;
            return (
              <div
                key={i}
                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-sm text-slate-600 dark:text-slate-400 sm:max-w-md">
                  {topic}
                </span>
                <div className="flex shrink-0 items-center gap-1.5">
                  {([0, 1, 2, 3, 4] as const).map((value) => {
                    const isSelected = topicRating === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setTopicRating(subdomain.id, subdomain.domainId, i, value)
                        }
                        aria-pressed={isSelected}
                        className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold transition-colors ${
                          isSelected
                            ? "text-white shadow"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                        style={isSelected ? { backgroundColor: accentColor } : undefined}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {!fullyRated && (
          <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">
            Rate all {subdomain.topics.length} subjects above to complete this sub-domain.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Focus area for my career?
          </span>
          <div className="flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() =>
                updateSubdomainMeta(subdomain.id, subdomain.domainId, { isFocusArea: true })
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
                updateSubdomainMeta(subdomain.id, subdomain.domainId, { isFocusArea: false })
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
            updateSubdomainMeta(subdomain.id, subdomain.domainId, { notes: e.target.value })
          }
          rows={3}
          placeholder="Optional notes..."
          className="mt-2 w-full resize-y rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}
