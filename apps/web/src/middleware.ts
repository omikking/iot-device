export { default } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that should work without authentication
const publicRoutes = ['/setup-account', '/api/auth/signin'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow access to public routes without authentication
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }
}
