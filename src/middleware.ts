import { NextRequest, NextResponse } from 'next/server';

// Routes that require authentication in production
const PROTECTED_ROUTES = [
  '/person',
  '/family',
  '/search',
  '/media',
  '/tree'
];

// Routes that are always public
const PUBLIC_ROUTES = [
  '/login',
  '/api',
  '/_next',
  '/favicon.ico'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip authentication in development mode
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if route needs protection
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Check for authentication cookie
  const sessionCookie = request.cookies.get('family-tree-session');
  
  if (!sessionCookie) {
    // Redirect to login if not authenticated
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Validate session token format
  const token = sessionCookie.value;
  const tokenPattern = /^\d+-[a-f0-9]{32}$/;
  
  if (!tokenPattern.test(token)) {
    // Invalid token format, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('family-tree-session');
    return response;
  }

  // Check if session has expired
  const [timestampStr] = token.split('-');
  const timestamp = parseInt(timestampStr, 10);
  const now = Date.now();
  const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  
  if (isNaN(timestamp) || now - timestamp > SESSION_DURATION) {
    // Session expired, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('family-tree-session');
    return response;
  }

  // Authentication successful, continue to protected route
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};