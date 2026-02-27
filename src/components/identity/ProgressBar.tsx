import { motion } from "motion/react";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = Math.min(current / total, 1);

  return (
    <div className="w-full">
      <div className="ie-progress-bar">
        <motion.div
          className="ie-progress-fill"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <p className="text-xs text-warm-gray mt-1.5 text-center">
        {current} of {total}
      </p>
    </div>
  );
}
