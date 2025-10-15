import { NextResponse, NextRequest } from 'next/server';
// import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { Role } from 'src/gql/graphql';

// Routes that should work without authentication
const publicRoutes = ['/setup-account'];

// Protected route mappings
const sandvikAdminRoutes = [
  '/administration-portal',
  '/administrators',
  '/technicians',
  '/company/new',
];

const extractCompanyId = (pathname: string): string | null => {
  const companyIdRoutes = [
    /^\/company\/([^/]+)/,
    /^\/site\/([^/]+)/,
    /^\/site-locations\/([^/]+)/,
    /^\/users\/([^/]+)/,
    /^\/select-application\/([^/]+)/,
  ];
  for (const regex of companyIdRoutes) {
    const match = pathname.match(regex);
    if (match) return match[1];
  }
  return null;
};

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Allow access to public routes without authentication
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const callbackUrl = encodeURIComponent(pathname + search);
    const signinUrl = `/api/auth/signin?callbackUrl=${callbackUrl}`;
    return NextResponse.redirect(new URL(signinUrl, req.url));
  }

  if (token.userData?.isDeleted === true) {
    return NextResponse.redirect(new URL('/api/auth/signin', req.url));
  }

  const globalRole = token.userData?.globalRole;

  // Redirect Sandvik Admin pages
  if (sandvikAdminRoutes.some((route) => pathname.startsWith(route))) {
    if (globalRole !== Role.SandvikAdmin) {
      return NextResponse.redirect(new URL('/not-found', req.url));
    }
  }

  // Redirect Sandvik Admins away from select-company
  if (
    pathname.startsWith('/select-company') &&
    globalRole === Role.SandvikAdmin
  ) {
    return NextResponse.redirect(new URL('/administration-portal', req.url));
  }

  // Check company permission for /company/[companyId] routes
  const companyId = extractCompanyId(pathname);
  if (companyId && globalRole !== Role.SandvikAdmin) {
    const permissions = token.userData?.userPermissions || [];
    const hasPermission = permissions.some(
      (perm) => perm.companyId === companyId,
    );
    if (!hasPermission) {
      return NextResponse.redirect(new URL('/not-found', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
      Match all routes except static files and Next.js internals.
      This is the recommended pattern from NextAuth docs.
    */
    '/((?!_next/static|_next/image|favicon.ico|images|.+\\.png$|.+\\.svg$|api/auth).*)',
  ],
};
