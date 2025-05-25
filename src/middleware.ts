import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define which routes are public and don’t require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api(.*)', // You can remove this if you want your API routes to be protected
]);

// Apply the Clerk middleware
export default clerkMiddleware(async (auth, request) => {
  // If the route is not public
  if (!isPublicRoute(request)) {
    const { userId } = await auth();

    // If user is not authenticated, redirect to sign-in
    if (!userId) {
      const signInUrl = new URL('/sign-in', request.url);
      
      // Create a new Response to avoid "immutable" error
      return new Response(null, {
        status: 307,
        headers: {
          Location: signInUrl.toString(),
        },
      });
    }
  }
});

// Middleware configuration for Next.js
export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)', // Match all routes except static files (_next, .js, .css, etc.)
    '/',
    '/(api|trpc)(.*)', // Include API and tRPC routes if needed
  ],
  unstable_allowDynamic: [
    '/node_modules/@clerk/nextjs/dist/index.js', // Allow dynamic import of Clerk
  ],
};
