import { motion } from "motion/react";
import type { Stage } from "../../data/curriculum";
import { useAppStore } from "../../store/useAppStore";

interface StageCardProps {
  stage: Stage;
  onClick: () => void;
}

export default function StageCard({ stage, onClick }: StageCardProps) {
  const stageProgress = useAppStore((s) => s.stages[stage.id]);
  const completedTasks = stageProgress
    ? Object.values(stageProgress.tasks).filter((t) => t.completed).length
    : 0;
  const isComplete = stageProgress?.completed;
  const progress = completedTasks / 5;

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="w-full bg-white rounded-2xl shadow-sm border border-stone-100 p-5 text-left transition-shadow hover:shadow-md min-h-[44px]"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-lg font-bold"
          style={{
            backgroundColor: isComplete ? "rgba(212,168,67,0.15)" : "rgba(26,26,46,0.08)",
            color: isComplete ? "#d4a843" : "#1a1a2e",
          }}
        >
          {isComplete ? "\u{2713}" : stage.id}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-navy text-base">
              Stage {stage.id}: {stage.title}
            </h3>
          </div>
          <p className="text-warm-gray text-sm mb-3 line-clamp-2">{stage.description}</p>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: isComplete ? "#d4a843" : "#2dd4bf",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-xs text-warm-gray shrink-0">{completedTasks}/5</span>
          </div>

          <div className="mt-2">
            <span className="text-[11px] text-warm-gray/70 bg-stone-50 px-2 py-0.5 rounded-md">
              {stage.contextBreakdown}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
