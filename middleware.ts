import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const username = request.cookies.get('username');
  const { pathname } = request.nextUrl;

  // If the user is not logged in and trying to access a protected route
  if (!username && (pathname.startsWith('/shift') || pathname.startsWith('/user'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If the user is logged in and trying to access login or register page
  if (username && (pathname === '/' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/shift', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/register', '/shift/:path*', '/user/:path*'],
};
