import { headers } from 'next/headers';

export interface WorkspaceContext {
  id: string;
  name: string;
  slug: string;
  industry: string;
  role: 'owner' | 'admin' | 'scientist' | 'member';
}

export const KNOWN_WORKSPACES: Record<string, WorkspaceContext> = {
  'ws-kalyani-botanicals': {
    id: 'ws-kalyani-botanicals',
    name: 'Kalyani Botanicals',
    slug: 'kalyani-botanicals',
    industry: 'Ayurvedic Clinical Formulations & Skin Science',
    role: 'scientist',
  },
  'ws-vedic-wellness': {
    id: 'ws-vedic-wellness',
    name: 'Vedic Wellness Labs',
    slug: 'vedic-wellness',
    industry: 'Nutraceuticals & Dietary Adaptogens',
    role: 'admin',
  },
  'ws-aurora-derma': {
    id: 'ws-aurora-derma',
    name: 'Aurora Derma Technologies',
    slug: 'aurora-derma',
    industry: 'Biotech Dermaceuticals',
    role: 'member',
  },
};

import { verifyJwt } from './jwt';

export function getAuthorizedWorkspaceId(reqHeaders?: Headers): string {
  try {
    const h = reqHeaders || headers();

    // 1. Check Authorization Bearer JWT header
    const authHeader = h.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const session = verifyJwt(token);
      if (session?.workspaceId && KNOWN_WORKSPACES[session.workspaceId]) {
        return session.workspaceId;
      }
    }

    // 2. Check explicit workspace header (e.g. from validated middleware)
    const explicitWorkspace = h.get('x-workspace-id');
    if (explicitWorkspace && KNOWN_WORKSPACES[explicitWorkspace]) {
      return explicitWorkspace;
    }
  } catch {
    // If running in non-request context
  }
  return process.env.DEFAULT_WORKSPACE_ID || 'ws-kalyani-botanicals';
}

export function validateWorkspaceAccess(workspaceId: string): WorkspaceContext {
  const ws = KNOWN_WORKSPACES[workspaceId];
  if (!ws) {
    throw new Error(`Unauthorized workspace access or invalid tenant ID: ${workspaceId}`);
  }
  return ws;
}
