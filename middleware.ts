import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  console.log('TokenA:', token); // Debugging line to check token value
  const isAuthRoute = request.nextUrl.pathname.startsWith('/signin') || request.nextUrl.pathname.startsWith('/signup');

const isPublicRoute = request.nextUrl.pathname.startsWith('/public'); // Example public route


  // If no token and trying to access protected routes, redirect to login
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}