import { NextRequest, NextResponse } from 'next/server';
import { extractSubdomain } from 'src/utils/subdomain';

// ----------------------------------------------------------------------

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Extract tenant info from the request
  const tenant = extractSubdomain(request.headers.get('host') || '');

  // Add tenant info to request headers for use in API routes and pages
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant-subdomain', tenant.subdomain);
  requestHeaders.set('x-tenant-database', tenant.databaseName);
  requestHeaders.set('x-tenant-valid', tenant.isValid.toString());

  // Handle invalid tenants
  if (!tenant.isValid) {
    return NextResponse.redirect(new URL('/error/404', request.url));
  }

  // For subdomain routes, you might want to add tenant-specific routing
  if (tenant.subdomain && pathname === '/') {
    // You can redirect to tenant-specific pages here
    // For example: return NextResponse.redirect(new URL(`/tenant/${tenant.subdomain}`, request.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// ----------------------------------------------------------------------

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
