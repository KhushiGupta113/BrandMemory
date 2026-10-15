import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizedWorkspaceId } from '@/lib/auth/tenant';
import { generateGroundedMarketingCopy } from '@/lib/rag/engine';
import { checkRateLimit } from '@/lib/security/ratelimit';

export async function POST(req: NextRequest) {
  try {
    const workspaceId = req.headers.get('x-workspace-id') || getAuthorizedWorkspaceId();

    // Rate limit: 15 requests per minute per workspace
    const rateLimit = await checkRateLimit(`gen:${workspaceId}`, 15, 60);
    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please wait a few seconds before generating again.',
          resetSeconds: rateLimit.reset
        },
        { status: 429, headers: { 'Retry-After': String(rateLimit.reset) } }
      );
    }

    const body = await req.json();
    const { prompt, channel = 'E-Commerce PDP' } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const result = await generateGroundedMarketingCopy(prompt, workspaceId, channel);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 });
  }
}
