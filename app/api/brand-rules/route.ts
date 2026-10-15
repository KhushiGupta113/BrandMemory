import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizedWorkspaceId } from '@/lib/auth/tenant';
import { DEFAULT_PROHIBITED_PHRASES, APPROVED_CLAIMS_REGISTRY } from '@/lib/brand/validator';

export async function GET(req: NextRequest) {
  const workspaceId = req.headers.get('x-workspace-id') || getAuthorizedWorkspaceId();

  return NextResponse.json({
    workspaceId,
    brandVoice: {
      primaryTone: 'Clinical yet Poetic',
      attributes: [
        { name: 'Authoritative Evidence', weight: 'High', description: 'Every product benefit must cite in-vivo or in-vitro trial numbers.' },
        { name: 'Traditional Reverence', weight: 'Moderate', description: 'Respect classical Ayurvedic terminology (e.g. taila paka vidhi, tridosha) alongside modern dermatology.' },
        { name: 'Restrained Confidence', weight: 'High', description: 'Avoid sensationalist buzzwords, hyperbole, and exaggerated temporal promises.' },
      ],
    },
    targetAudiences: [
      { id: 'aud-1', name: 'Conscious Clinical Dermal Seekers', age: '28-45', focus: 'Clean bio-retinol alternatives, skin barrier preservation, verified botanical purity.' },
      { id: 'aud-2', name: 'Ayurvedic Purists', age: '32-60', focus: 'Formulation authentic to classical pharmacopeia without synthetic emulsifiers or mineral oils.' },
    ],
    approvedClaims: APPROVED_CLAIMS_REGISTRY,
    prohibitedPhrases: DEFAULT_PROHIBITED_PHRASES,
  });
}
