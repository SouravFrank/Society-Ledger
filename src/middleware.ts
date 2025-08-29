import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;

  if (request.nextUrl.pathname.startsWith('/shibalik-b/editor') && !request.nextUrl.pathname.startsWith('/shibalik-b/editor/login')) {
    if (!authToken || authToken !== 'editor-secret-token') {
      const loginUrl = new URL('/shibalik-b/editor/login', request.url);
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (request.nextUrl.pathname.startsWith('/shibalik-b/editor/login') && authToken === 'editor-secret-token') {
    return NextResponse.redirect(new URL('/shibalik-b/editor', request.url));
  }

  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/shibalik-b', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/shibalik-b/editor/:path*', '/shibalik-b/editor/login'],
};
