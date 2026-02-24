import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Task } from "../../data/curriculum";
import { useAppStore } from "../../store/useAppStore";
import { smallBurst } from "../gamification/ConfettiTrigger";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const taskProgress = useAppStore((s) => s.stages[task.stageId]?.tasks[task.id]);
  const completeTask = useAppStore((s) => s.completeTask);
  const isCompleted = taskProgress?.completed;

  function handleComplete() {
    if (isCompleted) return;
    smallBurst();
    completeTask(task.stageId, task.id);
  }

  return (
    <div className="bg-white rounded-xl border border-stone-100 overflow-hidden shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-3 text-left min-h-[44px]"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm"
          style={{
            backgroundColor: isCompleted ? "rgba(212,168,67,0.15)" : "rgba(45,212,191,0.1)",
            color: isCompleted ? "#d4a843" : "#2dd4bf",
          }}
        >
          {isCompleted ? "\u{2713}" : task.id}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-navy text-sm truncate">{task.title}</h4>
            <span className="text-[11px] bg-stone-50 text-warm-gray px-1.5 py-0.5 rounded shrink-0">
              {task.subtitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-gold bg-gold/10 px-2 py-1 rounded-lg">
            {task.xp} XP
          </span>
          <svg
            className={`w-4 h-4 text-warm-gray transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-stone-50 pt-3">
              <p className="text-sm text-stone-600 leading-relaxed">{task.description}</p>

              <div>
                <h5 className="text-xs font-semibold text-navy uppercase tracking-wide mb-1">
                  What You'll Learn
                </h5>
                <p className="text-sm text-stone-600">{task.whatYouLearn}</p>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-navy uppercase tracking-wide mb-2">
                  Claude Features Practiced
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {task.claudeFeatures.map((feature) => (
                    <span
                      key={feature}
                      className="text-[11px] px-2 py-1 bg-teal/10 text-teal rounded-md font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {!isCompleted && (
                <button
                  onClick={handleComplete}
                  className="w-full py-3 bg-navy text-white rounded-xl font-medium hover:bg-navy-light active:scale-[0.98] transition-all min-h-[44px]"
                >
                  Mark as Complete
                </button>
              )}

              {isCompleted && taskProgress?.completedAt && (
                <div className="flex items-center gap-2 py-2">
                  <span className="text-gold">{"\u{2713}"}</span>
                  <span className="text-sm text-warm-gray">
                    Completed {new Date(taskProgress.completedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
