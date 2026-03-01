import { useState, useEffect } from "react";
import { motion } from "motion/react";
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
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all min-h-[44px] cursor-pointer ${
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all min-h-[44px] cursor-pointer ${
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

        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-white/60 hover:bg-white/5 transition-all min-h-[44px] cursor-pointer"
          >
            <span className="text-lg">{"\u{1F6AA}"}</span>
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
