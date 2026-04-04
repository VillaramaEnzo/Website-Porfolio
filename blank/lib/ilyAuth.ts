export const ILY_AUTH_COOKIE_NAME = "ily-auth";
export const ILY_AUTH_COOKIE_VALUE = "granted";
export const ILY_PASSWORD_ENV_NAME = "ILY_PAGE_PASSWORD";

export function getIlyPasswordFromEnv(): string | null {
  const password = process.env[ILY_PASSWORD_ENV_NAME];
  if (!password || password.trim().length === 0) {
    return null;
  }

  return password;
}

export function isSafeIlyPath(pathname: string): boolean {
  return pathname === "/ily" || pathname.startsWith("/ily/");
}

