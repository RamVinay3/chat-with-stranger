// middleware.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';


export function middleware(request) {
 
  // const token = request.cookies.get('jwt')?.value;

  const { pathname } = request.nextUrl;
  // console.log(request,"request")
  // console.log('🔥 Middleware Triggered',pathname); // Add this log for debugging
  // console.log(token, "token");
  // const token=sessionStorage.getItem('jwt');

  const isAuthRoute = pathname === '/login' || pathname === '/signup';
  const isProtectedRoute = pathname === '/' || pathname.startsWith('/home');

    // Avoid middleware triggering on internal or static files
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname === '/favicon.ico' ||
      pathname === '/robots.txt' ||
      pathname.startsWith('/static') ||
      pathname.startsWith('/images')
    ) {
      return NextResponse.next();
    }

  // if (!token && isProtectedRoute) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }
  // console.log(token,"token")
  // if (token && isAuthRoute) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }
  

  

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/signup', '/home/:path*']
};
