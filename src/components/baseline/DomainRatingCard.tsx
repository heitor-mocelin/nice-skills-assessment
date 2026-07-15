"use client";

import { Domain, FamiliarityRating } from "@/types/nice";

const RATING_LABELS: Record<FamiliarityRating, string> = {
  1: "No familiarity",
  2: "Slight familiarity",
  3: "Somewhat comfortable",
  4: "Comfortable",
  5: "Expert",
};

interface DomainRatingCardProps {
  domain: Domain;
  value: FamiliarityRating | null;
  onChange: (rating: FamiliarityRating) => void;
}

export function DomainRatingCard({ domain, value, onChange }: DomainRatingCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span
          className="mt-1 h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: domain.color }}
          aria-hidden
        />
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            {domain.name}{" "}
            <span className="text-xs font-normal text-slate-400">({domain.id})</span>
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {domain.description}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {([1, 2, 3, 4, 5] as FamiliarityRating[]).map((rating) => {
          const isSelected = value === rating;
          return (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              aria-pressed={isSelected}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                isSelected
                  ? "text-white shadow"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
              style={isSelected ? { backgroundColor: domain.color } : undefined}
            >
              {rating}
            </button>
          );
        })}
        <span className="ml-3 text-sm text-slate-500 dark:text-slate-400">
          {value ? RATING_LABELS[value] : "Not yet rated"}
        </span>
      </div>
    </div>
  );
}
