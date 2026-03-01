import { motion } from "motion/react";
import { useAppStore } from "../../store/useAppStore";
import { TOTAL_XP } from "../../data/curriculum";
import { getNextMilestone } from "../../utils/xp";

export default function XPBar() {
  const xp = useAppStore((s) => s.xp);
  const progress = Math.min(xp / TOTAL_XP, 1);
  const next = getNextMilestone(xp);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-semibold text-navy">{xp.toLocaleString()} XP</span>
        <span className="text-xs text-warm-gray">
          {next ? `${next.xpNeeded.toLocaleString()} XP to ${next.title}` : "Max Level"}
        </span>
      </div>
      <div className="h-3 bg-stone-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: progress < 0.3
              ? "linear-gradient(90deg, #2dd4bf, #5eead4)"
              : progress < 0.6
              ? "linear-gradient(90deg, #2dd4bf, #d4a843)"
              : progress < 0.9
              ? "linear-gradient(90deg, #d4a843, #e8c96a)"
              : "linear-gradient(90deg, #d4a843, #f59e0b)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-warm-gray">{TOTAL_XP.toLocaleString()} XP total</span>
      </div>
    </div>
  );
}
