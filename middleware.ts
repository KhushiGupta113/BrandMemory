import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and internal Next.js requests
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Clone headers for downstream requests
  const requestHeaders = new Headers(request.headers);

  // Tenant workspace resolution:
  // 1. Check custom header (from client workspace selector)
  // 2. Check cookie
  // 3. Fallback to default demo workspace
  const workspaceHeader = request.headers.get('x-workspace-id');
  const workspaceCookie = request.cookies.get('brandmemory_workspace')?.value;
  const targetWorkspace = workspaceHeader || workspaceCookie || 'ws-kalyani-botanicals';

  requestHeaders.set('x-workspace-id', targetWorkspace);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
