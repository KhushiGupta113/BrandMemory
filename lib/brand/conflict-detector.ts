export interface DocumentConflictItem {
  id: string;
  workspaceId: string;
  documentA: {
    id: string;
    title: string;
    version: string;
    effectiveDate: string;
    approvalStatus: string;
    snippet: string;
    citationRef: string;
  };
  documentB: {
    id: string;
    title: string;
    version: string;
    effectiveDate: string;
    approvalStatus: string;
    snippet: string;
    citationRef: string;
  };
  conflictType: 'dosage_inconsistency' | 'contraindication_conflict' | 'regulatory_tier_mismatch' | 'claim_superseded';
  severity: 'critical' | 'high' | 'moderate';
  status: 'pending_review' | 'resolved_keep_a' | 'resolved_keep_b' | 'resolved_coexist' | 'dismissed';
  description: string;
  recommendation: string;
}

export const DEMO_CONFLICTS: DocumentConflictItem[] = [
  {
    id: 'conf-kb-001',
    workspaceId: 'ws-kalyani-botanicals',
    documentA: {
      id: 'doc-bakuchiol-clinical-2023',
      title: 'Bakuchiol Clinical Monograph v2.1',
      version: 'v2.1',
      effectiveDate: '2023-11-15',
      approvalStatus: 'Approved & Certified',
      snippet: 'Bakuchiol seed extract recommended application is 1.0% concentration twice daily (morning and evening) in lipid carrier formulation.',
      citationRef: 'KB-REF-01',
    },
    documentB: {
      id: 'doc-bakuchiol-safety-2024',
      title: 'Bakuchiol Safety & Photosensitivity Review v3.0 (Draft)',
      version: 'v3.0',
      effectiveDate: '2024-04-10',
      approvalStatus: 'Pending Committee Review',
      snippet: 'Recent preliminary patch tests suggest restricting 1.0% formulation to nocturnal use only to minimize potential reactive oxidative species in UV-A exposure.',
      citationRef: 'KB-REF-01B',
    },
    conflictType: 'contraindication_conflict',
    severity: 'critical',
    status: 'pending_review',
    description: 'Document v3.0 restricts usage to night-time only, conflicting with approved marketing monograph v2.1 which claims twice-daily safe usage.',
    recommendation: 'Do NOT automatically supersede v2.1 because v3.0 is still in "Pending Committee Review". Await Clinical Director sign-off before altering generated product claims.',
  },
  {
    id: 'conf-kb-002',
    workspaceId: 'ws-kalyani-botanicals',
    documentA: {
      id: 'doc-kumkumadi-dosing',
      title: 'Kumkumadi Oil Traditional Pharmacopeia',
      version: 'v1.4',
      effectiveDate: '2023-08-01',
      approvalStatus: 'Approved',
      snippet: 'Direct facial massage with 4 to 6 drops daily; suitable for all Tridosha skin types without dilution.',
      citationRef: 'KB-REF-02',
    },
    documentB: {
      id: 'doc-kumkumadi-dermatology-trial',
      title: 'Kumkumadi Dermal Irritation Panel (Acne-Prone Cohort)',
      version: 'v1.0',
      effectiveDate: '2024-01-20',
      approvalStatus: 'Approved',
      snippet: 'Patients with active Grade 3 acne vulgaris should avoid high-saffron lipid preparations or limit to 2 drops diluted in aloe hydrosol.',
      citationRef: 'KB-REF-02B',
    },
    conflictType: 'dosage_inconsistency',
    severity: 'high',
    status: 'pending_review',
    description: 'General marketing copy claims Kumkumadi is universal for all skin types, but acne cohort study advises against pure oil for Grade 3 acne.',
    recommendation: 'Synthesize conditioned copy: specify universal radiance for normal-to-dry skin while adding an explicit cautionary note for acute acne vulgaris.',
  },
];

export function detectConflictsBetweenDocuments(
  docA: { title: string; text: string; version: string; status: string },
  docB: { title: string; text: string; version: string; status: string }
): DocumentConflictItem[] {
  const conflicts: DocumentConflictItem[] = [];

  // Inspect contradictory dosage or usage keywords
  const textA = docA.text.toLowerCase();
  const textB = docB.text.toLowerCase();

  const triggers = [
    { key: 'twice daily', counterKey: 'nocturnal only', type: 'contraindication_conflict' as const },
    { key: 'all skin types', counterKey: 'avoid in acne', type: 'dosage_inconsistency' as const },
    { key: '1.0%', counterKey: '0.5%', type: 'dosage_inconsistency' as const },
  ];

  for (const t of triggers) {
    if (textA.includes(t.key) && textB.includes(t.counterKey)) {
      conflicts.push({
        id: `conf-gen-${Date.now()}`,
        workspaceId: 'ws-kalyani-botanicals',
        documentA: {
          id: 'doc-a',
          title: docA.title,
          version: docA.version,
          effectiveDate: new Date().toISOString().split('T')[0],
          approvalStatus: docA.status,
          snippet: `Found statement: "${t.key}"`,
          citationRef: 'REF-A',
        },
        documentB: {
          id: 'doc-b',
          title: docB.title,
          version: docB.version,
          effectiveDate: new Date().toISOString().split('T')[0],
          approvalStatus: docB.status,
          snippet: `Found counter-statement: "${t.counterKey}"`,
          citationRef: 'REF-B',
        },
        conflictType: t.type,
        severity: 'high',
        status: 'pending_review',
        description: `Potential conflict detected between "${t.key}" and "${t.counterKey}".`,
        recommendation: 'Route to brand governance team for human verification.',
      });
    }
  }

  return conflicts;
}
