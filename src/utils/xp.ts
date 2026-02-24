import { TOTAL_XP, getIdentityTitle, identityTitles } from "../data/curriculum";

export function getXPProgress(xp: number): number {
  return Math.min(xp / TOTAL_XP, 1);
}

export function getNextMilestone(xp: number): { title: string; xpNeeded: number } | null {
  for (const level of identityTitles) {
    if (xp < level.threshold) {
      return { title: level.title, xpNeeded: level.threshold - xp };
    }
  }
  return null;
}

export function didTitleChange(oldXP: number, newXP: number): boolean {
  return getIdentityTitle(oldXP) !== getIdentityTitle(newXP);
}
