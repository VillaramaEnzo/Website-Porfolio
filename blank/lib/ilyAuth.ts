export const ILY_AUTH_COOKIE_NAME = "ily-auth";
export const ILY_AUTH_COOKIE_VALUE = "granted";
export const ILY_AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
export const ILY_QR_SIGNING_SECRET_ENV_NAME = "ILY_QR_SIGNING_SECRET";
export const ILY_QR_TTL_SECONDS_ENV_NAME = "ILY_QR_TTL_SECONDS";
export const ILY_PASSWORD_ENV_NAME = "ILY_PAGE_PASSWORD";

export function getIlyAuthCookieOptions() {
  return {
    name: ILY_AUTH_COOKIE_NAME,
    value: ILY_AUTH_COOKIE_VALUE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: ILY_AUTH_COOKIE_MAX_AGE_SECONDS,
  };
}

export function isIlyAuthenticated(cookieValue: string | undefined): boolean {
  return cookieValue === ILY_AUTH_COOKIE_VALUE;
}

export function isSafeIlyPath(pathname: string): boolean {
  return pathname === "/ily" || pathname.startsWith("/ily/");
}

