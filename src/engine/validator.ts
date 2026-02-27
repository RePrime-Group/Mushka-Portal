import type { ItemResponse, ValidityResult } from '../store/types';
import { CONSISTENCY_PAIRS } from '../data/scoringKeys';

export function runValidityChecks(responses: ItemResponse[]): ValidityResult {
  const responseMap = new Map(responses.map(r => [r.itemId, r]));

  // --- Consistency Pairs ---
  let consistencyFlags = 0;
  const consistencyDetails: string[] = [];

  for (const pair of CONSISTENCY_PAIRS) {
    const a = responseMap.get(pair.itemA);
    const b = responseMap.get(pair.itemB);
    if (!a || !b) continue;

    let valA = a.value as number;
    let valB = b.value as number;

    // Normalize cross-scale pairs (5-pt vs 7-pt) to same range
    if (pair.scaleType === 'cross') {
      // Normalize both to 0-1 range then compare
      // Assume itemA is 5-point, itemB is 7-point
      valA = (valA - 1) / 4; // 0-1
      valB = (valB - 1) / 6; // 0-1
      const diff = Math.abs(valA - valB);
      if (diff > 0.5) { // equivalent to 2 points on 5-pt scale
        consistencyFlags++;
        consistencyDetails.push(`${pair.description}: normalized diff ${diff.toFixed(2)}`);
      }
    } else {
      const diff = Math.abs(valA - valB);
      if (diff > pair.threshold) {
        consistencyFlags++;
        consistencyDetails.push(`${pair.description}: diff ${diff}`);
      }
    }
  }

  // --- Infrequency Items ---
  let infrequencyFlags = 0;
  const infrequencyDetails: string[] = [];
  const infItems = responses.filter(r => r.instrumentId === 'infrequency');
  for (const r of infItems) {
    if (r.value === 5) {
      infrequencyFlags++;
      infrequencyDetails.push(`${r.itemId}: Strongly Agree on infrequency item`);
    }
  }

  // --- Response Time ---
  let fastResponseFlags = 0;
  const fastResponseDetails: string[] = [];
  const responseTimes = responses.map(r => r.responseTimeMs);

  for (const r of responses) {
    if (r.responseTimeMs < 1500) {
      fastResponseFlags++;
      fastResponseDetails.push(`${r.itemId}: ${r.responseTimeMs}ms (< 1.5s)`);
    }
  }

  // Median and SD
  const sorted = [...responseTimes].sort((a, b) => a - b);
  const medianResponseTime = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];

  const mean = responseTimes.reduce((s, t) => s + t, 0) / responseTimes.length;
  const responseTimeSD = Math.sqrt(
    responseTimes.reduce((s, t) => s + (t - mean) ** 2, 0) / responseTimes.length
  );

  // Engagement index based on response time SD
  let engagementIndex: 'high' | 'moderate' | 'low' = 'moderate';
  if (responseTimeSD < 1000) engagementIndex = 'low'; // mechanical clicking
  if (responseTimeSD > 3000) engagementIndex = 'high'; // thoughtful variation

  // --- Overall Validity ---
  let status: 'green' | 'yellow' | 'red' = 'green';

  if (consistencyFlags >= 4 || infrequencyFlags >= 2 || fastResponseFlags >= 5) {
    status = 'red';
  } else if (consistencyFlags >= 2 || infrequencyFlags >= 1 || fastResponseFlags >= 3) {
    status = 'yellow';
  }

  return {
    status,
    consistencyFlags,
    consistencyDetails,
    infrequencyFlags,
    infrequencyDetails,
    fastResponseFlags,
    fastResponseDetails,
    medianResponseTime: Math.round(medianResponseTime),
    responseTimeSD: Math.round(responseTimeSD),
    engagementIndex,
  };
}
