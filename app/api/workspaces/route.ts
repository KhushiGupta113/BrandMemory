import { NextResponse } from 'next/server';
import { KNOWN_WORKSPACES } from '@/lib/auth/tenant';

export async function GET() {
  return NextResponse.json({
    workspaces: Object.values(KNOWN_WORKSPACES),
    activeWorkspaceId: process.env.DEFAULT_WORKSPACE_ID || 'ws-kalyani-botanicals',
  });
}
