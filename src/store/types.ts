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
  assessmentState: AssessmentState;
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
  // Identity Engine actions
  startAssessment: () => void;
  recordResponse: (response: ItemResponse) => void;
  setAssessmentScores: (scores: Record<string, InstrumentScore>, domainScores: DomainScores, validity: ValidityResult) => void;
  setPlaybook: (playbook: PlaybookSection[]) => void;
  setPlaybookLoading: (loading: boolean) => void;
  setPlaybookError: (error: string | null) => void;
  markAssessmentEmailsSent: () => void;
  getAdaptiveConfig: () => AdaptiveConfig | null;
}

// ============================================
// IDENTITY ENGINE TYPES
// ============================================

export type LikertScale5 = 1 | 2 | 3 | 4 | 5;
export type LikertScale6 = 1 | 2 | 3 | 4 | 5 | 6;
export type LikertScale7 = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type KnowledgeAnswer = 'A' | 'B' | 'C' | 'D';

export type InstrumentId = 'ngse' | 'mslq_se' | 'grit' | 'metacognition' | 'ai_knowledge' | 'tech_comfort' | 'infrequency';

export interface AssessmentItem {
  id: string;
  instrumentId: InstrumentId;
  itemNumber: number;
  text: string;
  type: 'likert5' | 'likert6' | 'likert7' | 'knowledge';
  options: AssessmentOption[];
  reverseScored: boolean;
  subscale?: string;
  correctAnswer?: string;
  isInfrequency: boolean;
  flagIf?: number;
}

export interface AssessmentOption {
  value: number | string;
  label: string;
  prefix?: string;
}

export interface ItemResponse {
  itemId: string;
  instrumentId: InstrumentId;
  value: number | string;
  responseTimeMs: number;
  timestamp: string;
  rotationIndex: number;
}

export interface InstrumentScore {
  instrumentId: InstrumentId;
  mean: number;
  percentile?: number;
  subscales?: Record<string, number>;
  level?: string;
  raw?: number;
}

export interface ValidityResult {
  status: 'green' | 'yellow' | 'red';
  consistencyFlags: number;
  consistencyDetails: string[];
  infrequencyFlags: number;
  infrequencyDetails: string[];
  fastResponseFlags: number;
  fastResponseDetails: string[];
  medianResponseTime: number;
  responseTimeSD: number;
  engagementIndex: string;
}

export interface DomainScores {
  challengeLevel: number;
  structureNeed: number;
  startingPoint: number;
}

export interface PlaybookSection {
  title: string;
  content: string;
}

export interface AssessmentState {
  started: boolean;
  completed: boolean;
  currentItemIndex: number;
  responses: ItemResponse[];
  scores: Record<string, InstrumentScore>;
  domainScores: DomainScores | null;
  validity: ValidityResult | null;
  playbook: PlaybookSection[] | null;
  playbookLoading: boolean;
  playbookError: string | null;
  emailsSent: boolean;
}

export interface AdaptiveConfig {
  showTemplates: boolean;
  showExtensionQuestions: boolean;
  scaffoldingLevel: 'maximum' | 'standard' | 'minimal';
  checkInFrequency: 'frequent' | 'standard' | 'minimal';
  progressIndicatorDensity: 'high' | 'standard';
  milestoneSpacing: 'short' | 'standard';
  skipBasicOrientation: boolean;
  compressStage1: boolean;
  technicalVocabulary: 'full' | 'standard' | 'simplified';
  domainInsecurity: boolean;
}
