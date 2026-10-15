export interface BrandValidationResult {
  isValid: boolean;
  score: number; // 0 - 100
  violations: Array<{
    type: 'prohibited_phrase' | 'unsupported_claim' | 'voice_deviation' | 'dosage_warning';
    severity: 'critical' | 'high' | 'moderate';
    matchedText: string;
    explanation: string;
    ruleTitle: string;
  }>;
  supportedClaims: Array<{
    claimText: string;
    citationRef: string;
    confidence: number;
  }>;
}

export const DEFAULT_PROHIBITED_PHRASES = [
  { phrase: 'miracle elixir', explanation: 'Sensationalist phrasing prohibited under AYUSH marketing guidelines Rule 170.' },
  { phrase: '100% cure', explanation: 'Absolute disease cure claims violate pharmaceutical advertising standards.' },
  { phrase: 'instant wrinkle removal', explanation: 'Clinically unverified temporal efficacy claim; use "gradual skin firming over 8 weeks".' },
  { phrase: 'guaranteed results', explanation: 'Absolute guarantees prohibited. Must reflect probabilistic clinical trial bounds.' },
  { phrase: 'zero side effects', explanation: 'Ayurvedic formulations may have individual contraindications (e.g. Pitta aggravations).' },
];

export const APPROVED_CLAIMS_REGISTRY = [
  {
    citationRef: 'KB-REF-01',
    keywords: ['bakuchiol', 'retinol', 'non-inferior', 'fine lines', 'anti-aging'],
    statement: '1% Bakuchiol demonstrates clinically non-inferior wrinkle reduction compared to 0.5% Retinol in 8-week trials.',
    study: 'In-vivo Double-Blind Trial KB-2023-CT4',
  },
  {
    citationRef: 'KB-REF-02',
    keywords: ['kumkumadi', 'saffron', 'radiance', 'melanin', 'hyperpigmentation'],
    statement: 'Traditional Kumkumadi Tailam formulation reduces epidermal melanin index by 18.4% over 28 days.',
    study: 'Clinical Spectrophotometric Study CS-881',
  },
  {
    citationRef: 'KB-REF-03',
    keywords: ['gotu kola', 'centella asiatica', 'collagen', 'barrier', 'synthesis'],
    statement: 'Gotu Kola (Centella Asiatica) standardized triterpenes support type I collagen synthesis and epidermal barrier recovery.',
    study: 'In-vitro Dermal Fibroblast Assay DF-2022',
  },
  {
    citationRef: 'KB-REF-04',
    keywords: ['ashwagandha', 'withanolides', 'cortisol', 'skin stress', 'oxidative'],
    statement: 'Ashwagandha root extract reduces micro-inflammatory markers induced by environmental stress by 32%.',
    study: 'Cellular Biomarker Panel CB-2024-09',
  },
];

export function validateContentAgainstBrandRules(
  text: string,
  customProhibited: Array<{ phrase: string; explanation: string }> = []
): BrandValidationResult {
  const violations: BrandValidationResult['violations'] = [];
  const supportedClaims: BrandValidationResult['supportedClaims'] = [];
  const lowerText = text.toLowerCase();

  const allProhibited = [...DEFAULT_PROHIBITED_PHRASES, ...customProhibited];

  for (const item of allProhibited) {
    if (lowerText.includes(item.phrase.toLowerCase())) {
      violations.push({
        type: 'prohibited_phrase',
        severity: 'critical',
        matchedText: item.phrase,
        explanation: item.explanation,
        ruleTitle: 'Prohibited Marketing Claims',
      });
    }
  }

  for (const approved of APPROVED_CLAIMS_REGISTRY) {
    const matchCount = approved.keywords.filter((kw) => lowerText.includes(kw)).length;
    if (matchCount >= 2) {
      supportedClaims.push({
        claimText: approved.statement,
        citationRef: approved.citationRef,
        confidence: Math.min(0.98, 0.70 + matchCount * 0.08),
      });
    }
  }

  // Calculate score
  let score = 100;
  score -= violations.filter((v) => v.severity === 'critical').length * 35;
  score -= violations.filter((v) => v.severity === 'high').length * 15;
  if (supportedClaims.length === 0) {
    score -= 10;
  }
  score = Math.max(0, Math.min(100, score));

  return {
    isValid: violations.length === 0,
    score,
    violations,
    supportedClaims,
  };
}
