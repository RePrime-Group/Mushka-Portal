import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

const emptyData = [
  { axis: "Self-Efficacy", value: 0 },
  { axis: "Learning Confidence", value: 0 },
  { axis: "Grit", value: 0 },
  { axis: "Metacognition", value: 0 },
  { axis: "AI Knowledge", value: 0 },
  { axis: "Tech Comfort", value: 0 },
];

export default function ScoringScreen() {
  return (
    <div className="min-h-dvh bg-cream flex flex-col items-center justify-center px-4 app-shell">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-sm w-full text-center"
      >
        <div className="w-64 h-64 mx-auto mb-6">
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ResponsiveContainer width="100%" height={256}>
              <RadarChart data={emptyData}>
                <PolarGrid stroke="#e5e5e5" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fontSize: 10, fill: "#78716c" }}
                />
                <Radar
                  dataKey="value"
                  stroke="#BC9C45"
                  fill="#BC9C45"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <p className="text-navy font-medium text-lg mb-2">Building your profile...</p>
        <p className="text-sm text-warm-gray">
          Analyzing your responses and generating your Personal Operating Playbook
        </p>
      </motion.div>
    </div>
  );
}
