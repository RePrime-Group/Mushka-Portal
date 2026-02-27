import { motion } from "motion/react";
import type { AssessmentOption } from "../../store/types";

interface LikertCardProps {
  option: AssessmentOption;
  selected: boolean;
  hasSelection: boolean;
  onSelect: () => void;
}

export default function LikertCard({ option, selected, hasSelection, onSelect }: LikertCardProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all min-h-[44px] ${
        selected
          ? "border-[#BC9C45] bg-[#FBF5E6]"
          : hasSelection
          ? "border-stone-100 bg-white opacity-70"
          : "border-stone-100 bg-white hover:border-stone-200"
      }`}
    >
      <span className={`text-sm ${selected ? "text-navy font-medium" : "text-stone-700"}`}>
        {option.label}
      </span>
    </motion.button>
  );
}
