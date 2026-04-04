import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  ILY_AUTH_COOKIE_NAME,
  ILY_AUTH_COOKIE_VALUE,
  isSafeIlyPath,
} from "@/lib/ilyAuth";

const PUBLIC_ILY_PATHS = new Set(["/ily/login", "/ily/auth"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isSafeIlyPath(pathname) || PUBLIC_ILY_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const isAuthenticated =
    request.cookies.get(ILY_AUTH_COOKIE_NAME)?.value === ILY_AUTH_COOKIE_VALUE;

  if (isAuthenticated) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/ily/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/ily/:path*"],
};

