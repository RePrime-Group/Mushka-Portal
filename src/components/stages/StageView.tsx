import { useState } from "react";
import { motion } from "motion/react";
import { stages } from "../../data/curriculum";
import { useAppStore } from "../../store/useAppStore";
import TaskCard from "./TaskCard";
import ReflectionForm from "../reflection/ReflectionForm";
import FeedbackDisplay from "../reflection/FeedbackDisplay";
import { largeBurst } from "../gamification/ConfettiTrigger";

interface StageViewProps {
  stageId: number;
}

export default function StageView({ stageId }: StageViewProps) {
  const stage = stages.find((s) => s.id === stageId);
  const stageProgress = useAppStore((s) => s.stages[stageId]);
  const submitReflection = useAppStore((s) => s.submitReflection);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!stage) return null;

  const completedTasks = stageProgress
    ? Object.values(stageProgress.tasks).filter((t) => t.completed).length
    : 0;
  const allTasksComplete = completedTasks === 5;
  const reflectionSubmitted = stageProgress?.reflectionSubmitted;

  async function handleReflectionSubmit(reflection: string) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stageNumber: stageId, reflection }),
      });
      const data = await res.json();
      setFeedback(data.feedback || "Thank you for your reflection. Keep growing!");
      submitReflection(stageId, reflection, data.feedback);
      largeBurst();
    } catch {
      setFeedback(
        "Thank you for your reflection. We received it and appreciate your thoughtful response. Keep building on what you've learned!"
      );
      submitReflection(stageId, reflection, "");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-medium text-teal bg-teal/10 px-2 py-1 rounded-md">
            Stage {stage.id}
          </span>
          <span className="text-xs text-warm-gray">{stage.contextBreakdown}</span>
        </div>
        <h1 className="text-2xl font-bold text-navy mb-2">{stage.title}</h1>
        <p className="text-sm text-stone-600 leading-relaxed">{stage.description}</p>
      </motion.div>

      <div className="space-y-3">
        {stage.tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <TaskCard task={task} />
          </motion.div>
        ))}
      </div>

      {allTasksComplete && !reflectionSubmitted && !feedback && (
        <ReflectionForm
          stageId={stageId}
          prompt={stage.reflection}
          onSubmit={handleReflectionSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {feedback && <FeedbackDisplay feedback={feedback} stageId={stageId} />}

      {reflectionSubmitted && !feedback && (
        <div className="bg-white rounded-2xl border border-gold/20 p-5 shadow-sm text-center">
          <span className="text-2xl">{"\u{2713}"}</span>
          <p className="text-sm text-warm-gray mt-2">Reflection submitted for Stage {stageId}</p>
        </div>
      )}
    </div>
  );
}
