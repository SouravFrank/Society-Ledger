'use server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;

  // If user is trying to access editor pages
  if (request.nextUrl.pathname.startsWith('/shibalik-b/editor')) {
    // and they are not authenticated, redirect to login.
    if (!authToken || authToken !== 'editor-secret-token') {
      const loginUrl = new URL('/shibalik-b/login', request.url);
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If the user is authenticated and tries to access the login page
  if (request.nextUrl.pathname.startsWith('/shibalik-b/login') && authToken === 'editor-secret-token') {
    // redirect them to the editor dashboard.
    return NextResponse.redirect(new URL('/shibalik-b/editor', request.url));
  }
  
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/shibalik-b', request.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: ['/shibalik-b/editor/:path*', '/shibalik-b/login', '/'],
};
