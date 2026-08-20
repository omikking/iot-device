import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { Application, Role } from '@/gql/graphql';

/**
 * Routes that live at the top level and therefore have no `[companyId]`
 * segment. Everything else under `/` is treated as `/[companyId]/…` and is
 * company-gated.
 *
 * This is the inverse of banshee's approach: banshee allowlists the *protected*
 * second path segments, so any route a developer adds is authentication-gated
 * only until someone remembers to update the array. Hydra is default-deny —
 * a new route under `[companyId]` is company-gated the moment it exists, and
 * this list only ever needs touching when a company-agnostic
 * top-level route is added.
 */
const COMPANY_AGNOSTIC_SEGMENTS = ['not-found'];

/**
 * Returns the `[companyId]` segment for any path that has one, or null for the
 * app root and the explicitly company-agnostic routes above.
 */
const extractCompanyId = (pathname: string): string | null => {
  const segments = pathname.split('/').filter(Boolean);

  // '/' — the root page only redirects to sign-in.
  if (segments.length === 0) return null;

  const [first] = segments;

  if (COMPANY_AGNOSTIC_SEGMENTS.includes(first)) return null;

  return first;
};

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const callbackUrl = encodeURIComponent(pathname + search);
    const signinUrl = `/api/auth/signin?callbackUrl=${callbackUrl}`;
    return NextResponse.redirect(new URL(signinUrl, req.url));
  }

  const companyId = extractCompanyId(pathname);

  if (companyId) {
    const globalRole = token.userData?.globalRole;

    // Sandvik admins bypass company scoping by design (mirrors RolesGuard).
    if (globalRole !== Role.SandvikAdmin) {
      const permissions = token.userData?.userPermissions || [];
      const companyPermission = permissions.find(
        (perm) => perm.companyId === companyId,
      );

      // The caller must hold a permission for *this* company and that
      // permission must include Hydra. Without the companyId check, any
      // signed-in user could read another company's data by editing the URL.
      if (
        !companyPermission ||
        !companyPermission.appsAccess?.includes(Application.Hydra)
      ) {
        return NextResponse.redirect(new URL('/not-found', req.url));
      }
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
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|images|.+\\.png$|.+\\.svg$|api/auth).*)',
  ],
};
