import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { useAppStore } from "../../store/useAppStore";
import RadarProfile from "./RadarProfile";
import PlaybookSection from "./PlaybookSection";

interface ResultsViewProps {
  onBackToDashboard: () => void;
  onRetryPlaybook?: () => void;
}

export default function ResultsView({ onBackToDashboard, onRetryPlaybook }: ResultsViewProps) {
  const scores = useAppStore((s) => s.assessmentState.scores);
  const playbook = useAppStore((s) => s.assessmentState.playbook);
  const playbookLoading = useAppStore((s) => s.assessmentState.playbookLoading);
  const playbookError = useAppStore((s) => s.assessmentState.playbookError);
  const confettiFired = useRef(false);

  useEffect(() => {
    if (!confettiFired.current) {
      confettiFired.current = true;
      // Spec: 1 second duration, 150 particles total, gold + navy
      confetti({
        particleCount: 75,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ["#BC9C45", "#0E3470", "#e8c96a"],
        ticks: 200,
      });
      confetti({
        particleCount: 75,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ["#BC9C45", "#0E3470", "#e8c96a"],
        ticks: 200,
      });
    }
  }, []);

  // Find "My Profile" section for narrative summary
  const profileSection = playbook?.find((s) => s.title === "My Profile");
  const otherSections = playbook?.filter((s) => s.title !== "My Profile") || [];

  return (
    <div className="min-h-dvh bg-cream app-shell">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 md:px-8 md:py-10 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-navy mb-2">Your Operating Profile</h1>
          <p className="text-sm md:text-base text-warm-gray">
            A personalized map of how you think, learn, and work
          </p>
        </motion.div>

        {/* Radar Chart + Profile — side by side on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4"
          >
            <RadarProfile scores={scores} />
          </motion.div>

          {/* My Profile narrative */}
          {profileSection && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5"
            >
              <h2 className="font-semibold text-navy text-lg mb-3">My Profile</h2>
              <div className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
                {profileSection.content.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                  i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                )}
              </div>
            </motion.div>
          )}

          {/* Placeholder column if no profile section yet */}
          {!profileSection && playbookLoading && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 text-center">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <p className="text-sm text-warm-gray">Generating your Personal Operating Playbook...</p>
              </motion.div>
            </div>
          )}
        </div>

        {/* Playbook loading — below the grid if profile section already rendered */}
        {profileSection && playbookLoading && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 text-center">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <p className="text-sm text-warm-gray">Generating your Personal Operating Playbook...</p>
            </motion.div>
          </div>
        )}

        {playbookError && (
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-5">
            <p className="text-sm text-red-600 mb-4">{playbookError}</p>
            {onRetryPlaybook && (
              <button
                onClick={onRetryPlaybook}
                className="text-sm font-semibold text-navy border-2 border-navy rounded-xl px-5 py-2.5 min-h-11 hover:bg-navy hover:text-white transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {otherSections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 md:p-6"
          >
            <h2 className="font-semibold text-navy text-lg md:text-xl mb-4">Personal Operating Playbook</h2>
            {otherSections.map((section) => (
              <PlaybookSection key={section.title} section={section} defaultOpen={true} />
            ))}
          </motion.div>
        )}

        {/* Back to Dashboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="pb-8 max-w-md mx-auto"
        >
          <button
            onClick={onBackToDashboard}
            className="ie-gold-btn min-h-[52px]"
          >
            Continue to Training
          </button>
        </motion.div>
      </div>
    </div>
  );
}
