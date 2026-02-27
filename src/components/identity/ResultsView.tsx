import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { useAppStore } from "../../store/useAppStore";
import RadarProfile from "./RadarProfile";
import PlaybookSection from "./PlaybookSection";

interface ResultsViewProps {
  onBackToDashboard: () => void;
}

export default function ResultsView({ onBackToDashboard }: ResultsViewProps) {
  const scores = useAppStore((s) => s.assessmentState.scores);
  const playbook = useAppStore((s) => s.assessmentState.playbook);
  const playbookLoading = useAppStore((s) => s.assessmentState.playbookLoading);
  const playbookError = useAppStore((s) => s.assessmentState.playbookError);
  const confettiFired = useRef(false);

  useEffect(() => {
    if (!confettiFired.current) {
      confettiFired.current = true;
      const duration = 1000;
      const end = Date.now() + duration;
      function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ["#BC9C45", "#0E3470", "#e8c96a"],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ["#BC9C45", "#0E3470", "#e8c96a"],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      }
      frame();
    }
  }, []);

  // Find "My Profile" section for narrative summary
  const profileSection = playbook?.find((s) => s.title === "My Profile");
  const otherSections = playbook?.filter((s) => s.title !== "My Profile") || [];

  return (
    <div className="min-h-dvh bg-cream app-shell">
      <div className="max-w-lg mx-auto px-4 py-6 sm:px-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-navy mb-2">Your Operating Profile</h1>
          <p className="text-sm text-warm-gray">
            A personalized map of how you think, learn, and work
          </p>
        </motion.div>

        {/* Radar Chart */}
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

        {/* Full Playbook */}
        {playbookLoading && (
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
            <p className="text-sm text-red-600">
              We couldn't generate your playbook right now. Your assessment data has been saved —
              you can view your playbook when the connection is restored.
            </p>
          </div>
        )}

        {otherSections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5"
          >
            <h2 className="font-semibold text-navy text-lg mb-4">Personal Operating Playbook</h2>
            {otherSections.map((section, i) => (
              <PlaybookSection key={section.title} section={section} defaultOpen={true} />
            ))}
          </motion.div>
        )}

        {/* Back to Dashboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="pb-8"
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
