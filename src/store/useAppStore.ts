import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppState, AppActions, StageProgress, TaskProgress, ItemResponse, InstrumentScore, DomainScores, ValidityResult, PlaybookSection, AssessmentState, AdaptiveConfig } from "./types";
import { stages, getTaskXP, celebrationMessages } from "../data/curriculum";
import { updateStreak } from "../utils/streak";
import { didTitleChange } from "../utils/xp";
import { triggerEmail } from "../utils/email";

const initialAssessmentState: AssessmentState = {
  started: false,
  completed: false,
  currentItemIndex: 0,
  responses: [],
  scores: {},
  domainScores: null,
  validity: null,
  playbook: null,
  playbookLoading: false,
  playbookError: null,
  emailsSent: false,
};

function createInitialStages(): Record<number, StageProgress> {
  const result: Record<number, StageProgress> = {};
  for (const stage of stages) {
    const tasks: Record<string, TaskProgress> = {};
    for (const task of stage.tasks) {
      tasks[task.id] = {
        taskId: task.id,
        completed: false,
      };
    }
    result[stage.id] = {
      stageId: stage.id,
      tasks,
      completed: false,
      reflectionSubmitted: false,
    };
  }
  return result;
}

function countCompletedTasks(stages: Record<number, StageProgress>): number {
  let count = 0;
  for (const stage of Object.values(stages)) {
    for (const task of Object.values(stage.tasks)) {
      if (task.completed) count++;
    }
  }
  return count;
}

function isStageComplete(stage: StageProgress): boolean {
  return Object.values(stage.tasks).every((t) => t.completed);
}

