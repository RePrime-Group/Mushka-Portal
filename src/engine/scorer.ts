import jStat from 'jstat';
import type { ItemResponse, InstrumentScore } from '../store/types';
import { NORMS, AI_KNOWLEDGE_LEVELS, TECH_COMFORT_LEVELS } from '../data/norms';
import { AI_CORRECT_ANSWERS, REVERSE_SCORED_ITEMS, GRIT_SUBSCALES } from '../data/scoringKeys';

/**
 * Step 1: Reverse-score an item value.
 * 5-point scale: reversed = 6 - raw
 * 7-point scale: reversed = 8 - raw
 */
function reverseScore(value: number, scaleMax: number): number {
  return (scaleMax + 1) - value;
}

/**
 * Step 2: Compute domain average (mean of items after reversing)
 */
function computeMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Step 3: Estimate percentile using normal CDF
 */
function computePercentile(observedMean: number, publishedMean: number, publishedSD: number): number {
  return jStat.normal.cdf(observedMean, publishedMean, publishedSD) * 100;
}

/**
 * Get processed value for an item (reverse-scored if needed)
 */
function getProcessedValue(response: ItemResponse): number {
  const raw = response.value as number;
  if (REVERSE_SCORED_ITEMS.includes(response.itemId)) {
    // All reverse-scored items in this battery are 5-point Likert
    return reverseScore(raw, 5);
  }
  return raw;
}

/**
 * Main scoring function — takes all responses, returns all instrument scores
 */
export function computeAllScores(responses: ItemResponse[]): Record<string, InstrumentScore> {
  const scores: Record<string, InstrumentScore> = {};

  // --- NGSE (8 items, 5-point, no reversals) ---
  const ngseResponses = responses.filter(r => r.instrumentId === 'ngse');
  const ngseValues = ngseResponses.map(r => getProcessedValue(r));
  const ngseMean = computeMean(ngseValues);
  scores.ngse = {
    instrumentId: 'ngse',
    mean: Math.round(ngseMean * 100) / 100,
    percentile: Math.round(computePercentile(ngseMean, NORMS.ngse.mean, NORMS.ngse.sd) * 10) / 10,
  };

  // --- MSLQ Self-Efficacy (8 items, 7-point, no reversals) ---
  const mslqResponses = responses.filter(r => r.instrumentId === 'mslq_se');
  const mslqValues = mslqResponses.map(r => r.value as number);
  const mslqMean = computeMean(mslqValues);
  scores.mslq_se = {
    instrumentId: 'mslq_se',
    mean: Math.round(mslqMean * 100) / 100,
    percentile: Math.round(computePercentile(mslqMean, NORMS.mslq_se.mean, NORMS.mslq_se.sd) * 10) / 10,
  };

  // --- Grit-S (8 items, 5-point, items 1,3,5,6 reversed) ---
  const gritResponses = responses.filter(r => r.instrumentId === 'grit');
  const gritValues = gritResponses.map(r => getProcessedValue(r));
  const gritMean = computeMean(gritValues);

  // Subscales
  const consistencyValues = gritResponses
    .filter(r => GRIT_SUBSCALES[r.itemId] === 'consistency')
    .map(r => getProcessedValue(r));
  const perseveranceValues = gritResponses
    .filter(r => GRIT_SUBSCALES[r.itemId] === 'perseverance')
    .map(r => getProcessedValue(r));

  scores.grit = {
    instrumentId: 'grit',
    mean: Math.round(gritMean * 100) / 100,
    percentile: Math.round(computePercentile(gritMean, NORMS.grit.mean, NORMS.grit.sd) * 10) / 10,
    subscales: {
      consistency: Math.round(computeMean(consistencyValues) * 100) / 100,
      perseverance: Math.round(computeMean(perseveranceValues) * 100) / 100,
    },
  };

  // --- Metacognition (6 items, 7-point, no reversals) ---
  const metaResponses = responses.filter(r => r.instrumentId === 'metacognition');
  const metaValues = metaResponses.map(r => r.value as number);
  const metaMean = computeMean(metaValues);
  scores.metacognition = {
    instrumentId: 'metacognition',
    mean: Math.round(metaMean * 100) / 100,
    percentile: Math.round(computePercentile(metaMean, NORMS.metacognition.mean, NORMS.metacognition.sd) * 10) / 10,
  };

  // --- AI Knowledge (5 items, sum correct, criterion-referenced) ---
  const aiResponses = responses.filter(r => r.instrumentId === 'ai_knowledge');
  const aiCorrect = aiResponses.filter(r => r.value === AI_CORRECT_ANSWERS[r.itemId]).length;
  let aiLevel = 'beginner';
  if (aiCorrect >= AI_KNOWLEDGE_LEVELS.experienced.min) aiLevel = 'experienced';
  else if (aiCorrect >= AI_KNOWLEDGE_LEVELS.basic.min) aiLevel = 'basic';

  scores.ai_knowledge = {
    instrumentId: 'ai_knowledge',
    mean: aiCorrect, // raw score, not mean
    raw: aiCorrect,
    level: aiLevel,
  };

  // --- Tech Comfort (3 items, 6-point, no reversals) ---
  const techResponses = responses.filter(r => r.instrumentId === 'tech_comfort');
  const techValues = techResponses.map(r => r.value as number);
  const techMean = computeMean(techValues);
  let techLevel = 'low';
  if (techMean >= TECH_COMFORT_LEVELS.high.min) techLevel = 'high';
  else if (techMean >= TECH_COMFORT_LEVELS.moderate.min) techLevel = 'moderate';

  scores.tech_comfort = {
    instrumentId: 'tech_comfort',
    mean: Math.round(techMean * 100) / 100,
    level: techLevel,
  };

  return scores;
}
