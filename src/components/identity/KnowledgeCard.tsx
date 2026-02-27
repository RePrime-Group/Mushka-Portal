import { motion } from "motion/react";
import type { AssessmentOption } from "../../store/types";

interface KnowledgeCardProps {
  option: AssessmentOption;
  selected: boolean;
  hasSelection: boolean;
  onSelect: () => void;
}

export default function KnowledgeCard({ option, selected, hasSelection, onSelect }: KnowledgeCardProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all min-h-[44px] flex items-start gap-3 ${
        selected
          ? "border-[#BC9C45] bg-[#FBF5E6]"
          : hasSelection
          ? "border-stone-100 bg-white opacity-70"
          : "border-stone-100 bg-white hover:border-stone-200"
      }`}
    >
      <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
        selected
          ? "bg-[#BC9C45] text-white"
          : "bg-stone-100 text-stone-500"
      }`}>
        {option.prefix}
      </span>
      <span className={`text-sm leading-relaxed ${selected ? "text-navy font-medium" : "text-stone-700"}`}>
        {option.label}
      </span>
    </motion.button>
  );
}