function countStageCompletedTasks(stage: StageProgress): number {
  return Object.values(stage.tasks).filter((t) => t.completed).length;
}

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      email: "",
      stages: createInitialStages(),
      xp: 0,
      streak: {
        currentStreak: 0,
        lastActiveDate: "",
        graceDaysUsed: 0,
        graceDaysMonth: 0,
        totalTasksCompleted: 0,
      },
      currentStage: 1,
      celebrationQueue: [],
      programStartEmailSent: false,
      assessmentState: initialAssessmentState,

      login: (email: string) => {
        const state = get();
        set({ isLoggedIn: true, email });
        if (!state.programStartEmailSent) {
          triggerEmail({ trigger: "program-start" });
          set({ programStartEmailSent: true });
        }
      },

      logout: () => set({ isLoggedIn: false, email: "" }),

      completeTask: (stageId: number, taskId: string) => {
        const state = get();
        const stage = state.stages[stageId];
        if (!stage || stage.tasks[taskId]?.completed) return;

        const taskXP = getTaskXP(taskId);
        const oldXP = state.xp;
        const newXP = oldXP + taskXP;

        const updatedTask: TaskProgress = {
          ...stage.tasks[taskId],
          completed: true,
          completedAt: new Date().toISOString(),
        };

        const updatedTasks = { ...stage.tasks, [taskId]: updatedTask };
        const updatedStage: StageProgress = { ...stage, tasks: updatedTasks };

        const stageNowComplete = isStageComplete(updatedStage);
        if (stageNowComplete) {
          updatedStage.completed = true;
          updatedStage.completedAt = new Date().toISOString();
        }

        const updatedStages = { ...state.stages, [stageId]: updatedStage };
        const totalCompleted = countCompletedTasks(updatedStages);

        const newStreak = updateStreak({
          ...state.streak,
          totalTasksCompleted: totalCompleted,
        });

        // Build celebration queue
        const celebrations: string[] = [];

        // Check task-specific celebrations
        const taskCelebKey = `task-${taskId}`;
        if (celebrationMessages[taskCelebKey]) {
          celebrations.push(taskCelebKey);
        }

        // Check stage completion celebrations
        if (stageNowComplete) {
          const stageCelebKey = `stage-${stageId}`;
          if (celebrationMessages[stageCelebKey]) {
            celebrations.push(stageCelebKey);
          }
        }

        // Check title change
        if (didTitleChange(oldXP, newXP)) {
          celebrations.push("title-change");
        }

        // Email triggers
        const completedInStage = countStageCompletedTasks(updatedStage);

        // Stage 1 halfway (task 3 of 5)
        if (stageId === 1 && completedInStage === 3) {
          triggerEmail({
            trigger: "stage-1-halfway",
            stageId: 1,
            tasksCompleted: completedInStage,
            currentStreak: newStreak.currentStreak,
          });
        }

        // Stage 1 complete
        if (stageId === 1 && stageNowComplete) {
          triggerEmail({
            trigger: "stage-1-complete",
            stageId: 1,
            tasksCompleted: 5,
            totalXP: newXP,
          });
        }

        // Stage 3 halfway (task 3 of 5)
        if (stageId === 3 && completedInStage === 3) {
          triggerEmail({
            trigger: "stage-3-halfway",
            stageId: 3,
            tasksCompleted: completedInStage,
            currentStreak: newStreak.currentStreak,
          });
        }

        // Stage 3 complete
        if (stageId === 3 && stageNowComplete) {
          triggerEmail({
            trigger: "stage-3-complete",
            stageId: 3,
            tasksCompleted: 5,
            totalXP: newXP,
          });
        }

        // All stages complete
        const allComplete = Object.values(updatedStages).every((s) => s.completed);
        if (allComplete) {
          triggerEmail({
            trigger: "all-complete",
            totalXP: newXP,
            tasksCompleted: totalCompleted,
          });
        }

        set({
          stages: updatedStages,
          xp: newXP,
          streak: newStreak,
          celebrationQueue: [...state.celebrationQueue, ...celebrations],
        });
      },

      submitReflection: (stageId: number, _reflection: string, _feedback: string) => {
        const state = get();
        const stage = state.stages[stageId];
        if (!stage) return;

        // Store reflection in the last task of the stage for reference
        const updatedStage: StageProgress = {
          ...stage,
          reflectionSubmitted: true,
        };

        set({
          stages: { ...state.stages, [stageId]: updatedStage },
        });
      },

      updateStreak: () => {
        const state = get();
        const totalCompleted = countCompletedTasks(state.stages);
        const newStreak = updateStreak({
          ...state.streak,
          totalTasksCompleted: totalCompleted,
        });
        set({ streak: newStreak });
      },

      queueCelebration: (messageId: string) => {
        const state = get();
        set({ celebrationQueue: [...state.celebrationQueue, messageId] });
      },

      dismissCelebration: () => {
        const state = get();
        set({ celebrationQueue: state.celebrationQueue.slice(1) });
      },

      setCurrentStage: (stageId: number) => set({ currentStage: stageId }),

      markProgramStartEmailSent: () => set({ programStartEmailSent: true }),

      // Identity Engine actions
      startAssessment: () => {
        set({
          assessmentState: {
            ...initialAssessmentState,
            started: true,
          },
        });
      },

      recordResponse: (response: ItemResponse) => {
        const state = get();
        const responses = [...state.assessmentState.responses, response];
        set({
          assessmentState: {
            ...state.assessmentState,
            responses,
            currentItemIndex: state.assessmentState.currentItemIndex + 1,
          },
        });
      },

      setAssessmentScores: (scores: Record<string, InstrumentScore>, domainScores: DomainScores, validity: ValidityResult) => {
        const state = get();
        set({
          assessmentState: {
            ...state.assessmentState,
            scores,
            domainScores,
            validity,
            completed: true,
          },
        });
      },

      setPlaybook: (playbook: PlaybookSection[]) => {
        const state = get();
        set({
          assessmentState: {
            ...state.assessmentState,
            playbook,
            playbookLoading: false,
            playbookError: null,
          },
        });
      },

      setPlaybookLoading: (loading: boolean) => {
        const state = get();
        set({
          assessmentState: {
            ...state.assessmentState,
            playbookLoading: loading,
          },
        });
      },

      setPlaybookError: (error: string | null) => {
        const state = get();
        set({
          assessmentState: {
            ...state.assessmentState,
            playbookError: error,
            playbookLoading: false,
          },
        });
      },

      markAssessmentEmailsSent: () => {
        const state = get();
        set({
          assessmentState: {
            ...state.assessmentState,
            emailsSent: true,
          },
        });
      },

      getAdaptiveConfig: (): AdaptiveConfig | null => {
        const { domainScores, scores } = get().assessmentState;
        if (!domainScores) return null;

        return {
          showTemplates: domainScores.challengeLevel < 50,
          showExtensionQuestions: domainScores.challengeLevel > 70,
          scaffoldingLevel: domainScores.challengeLevel < 30 ? 'maximum' : domainScores.challengeLevel < 60 ? 'standard' : 'minimal',
          checkInFrequency: domainScores.structureNeed > 70 ? 'frequent' : domainScores.structureNeed > 40 ? 'standard' : 'minimal',
          progressIndicatorDensity: domainScores.structureNeed > 60 ? 'high' : 'standard',
          milestoneSpacing: domainScores.structureNeed > 70 ? 'short' : 'standard',
          skipBasicOrientation: domainScores.startingPoint > 60,
          compressStage1: domainScores.startingPoint > 80,
          technicalVocabulary: scores.tech_comfort?.level === 'high' ? 'full' : scores.tech_comfort?.level === 'moderate' ? 'standard' : 'simplified',
          domainInsecurity: (scores.ngse?.percentile ?? 50) - (scores.mslq_se?.percentile ?? 50) > 25,
        };
      },
    }),
    {
      name: "mushka-portal-storage",
    }
  )
);
