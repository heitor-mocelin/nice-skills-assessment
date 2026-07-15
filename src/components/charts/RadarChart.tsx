"use client";

export interface RadarDatum {
  label: string;
  value: number; // 0-100
  color: string;
}

interface RadarChartProps {
  data: RadarDatum[];
  size?: number;
}

/**
 * Lightweight, dependency-free SVG radar chart.
 * Renders one polygon per data point around a circular grid with
 * configurable rings, used to visualize the Stage 1 familiarity baseline.
 */
export function RadarChart({ data, size = 320 }: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.36;
  const rings = [0.25, 0.5, 0.75, 1];
  const angleStep = (Math.PI * 2) / data.length;

  const pointFor = (index: number, valuePercent: number) => {
    const angle = angleStep * index - Math.PI / 2; // start at top
    const r = radius * (valuePercent / 100);
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const dataPoints = data.map((d, i) => pointFor(i, d.value));
  const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      height="100%"
      role="img"
      aria-label="Radar chart of domain familiarity ratings"
    >
      {/* Background grid rings */}
      {rings.map((ringScale) => {
        const ringPoints = data
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
      {data.map((_, i) => {
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

      {/* Data polygon */}
      <polygon
        points={polygonPoints}
        fill="#6366f1"
        fillOpacity={0.25}
        stroke="#6366f1"
        strokeWidth={2}
      />

      {/* Data point markers */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill={data[i].color} />
      ))}

      {/* Labels */}
      {data.map((d, i) => {
        const labelPoint = pointFor(i, 118);
        return (
          <text
            key={d.label}
            x={labelPoint.x}
            y={labelPoint.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-600 dark:fill-slate-300 text-[11px] font-medium"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}
