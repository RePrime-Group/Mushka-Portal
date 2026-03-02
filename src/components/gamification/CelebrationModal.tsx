import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppStore } from "../../store/useAppStore";
import { celebrationMessages, getIdentityTitle } from "../../data/curriculum";
import { largeBurst, goldConfetti } from "./ConfettiTrigger";

export default function CelebrationModal() {
  const celebrationQueue = useAppStore((s) => s.celebrationQueue);
  const dismissCelebration = useAppStore((s) => s.dismissCelebration);
  const xp = useAppStore((s) => s.xp);

  const currentCelebration = celebrationQueue[0] || null;

  useEffect(() => {
    if (!currentCelebration) return;

    if (currentCelebration === "title-change") {
      goldConfetti();
    } else if (currentCelebration.startsWith("stage-")) {
      largeBurst();
    } else {
      largeBurst();
    }
  }, [currentCelebration]);

  if (!currentCelebration) return null;

  const isTitleChange = currentCelebration === "title-change";
  const message = isTitleChange
    ? `You've reached a new level: ${getIdentityTitle(xp)}`
    : celebrationMessages[currentCelebration] || "";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-navy/80 backdrop-blur-sm" onClick={dismissCelebration} />
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center"
        >
          <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">{isTitleChange ? "\u{1F451}" : "\u{2B50}"}</span>
          </div>

          {isTitleChange && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="mb-4"
            >
              <span className="text-3xl font-bold text-gold">{getIdentityTitle(xp)}</span>
            </motion.div>
          )}

          <p className="text-navy text-lg leading-relaxed mb-8">{message}</p>

          <button
            onClick={dismissCelebration}
            className="px-8 py-3 bg-navy text-white rounded-xl font-medium hover:bg-navy-light active:scale-[0.98] transition-all min-h-11 cursor-pointer"
          >
            Continue
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
