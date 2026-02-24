import { useAppStore } from "../../store/useAppStore";

export default function StreakCounter() {
  const streak = useAppStore((s) => s.streak);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-lg">
        <span className="text-orange-500 text-sm">
          {streak.currentStreak > 0 ? "\u{1F525}" : "\u{2728}"}
        </span>
        <span className="text-sm font-semibold text-orange-700">
          {streak.currentStreak} day{streak.currentStreak !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
