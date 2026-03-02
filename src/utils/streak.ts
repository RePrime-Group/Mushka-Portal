import type { StreakData } from "../store/types";

export function isShabbos(date: Date): boolean {
  return date.getDay() === 6;
}

export function shouldCountForStreak(date: Date): boolean {
  return !isShabbos(date);
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function countNonShabbatDays(from: Date, to: Date): number {
  let count = 0;
  const current = new Date(from);
  current.setDate(current.getDate() + 1);
  while (current <= to) {
    if (!isShabbos(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

export function updateStreak(streak: StreakData): StreakData {
  const today = new Date();
  const todayStr = formatDate(today);

  if (!shouldCountForStreak(today)) {
    return streak;
  }

  if (streak.lastActiveDate === todayStr) {
    return streak;
  }

  const currentMonth = today.getMonth() + 1;
  let graceDaysUsed = streak.graceDaysUsed;
  let graceDaysMonth = streak.graceDaysMonth;

  if (graceDaysMonth !== currentMonth) {
    graceDaysUsed = 0;
    graceDaysMonth = currentMonth;
  }

  if (!streak.lastActiveDate) {
    return {
      ...streak,
      currentStreak: 1,
      lastActiveDate: todayStr,
      graceDaysUsed,
      graceDaysMonth,
    };
  }

  const lastActive = parseDate(streak.lastActiveDate);
  const missedNonShabbatDays = countNonShabbatDays(lastActive, today);

  if (missedNonShabbatDays <= 1) {
    return {
      ...streak,
      currentStreak: streak.currentStreak + 1,
      lastActiveDate: todayStr,
      graceDaysUsed,
      graceDaysMonth,
    };
  }

  const graceDaysAvailable = 2 - graceDaysUsed;
  const missedBeyondOne = missedNonShabbatDays - 1;

  if (missedBeyondOne <= graceDaysAvailable) {
    return {
      ...streak,
      currentStreak: streak.currentStreak + 1,
      lastActiveDate: todayStr,
      graceDaysUsed: graceDaysUsed + missedBeyondOne,
      graceDaysMonth,
    };
  }

  return {
    ...streak,
    currentStreak: 1,
    lastActiveDate: todayStr,
    graceDaysUsed,
    graceDaysMonth,
  };
}

export function getStreakBrokenMessage(totalTasks: number): string {
  return `Your knowledge doesn't reset when your streak does. Welcome back — you've completed ${totalTasks} task${totalTasks !== 1 ? "s" : ""} total.`;
}
