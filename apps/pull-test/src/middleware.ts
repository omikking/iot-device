import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { Application, Role } from './gql/graphql';

const publicRoutes = ['/api/auth/signin'];

const extractCompanyId = (pathname: string): string | null => {
  const companyIdRoutes = [
    /^\/overview\/([^/]+)/,
    /^\/bolt-results\/([^/]+)/,
    /^\/reported-hazards\/([^/]+)/,
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

  const globalRole = token.userData?.globalRole;

  const companyId = extractCompanyId(pathname);
  if (companyId && globalRole !== Role.SandvikAdmin) {
    const permissions = token.userData?.userPermissions || [];
    const companyPermission = permissions.find(
      (perm) => perm.companyId === companyId,
    );
    // Check for Pull Test app access
    if (
      !companyPermission ||
      !companyPermission.appsAccess?.includes(Application.PullTest)
    ) {
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
