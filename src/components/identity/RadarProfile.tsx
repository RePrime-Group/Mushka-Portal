import { useState, useEffect, useRef } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { InstrumentScore } from "../../store/types";
import { NORMS } from "../../data/norms";

interface RadarProfileProps {
  scores: Record<string, InstrumentScore>;
}

function normalizeScore(instrumentId: string, score: InstrumentScore): number {
  switch (instrumentId) {
    case "ngse":
      return ((score.mean - 1) / 4) * 100;
    case "mslq_se":
      return ((score.mean - 1) / 6) * 100;
    case "grit":
      return ((score.mean - 1) / 4) * 100;
    case "metacognition":
      return ((score.mean - 1) / 6) * 100;
    case "ai_knowledge":
      return ((score.raw ?? 0) / 5) * 100;
    case "tech_comfort":
      return ((score.mean - 1) / 5) * 100;
    default:
      return 50;
  }
}

function normalizeNorm(instrumentId: string): number {
  const norm = NORMS[instrumentId];
  if (!norm) return 50;
  switch (instrumentId) {
    case "ngse":
      return ((norm.mean - 1) / 4) * 100;
    case "mslq_se":
      return ((norm.mean - 1) / 6) * 100;
    case "grit":
      return ((norm.mean - 1) / 4) * 100;
    case "metacognition":
      return ((norm.mean - 1) / 6) * 100;
    default:
      return 50;
  }
}

const AXES = [
  { key: "ngse", label: "Self-Efficacy" },
  { key: "mslq_se", label: "Learning\nConfidence" },
  { key: "grit", label: "Grit" },
  { key: "metacognition", label: "Metacognition" },
  { key: "ai_knowledge", label: "AI Knowledge" },
  { key: "tech_comfort", label: "Tech Comfort" },
];

const ANIM_DURATION = 1500; // ms per axis
const STAGGER_MS = 100;     // delay between axes
const INITIAL_DELAY = 400;  // wait for container fade-in

export default function RadarProfile({ scores }: RadarProfileProps) {
  // Per-axis progress 0→1, staggered
  const [axisProgress, setAxisProgress] = useState<number[]>(
    Array(AXES.length).fill(0)
  );
  const rafRef = useRef<number | undefined>(undefined);
  const startRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const delay = setTimeout(() => {
      startRef.current = performance.now();

      function tick(now: number) {
        const elapsed = now - startRef.current!;
        const next = AXES.map((_, i) => {
          const axisElapsed = elapsed - i * STAGGER_MS;
          if (axisElapsed <= 0) return 0;
          const p = Math.min(axisElapsed / ANIM_DURATION, 1);
          // ease-out-cubic
          return 1 - Math.pow(1 - p, 3);
        });
        setAxisProgress(next);

        if (next[AXES.length - 1] < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }, INITIAL_DELAY);

    return () => {
      clearTimeout(delay);
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const finalData = AXES.map((axis) => ({
    axis: axis.label,
    score: scores[axis.key] ? normalizeScore(axis.key, scores[axis.key]) : 0,
    average: normalizeNorm(axis.key),
  }));

  // Apply per-axis progress to produce animated values
  const animatedData = finalData.map((d, i) => ({
    axis: d.axis,
    score: d.score * axisProgress[i],
    average: d.average * axisProgress[i],
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={animatedData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#e5e5e5" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fontSize: 10, fill: "#78716c" }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            ticks={[25, 50, 75, 100]}
            tick={{ fontSize: 8, fill: "#a8a29e" }}
            axisLine={false}
          />
          {/* Population average polygon — spec: navy at 0.15 opacity */}
          <Radar
            name="Average"
            dataKey="average"
            stroke="#0E3470"
            fill="#0E3470"
            fillOpacity={0.15}
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
          {/* User scores polygon — spec: gold at 0.3 opacity */}
          <Radar
            name="You"
            dataKey="score"
            stroke="#BC9C45"
            fill="#BC9C45"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-[#BC9C45]" />
          <span className="text-[11px] text-warm-gray">You</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-navy opacity-50" style={{ borderTop: "1.5px dashed #0E3470" }} />
          <span className="text-[11px] text-warm-gray">Population Average</span>
        </div>
      </div>
    </div>
  );
}
