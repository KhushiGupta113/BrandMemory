import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizedWorkspaceId } from '@/lib/auth/tenant';
import { DEMO_CONFLICTS } from '@/lib/brand/conflict-detector';

let conflictsStore = [...DEMO_CONFLICTS];

export async function GET(req: NextRequest) {
  const workspaceId = req.headers.get('x-workspace-id') || getAuthorizedWorkspaceId();
  const list = conflictsStore.filter((c) => c.workspaceId === workspaceId);

  return NextResponse.json({
    conflicts: list,
    pendingCount: list.filter((c) => c.status === 'pending_review').length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conflictId, resolution, notes, resolvedBy } = body;

    const idx = conflictsStore.findIndex((c) => c.id === conflictId);
    if (idx === -1) {
      return NextResponse.json({ error: 'Conflict not found' }, { status: 404 });
    }

    conflictsStore[idx].status = resolution || 'resolved_keep_a';

    return NextResponse.json({
      success: true,
      conflict: conflictsStore[idx],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
