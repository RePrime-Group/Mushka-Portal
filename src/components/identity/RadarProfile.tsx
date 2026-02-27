import { motion } from "motion/react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import type { InstrumentScore } from "../../store/types";
import { NORMS } from "../../data/norms";

interface RadarProfileProps {
  scores: Record<string, InstrumentScore>;
}

function normalizeScore(instrumentId: string, score: InstrumentScore): number {
  // Normalize all scores to 0-100 for radar display
  switch (instrumentId) {
    case "ngse":
      return ((score.mean - 1) / 4) * 100; // 1-5 scale
    case "mslq_se":
      return ((score.mean - 1) / 6) * 100; // 1-7 scale
    case "grit":
      return ((score.mean - 1) / 4) * 100; // 1-5 scale
    case "metacognition":
      return ((score.mean - 1) / 6) * 100; // 1-7 scale
    case "ai_knowledge":
      return ((score.raw ?? 0) / 5) * 100; // 0-5 sum
    case "tech_comfort":
      return ((score.mean - 1) / 5) * 100; // 1-6 scale
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

export default function RadarProfile({ scores }: RadarProfileProps) {
  const axes = [
    { key: "ngse", label: "Self-Efficacy" },
    { key: "mslq_se", label: "Learning\nConfidence" },
    { key: "grit", label: "Grit" },
    { key: "metacognition", label: "Metacognition" },
    { key: "ai_knowledge", label: "AI Knowledge" },
    { key: "tech_comfort", label: "Tech Comfort" },
  ];

  const data = axes.map((axis) => ({
    axis: axis.label,
    score: scores[axis.key] ? normalizeScore(axis.key, scores[axis.key]) : 0,
    average: normalizeNorm(axis.key),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="w-full"
    >
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#e5e5e5" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fontSize: 10, fill: "#78716c" }}
          />
          {/* Population average polygon */}
          <Radar
            name="Average"
            dataKey="average"
            stroke="#0E3470"
            fill="#0E3470"
            fillOpacity={0.08}
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
          {/* Mushka's scores polygon */}
          <Radar
            name="You"
            dataKey="score"
            stroke="#BC9C45"
            fill="#BC9C45"
            fillOpacity={0.2}
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
          <div className="w-3 h-0.5 bg-[#0E3470] opacity-50" style={{ borderTop: "1.5px dashed #0E3470" }} />
          <span className="text-[11px] text-warm-gray">Population Average</span>
        </div>
      </div>
    </motion.div>
  );
}
