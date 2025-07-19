import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Future authentication logic will go here
  // For now, just pass through all requests
  
  // Example of how auth will work:
  // const token = request.cookies.get('auth-token');
  // const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
  //                   request.nextUrl.pathname.startsWith('/register');
  // const isProtectedRoute = request.nextUrl.pathname.startsWith('/(platform)');
  
  // if (isProtectedRoute && !token) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }
  
  // if (isAuthPage && token) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url));
  // }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};