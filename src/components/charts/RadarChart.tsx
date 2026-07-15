"use client";

export interface RadarSeries {
  name: string;
  color: string;
  /** one value (0-100) per axis, in the same order as `labels` */
  values: number[];
}

interface RadarChartProps {
  labels: string[];
  series: RadarSeries[];
  size?: number;
}

/**
 * Lightweight, dependency-free SVG radar chart. Supports overlaying multiple
 * series (e.g. Stage 1 self-rated baseline vs. Stage 2 actual quiz
 * performance) on the same axes so users can visually compare the two.
 */
export function RadarChart({ labels, series, size = 320 }: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.36;
  const rings = [0.25, 0.5, 0.75, 1];
  const angleStep = (Math.PI * 2) / labels.length;

  const pointFor = (index: number, valuePercent: number) => {
    const angle = angleStep * index - Math.PI / 2; // start at top
    const r = radius * (valuePercent / 100);
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      height="100%"
      role="img"
      aria-label="Radar chart comparing familiarity baseline and quiz performance"
    >
      {/* Background grid rings */}
      {rings.map((ringScale) => {
        const ringPoints = labels
          .map((_, i) => {
            const p = pointFor(i, ringScale * 100);
            return `${p.x},${p.y}`;
          })
          .join(" ");
        return (
          <polygon
            key={ringScale}
            points={ringPoints}
            fill="none"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-700"
            strokeWidth={1}
          />
        );
      })}

      {/* Axis lines from center to each label */}
      {labels.map((_, i) => {
        const p = pointFor(i, 100);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-700"
            strokeWidth={1}
          />
        );
      })}

      {/* One polygon + point markers per series */}
      {series.map((s) => {
        const dataPoints = s.values.map((v, i) => pointFor(i, v));
        const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");
        return (
          <g key={s.name}>
            <polygon
              points={polygonPoints}
              fill={s.color}
              fillOpacity={0.18}
              stroke={s.color}
              strokeWidth={2}
            />
            {dataPoints.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={s.color} />
            ))}
          </g>
        );
      })}

      {/* Labels */}
      {labels.map((label, i) => {
        const labelPoint = pointFor(i, 118);
        return (
          <text
            key={label}
            x={labelPoint.x}
            y={labelPoint.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-600 dark:fill-slate-300 text-[11px] font-medium"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}
