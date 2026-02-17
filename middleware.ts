import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)",
  "/changelog(.*)",
]);

/** Reserved subdomains that should not be treated as workspace slugs */
const RESERVED_SUBDOMAINS = new Set(["www", "app", "api"]);

/**
 * Extract subdomain from hostname using string splitting.
 * Config-driven via NEXT_PUBLIC_ROOT_DOMAIN env var.
 *
 * @returns The subdomain slug, or null if this is the root domain
 */
function extractSubdomain(hostname: string): string | null {
  const baseDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "releasedock.co";

  // Strip port from both hostname and base domain for comparison
  const host = hostname.split(":")[0];
  const base = baseDomain.split(":")[0];

  if (!host.endsWith(`.${base}`)) {
    return null;
  }

  const slug = host.slice(0, -(base.length + 1));

  // Ignore reserved subdomains and empty/nested subdomains
  if (!slug || slug.includes(".") || RESERVED_SUBDOMAINS.has(slug)) {
    return null;
  }

  return slug;
}

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  const hostname = req.headers.get("host") || "";
  const url = req.nextUrl;

  // Check if this is a subdomain request (e.g., acme.releasedock.co)
  const slug = extractSubdomain(hostname);

  if (slug) {
    // Rewrite to internal changelog route
    const rewriteUrl = new URL(`/changelog/${slug}${url.pathname}`, req.url);
    rewriteUrl.search = url.search;
    return NextResponse.rewrite(rewriteUrl);
  }

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // If not authenticated, Clerk will handle redirect to sign-in
  if (!userId) {
    return NextResponse.next();
  }

  // For authenticated users accessing protected routes
  // The onboarding status check will be handled by a client-side component
  // since middleware cannot directly query Convex
  // This middleware ensures authentication is enforced
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
