"use client";

import { useId, useState } from "react";

interface InfoTooltipProps {
  /** Extended, tangible description shown on hover/focus */
  description: string;
}

/**
 * A small "?" icon that reveals an extended description in a floating
 * balloon on hover or keyboard focus (accessible via tabIndex + aria).
 * Used next to each rating topic to give concrete, tangible context for
 * what the user is rating themselves against.
 */
export function InfoTooltip({ description }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-describedby={tooltipId}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-slate-300 dark:border-slate-600 text-[10px] font-semibold text-slate-400 hover:border-indigo-400 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        ?
      </button>
      {isVisible && (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs font-normal leading-relaxed text-slate-600 dark:text-slate-300 shadow-lg"
        >
          {description}
          <span
            className="absolute left-1/2 top-full -mt-1 -translate-x-1/2 border-4 border-transparent border-t-white dark:border-t-slate-800"
            aria-hidden
          />
        </span>
      )}
    </span>
  );
}
