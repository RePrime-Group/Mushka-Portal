export interface TaskProgress {
  taskId: string;
  completed: boolean;
  completedAt?: string;
  reflection?: string;
  aiFeedback?: string;
}

export interface StageProgress {
  stageId: number;
  tasks: Record<string, TaskProgress>;
  completed: boolean;
  completedAt?: string;
  reflectionSubmitted: boolean;
}

export interface StreakData {
  currentStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  graceDaysUsed: number; // max 2 per month
  graceDaysMonth: number; // which month (1-12) the grace counter is for
  totalTasksCompleted: number;
}

export interface AppState {
  isLoggedIn: boolean;
  email: string;
  stages: Record<number, StageProgress>;
  xp: number;
  streak: StreakData;
  currentStage: number;
  celebrationQueue: string[];
  programStartEmailSent: boolean;
}

export interface AppActions {
  login: (email: string) => void;
  logout: () => void;
  completeTask: (stageId: number, taskId: string) => void;
  submitReflection: (stageId: number, reflection: string, feedback: string) => void;
  updateStreak: () => void;
  queueCelebration: (messageId: string) => void;
  dismissCelebration: () => void;
  setCurrentStage: (stageId: number) => void;
  markProgramStartEmailSent: () => void;
}
