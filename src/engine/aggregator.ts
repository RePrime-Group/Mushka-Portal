import type { InstrumentScore, DomainScores } from '../store/types';

/**
 * Domain Aggregation — three composite scores that configure the curriculum.
 *
 * Challenge Level = NGSE (50%) + MSLQ-SE (50%) weighted average of percentiles
 * Structure Need = MSLQ Meta (70%) + Grit (30%) weighted avg of percentiles, INVERTED (100 - result)
 * Starting Point = AI Knowledge (60%) + Tech Comfort (40%) — raw scores normalized to 0-100
 */
export function computeDomainScores(scores: Record<string, InstrumentScore>): DomainScores {
  // Challenge Level
  const ngsePercentile = scores.ngse?.percentile ?? 50;
  const mslqPercentile = scores.mslq_se?.percentile ?? 50;
  const challengeLevel = Math.round((ngsePercentile * 0.5) + (mslqPercentile * 0.5));

  // Structure Need (inverted — high metacognition = LOW structure need)
  const metaPercentile = scores.metacognition?.percentile ?? 50;
  const gritPercentile = scores.grit?.percentile ?? 50;
  const structureNeed = Math.round(100 - ((metaPercentile * 0.7) + (gritPercentile * 0.3)));

  // Starting Point (normalized raw scores)
  const aiRaw = scores.ai_knowledge?.raw ?? 0;
  const aiNormalized = (aiRaw / 5) * 100;
  const techMean = scores.tech_comfort?.mean ?? 3;
  const techNormalized = ((techMean - 1) / 5) * 100; // 1-6 scale → 0-100
  const startingPoint = Math.round((aiNormalized * 0.6) + (techNormalized * 0.4));

  return { challengeLevel, structureNeed, startingPoint };
}
