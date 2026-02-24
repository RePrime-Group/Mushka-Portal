import { motion } from "motion/react";
import { useAppStore } from "../../store/useAppStore";
import { getIdentityTitle } from "../../data/curriculum";

export default function LevelBadge() {
  const xp = useAppStore((s) => s.xp);
  const title = getIdentityTitle(xp);

  return (
    <motion.div
      key={title}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 rounded-lg"
    >
      <span className="text-gold text-sm">{"\u{1F451}"}</span>
      <span className="text-sm font-semibold text-gold">{title}</span>
    </motion.div>
  );
}
