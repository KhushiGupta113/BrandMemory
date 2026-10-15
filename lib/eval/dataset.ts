export interface EvaluationQueryItem {
  id: string;
  workspaceId: string;
  query: string;
  category: 'Clinical Efficacy' | 'Dosage & Safety' | 'Ayurvedic Regulatory' | 'Ingredient Provenance';
  goldenChunkIds: string[];
  referenceAnswer: string;
}

export const EVALUATION_DATASET: EvaluationQueryItem[] = [
  {
    id: 'eval-q1',
    workspaceId: 'ws-kalyani-botanicals',
    query: 'What is the clinical evidence comparing Bakuchiol 1% against Retinol for wrinkle reduction?',
    category: 'Clinical Efficacy',
    goldenChunkIds: ['chk-bakuchiol-1', 'chk-bakuchiol-2'],
    referenceAnswer: '1% Bakuchiol demonstrates clinically non-inferior wrinkle reduction compared to 0.5% Retinol over 8 weeks without retinoid dermatitis.',
  },
  {
    id: 'eval-q2',
    workspaceId: 'ws-kalyani-botanicals',
    query: 'What is the spectrophotometric reduction in melanin index observed with Kumkumadi Tailam?',
    category: 'Clinical Efficacy',
    goldenChunkIds: ['chk-kumkumadi-1'],
    referenceAnswer: 'A 28-day trial recorded an 18.4% reduction in epidermal melanin index with twice-daily application of Kumkumadi Tailam.',
  },
  {
    id: 'eval-q3',
    workspaceId: 'ws-kalyani-botanicals',
    query: 'How does Gotu Kola triterpene extract impact dermal collagen synthesis and skin barrier recovery?',
    category: 'Ingredient Provenance',
    goldenChunkIds: ['chk-gotukola-1'],
    referenceAnswer: 'Standardized triterpenes from Centella Asiatica stimulate Type I pro-collagen gene expression and accelerate barrier restoration.',
  },
  {
    id: 'eval-q4',
    workspaceId: 'ws-kalyani-botanicals',
    query: 'What AYUSH regulatory constraints apply to claims regarding chronic skin conditions?',
    category: 'Ayurvedic Regulatory',
    goldenChunkIds: ['chk-ayush-rules-1'],
    referenceAnswer: 'Rule 170 of AYUSH Drugs & Cosmetics Rules prohibits disease cure claims; only structure-function support and clinical comfort claims are permissible.',
  },
  {
    id: 'eval-q5',
    workspaceId: 'ws-kalyani-botanicals',
    query: 'What are the recommended application guidelines for Kumkumadi oil on acute acne vulgaris?',
    category: 'Dosage & Safety',
    goldenChunkIds: ['chk-kumkumadi-safety-1'],
    referenceAnswer: 'In Grade 3 acne vulgaris, pure saffron lipid preparations are contraindicated; dilution in aloe vera hydrosol or localized patch application is advised.',
  },
];
