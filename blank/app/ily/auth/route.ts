import { NextResponse } from "next/server";
import {
  getIlyPasswordFromEnv,
  ILY_AUTH_COOKIE_NAME,
  ILY_AUTH_COOKIE_VALUE,
} from "@/lib/ilyAuth";

function sanitizeNextPath(pathname: FormDataEntryValue | null): string {
  if (typeof pathname !== "string") {
    return "/ily";
  }

  if (pathname.startsWith("/ily")) {
    return pathname;
  }

  return "/ily";
}

function redirectWithParams(
  requestUrl: string,
  pathname: string,
  params: Record<string, string>,
) {
  const url = new URL(pathname, requestUrl);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return NextResponse.redirect(url);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const submittedPassword = formData.get("password");
  const nextPath = sanitizeNextPath(formData.get("next"));
  const configuredPassword = getIlyPasswordFromEnv();

  if (!configuredPassword) {
    return redirectWithParams(request.url, "/ily/login", { config: "1" });
  }

  if (typeof submittedPassword !== "string" || submittedPassword.length === 0) {
    return redirectWithParams(request.url, "/ily/login", { error: "1" });
  }

  if (submittedPassword !== configuredPassword) {
    return redirectWithParams(request.url, "/ily/login", { error: "1" });
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url));
  response.cookies.set({
    name: ILY_AUTH_COOKIE_NAME,
    value: ILY_AUTH_COOKIE_VALUE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

