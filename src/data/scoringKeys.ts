// Correct answers for AI Knowledge items
export const AI_CORRECT_ANSWERS: Record<string, string> = {
  ai_1: 'C',
  ai_2: 'B',
  ai_3: 'B',
  ai_4: 'B',
  ai_5: 'C',
};

// Reverse-scored item IDs
export const REVERSE_SCORED_ITEMS: string[] = [
  'grit_1', 'grit_3', 'grit_5', 'grit_6',
];

// Grit subscale assignments
export const GRIT_SUBSCALES: Record<string, 'consistency' | 'perseverance'> = {
  grit_1: 'consistency',
  grit_3: 'consistency',
  grit_5: 'consistency',
  grit_6: 'consistency',
  grit_2: 'perseverance',
  grit_4: 'perseverance',
  grit_7: 'perseverance',
  grit_8: 'perseverance',
};

// Consistency pair definitions for validity checking
export const CONSISTENCY_PAIRS = [
  { itemA: 'ngse_1', itemB: 'ngse_5', threshold: 2, scaleType: '5pt' as const, description: 'Self-efficacy for goals' },
  { itemA: 'ngse_6', itemB: 'mslq_20', threshold: 2, scaleType: 'cross' as const, description: 'General vs domain performance' },
  { itemA: 'grit_4', itemB: 'grit_8', threshold: 2, scaleType: '5pt' as const, description: 'Effort/work ethic' },
  { itemA: 'grit_1', itemB: 'grit_5', threshold: 2, scaleType: '5pt' as const, description: 'Interest consistency (both reversed)' },
  { itemA: 'meta_76', itemB: 'meta_55', threshold: 2, scaleType: '7pt' as const, description: 'Monitoring behavior' },
  { itemA: 'mslq_6', itemB: 'mslq_15', threshold: 2, scaleType: '7pt' as const, description: 'Understanding difficulty' },
];
