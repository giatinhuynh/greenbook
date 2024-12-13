import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes
const isPublicRoute = createRouteMatcher(['/site', '/api/uploadthing']);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  const searchParams = url.searchParams.toString();
  const hostname = req.headers.get('host') || '';
  const pathWithSearchParams = `${url.pathname}${searchParams ? `?${searchParams}` : ''}`;

  // Check for subdomain
  const customSubDomain = hostname.split(process.env.NEXT_PUBLIC_DOMAIN || '').filter(Boolean)[0];

  if (customSubDomain) {
    return NextResponse.rewrite(new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url));
  }

  if (url.pathname === '/sign-in' || url.pathname === '/sign-up') {
    return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
  }

  if (url.pathname === '/' || (url.pathname === '/site' && hostname === process.env.NEXT_PUBLIC_DOMAIN)) {
    return NextResponse.rewrite(new URL('/site', req.url));
  }

  if (url.pathname.startsWith('/agency') || url.pathname.startsWith('/subaccount')) {
    return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
  }

  // Protect routes that are not public
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
