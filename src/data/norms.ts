// Published means and SDs for percentile estimation via jstat normal CDF
export const NORMS: Record<string, { mean: number; sd: number; source: string }> = {
  ngse: { mean: 3.87, sd: 0.54, source: 'Chen et al. 2001, Study 2, N=323' },
  mslq_se: { mean: 5.47, sd: 1.14, source: 'Pintrich et al. 1991, N=380' },
  grit: { mean: 3.4, sd: 0.7, source: 'Duckworth & Quinn 2009, Study 2, N=1554' },
  metacognition: { mean: 4.54, sd: 0.90, source: 'Pintrich et al. 1991, N=380 (full 12-item)' },
  // AI Knowledge and Tech Comfort have no published norms — criterion-referenced only
};

// AI Knowledge level thresholds
export const AI_KNOWLEDGE_LEVELS = {
  beginner: { min: 0, max: 1 },
  basic: { min: 2, max: 3 },
  experienced: { min: 4, max: 5 },
};

// Tech Comfort level thresholds
export const TECH_COMFORT_LEVELS = {
  low: { min: 1.0, max: 3.0 },
  moderate: { min: 3.1, max: 4.5 },
  high: { min: 4.6, max: 6.0 },
};
