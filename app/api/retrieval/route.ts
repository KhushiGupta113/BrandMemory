import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizedWorkspaceId } from '@/lib/auth/tenant';
import { searchKeyword, searchDense, searchHybrid } from '@/lib/rag/engine';

export async function POST(req: NextRequest) {
  try {
    const workspaceId = req.headers.get('x-workspace-id') || getAuthorizedWorkspaceId();
    const body = await req.json();
    const { query, strategy = 'hybrid_rrf', k = 5, rrfK = 60 } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const startTime = performance.now();

    // 1. Keyword Search
    const kwStart = performance.now();
    const keywordResults = searchKeyword(query, workspaceId, k);
    const kwTime = performance.now() - kwStart;

    // 2. Dense Vector Search
    const vecStart = performance.now();
    const vectorResults = await searchDense(query, workspaceId, k);
    const vecTime = performance.now() - vecStart;

    // 3. Hybrid RRF
    const rrfStart = performance.now();
    const hybridResults = await searchHybrid(query, workspaceId, k, rrfK);
    const rrfTime = performance.now() - rrfStart;

    const totalTime = performance.now() - startTime;

    return NextResponse.json({
      query,
      workspaceId,
      strategy,
      results: strategy === 'keyword' ? keywordResults : strategy === 'dense_vector' ? vectorResults : hybridResults,
      comparison: {
        keyword: { results: keywordResults, latencyMs: Number(kwTime.toFixed(2)) },
        denseVector: { results: vectorResults, latencyMs: Number(vecTime.toFixed(2)) },
        hybridRRF: { results: hybridResults, latencyMs: Number(rrfTime.toFixed(2)) },
      },
      totalLatencyMs: Number(totalTime.toFixed(2)),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Retrieval failed' }, { status: 500 });
  }
}
