import XPBar from "../gamification/XPBar";
import StreakCounter from "../gamification/StreakCounter";
import LevelBadge from "../gamification/LevelBadge";

export default function Header() {
  return (
    <header className="bg-white border-b border-stone-200 px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <LevelBadge />
        </div>
        <StreakCounter />
      </div>
      <XPBar />
    </header>
  );
}
