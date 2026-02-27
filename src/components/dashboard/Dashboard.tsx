import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { stages, growthMindsetMessages } from "../../data/curriculum";
import { useAppStore } from "../../store/useAppStore";
import StageCard from "../stages/StageCard";

interface DashboardProps {
  onOpenIdentity: () => void;
}

export default function Dashboard({ onOpenIdentity }: DashboardProps) {
  const setCurrentStage = useAppStore((s) => s.setCurrentStage);
  const stageProgress = useAppStore((s) => s.stages);
  const streak = useAppStore((s) => s.streak);
  const assessmentCompleted = useAppStore((s) => s.assessmentState.completed);
  const [confirmStage, setConfirmStage] = useState<number | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % growthMindsetMessages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  function handleStageClick(stageId: number) {
    const previousIncomplete = stages
      .filter((s) => s.id < stageId)
      .some((s) => !stageProgress[s.id]?.completed);

    if (previousIncomplete) {
      setConfirmStage(stageId);
    } else {
      setCurrentStage(stageId);
    }
  }

  function handleConfirm() {
    if (confirmStage) {
      setCurrentStage(confirmStage);
      setConfirmStage(null);
    }
  }

  const totalCompleted = Object.values(stageProgress).reduce((sum, stage) => {
    return sum + Object.values(stage.tasks).filter((t) => t.completed).length;
  }, 0);

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
      {/* Assessment Banner */}
      {!assessmentCompleted && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onOpenIdentity}
          className="w-full bg-[#FBF5E6] border border-[#BC9C45]/30 rounded-2xl p-4 text-left hover:border-[#BC9C45]/60 transition-colors min-h-[44px]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#BC9C45]/15 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-lg">{"\u{1F9E0}"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-navy text-sm">Complete your assessment to personalize your training</p>
              <p className="text-xs text-warm-gray mt-0.5">12 minutes {"\u00B7"} 40 questions {"\u00B7"} Personal Operating Playbook</p>
            </div>
            <svg className="w-4 h-4 text-[#BC9C45] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.button>
      )}

      {assessmentCompleted && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onOpenIdentity}
          className="w-full flex items-center gap-2 justify-center py-2 text-sm text-[#BC9C45] hover:text-[#a8893d] transition-colors min-h-[44px]"
        >
          <span>{"\u{1F451}"}</span>
          <span className="font-medium">View My Profile</span>
        </motion.button>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-navy mb-1">Your AI Journey</h1>
        <p className="text-sm text-warm-gray">
          {totalCompleted} of 25 tasks completed
          {streak.currentStreak > 0 && ` {"\u00B7"} ${streak.currentStreak} day streak`}
        </p>
      </motion.div>

      <div className="space-y-3">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <StageCard stage={stage} onClick={() => handleStageClick(stage.id)} />
          </motion.div>
        ))}
      </div>

      {/* Growth Mindset Quote */}
      <motion.div
        key={quoteIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-navy/5 rounded-2xl p-5 text-center"
      >
        <p className="text-sm text-navy/70 italic leading-relaxed">
          "{growthMindsetMessages[quoteIndex]}"
        </p>
      </motion.div>

      {/* Jump ahead confirmation dialog */}
      {confirmStage !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setConfirmStage(null)}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
          >
            <h3 className="font-semibold text-navy text-lg mb-2">Jump ahead?</h3>
            <p className="text-sm text-stone-600 mb-5">
              We recommend completing stages in order for the best learning experience. Each stage
              builds on skills from the previous one.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmStage(null)}
                className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-navy hover:bg-stone-50 transition-colors min-h-[44px]"
              >
                Go back
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2.5 bg-navy text-white rounded-xl text-sm font-medium hover:bg-navy-light transition-colors min-h-[44px]"
              >
                Jump to Stage {confirmStage}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
