import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes and auth routes that should be accessible without authentication
const isPublicRoute = createRouteMatcher([
  '/', 
  '/api/uploadthing', 
  '/site',
  '/user/sign-in(.*)',
  '/user/sign-up(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  const searchParams = url.searchParams.toString();
  const pathWithSearchParams = `${url.pathname}${searchParams ? `?${searchParams}` : ''}`;

  // Handle sign-in/sign-up redirects
  if (url.pathname === '/sign-in' || url.pathname === '/sign-up') {
    return NextResponse.redirect(new URL('/user/sign-in', req.url));
  }

  // Handle root and site routes
  if (url.pathname === '/' || url.pathname === '/site') {
    return NextResponse.rewrite(new URL('/site', req.url));
  }

  // Check authentication for protected routes, but exclude auth routes
  if (url.pathname.startsWith('/user') && !isPublicRoute(req)) {
    const session = await auth.protect();
    if (!session) {
      return NextResponse.redirect(new URL('/user/sign-in', req.url));
    }
    return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
  }

  // Protect other non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
};