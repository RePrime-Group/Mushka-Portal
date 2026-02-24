import { motion } from "motion/react";

interface FeedbackDisplayProps {
  feedback: string;
  stageId: number;
}

export default function FeedbackDisplay({ feedback, stageId }: FeedbackDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gold/20 p-5 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{"\u{1F4AC}"}</span>
        <h3 className="font-semibold text-navy">Feedback — Stage {stageId}</h3>
      </div>

      <div className="bg-gold/5 rounded-xl p-4">
        <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">{feedback}</p>
      </div>

      <p className="text-[11px] text-warm-gray mt-3">
        From RePrime Group — personalized feedback on your reflection
      </p>
    </motion.div>
  );
}
