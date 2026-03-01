import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppStore } from "../../store/useAppStore";
import { stages } from "../../data/curriculum";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const LG_MQL =
  typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)") : null;

export default function Sidebar({ open, onClose }: SidebarProps) {
  const currentStage = useAppStore((s) => s.currentStage);
  const stageProgress = useAppStore((s) => s.stages);
  const setCurrentStage = useAppStore((s) => s.setCurrentStage);
  const logout = useAppStore((s) => s.logout);
  const resetProgress = useAppStore((s) => s.resetProgress);

  const [showResetModal, setShowResetModal] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!showResetModal) {
      setCountdown(5);
      return;
    }
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [showResetModal, countdown]);

  function handleReset() {
    resetProgress();
    setShowResetModal(false);
    onClose();
  }

  // Track whether the lg breakpoint is active so Framer Motion's inline
  // transform doesn't fight with Tailwind's lg:translate-x-0 / lg:static.
  const [isDesktop, setIsDesktop] = useState(LG_MQL?.matches ?? false);
  useEffect(() => {
    if (!LG_MQL) return;
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    LG_MQL.addEventListener("change", handler);
    return () => LG_MQL.removeEventListener("change", handler);
  }, []);

  function handleStageClick(stageId: number) {
    setCurrentStage(stageId);
    onClose();
  }

  function handleDashboard() {
    setCurrentStage(0);
    onClose();
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden cursor-pointer" onClick={onClose} />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isDesktop ? 0 : open ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 bottom-0 w-[280px] bg-navy z-50 flex flex-col lg:translate-x-0 lg:static lg:z-auto"
        style={{ paddingTop: "var(--safe-top)" }}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center">
              <span className="text-gold font-bold">M</span>
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">Mushka AI Portal</h2>
              <p className="text-white/40 text-xs">RePrime Group</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button
            onClick={handleDashboard}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all min-h-11 cursor-pointer ${
              currentStage === 0
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="text-lg">{"\u{1F3E0}"}</span>
            <span className="text-sm font-medium">Dashboard</span>
          </button>

          <div className="pt-3 pb-1 px-4">
            <span className="text-[11px] uppercase tracking-wider text-white/30 font-medium">
              Stages
            </span>
          </div>

          {stages.map((stage) => {
            const progress = stageProgress[stage.id];
            const completedTasks = progress
              ? Object.values(progress.tasks).filter((t) => t.completed).length
              : 0;
            const isComplete = progress?.completed;
            const isActive = currentStage === stage.id;

            return (
              <button
                key={stage.id}
                onClick={() => handleStageClick(stage.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all min-h-11 cursor-pointer ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{
                  backgroundColor: isComplete ? "rgba(212,168,67,0.2)" : "rgba(255,255,255,0.1)",
                  color: isComplete ? "#d4a843" : "rgba(255,255,255,0.6)",
                }}>
                  {isComplete ? "\u{2713}" : stage.id}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{stage.title}</p>
                  <p className="text-[11px] text-white/40">{completedTasks}/5 tasks</p>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1">
          <button
            onClick={() => setShowResetModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-red-400 hover:bg-white/5 transition-all min-h-11 cursor-pointer"
          >
            <span className="text-lg">↩</span>
            <span className="text-sm">Reset Progress</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-white/60 hover:bg-white/5 transition-all min-h-11 cursor-pointer"
          >
            <span className="text-lg">{"\u{1F6AA}"}</span>
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center px-4 bg-black/60"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            >
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>

              <h2 className="text-center font-bold text-navy text-lg mb-2">Reset All Progress?</h2>
              <p className="text-center text-sm text-stone-600 leading-relaxed mb-6">
                This will permanently erase your assessment results, playbook, stage completions, and XP.
                This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-navy hover:bg-stone-50 transition-colors min-h-11 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  disabled={countdown > 0}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold transition-all min-h-11 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600"
                >
                  {countdown > 0 ? `Reset (${countdown})` : "Reset Everything"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
