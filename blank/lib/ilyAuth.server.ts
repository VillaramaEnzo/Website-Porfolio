import { createHmac, timingSafeEqual } from "node:crypto";
import {
  ILY_PASSWORD_ENV_NAME,
  ILY_QR_SIGNING_SECRET_ENV_NAME,
  ILY_QR_TTL_SECONDS_ENV_NAME,
} from "@/lib/ilyAuth";

const DEFAULT_ILY_QR_TTL_SECONDS = 60 * 60 * 24 * 14;

function getNonEmptyEnv(name: string): string | null {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    return null;
  }
  return value;
}

export function getIlyPasswordFromEnv(): string | null {
  return getNonEmptyEnv(ILY_PASSWORD_ENV_NAME);
}

function getIlyQrSigningSecretFromEnv(): string | null {
  return getNonEmptyEnv(ILY_QR_SIGNING_SECRET_ENV_NAME);
}

function getIlyQrTtlSecondsFromEnv(): number {
  const raw = process.env[ILY_QR_TTL_SECONDS_ENV_NAME];
  if (!raw) {
    return DEFAULT_ILY_QR_TTL_SECONDS;
  }

  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return DEFAULT_ILY_QR_TTL_SECONDS;
  }

  return parsed;
}

function signIlyTokenPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function createIlyQrUnlockToken(
  nowUnixSeconds = Date.now() / 1000,
): string | null {
  const secret = getIlyQrSigningSecretFromEnv();
  if (!secret) {
    return null;
  }

  const issuedAtSeconds = Math.floor(nowUnixSeconds);
  const expiresAtSeconds = issuedAtSeconds + getIlyQrTtlSecondsFromEnv();
  const payload = `${expiresAtSeconds}`;
  const signature = signIlyTokenPayload(payload, secret);
  return `${payload}.${signature}`;
}

export function verifyIlyQrUnlockToken(
  token: string | null,
  nowUnixSeconds = Date.now() / 1000,
): boolean {
  if (!token) {
    return false;
  }

  const secret = getIlyQrSigningSecretFromEnv();
  if (!secret) {
    return false;
  }

  const [expiresAtRaw, signature] = token.split(".");
  if (!expiresAtRaw || !signature) {
    return false;
  }

  const expiresAtSeconds = Number.parseInt(expiresAtRaw, 10);
  if (Number.isNaN(expiresAtSeconds)) {
    return false;
  }

  if (Math.floor(nowUnixSeconds) > expiresAtSeconds) {
    return false;
  }

  const expectedSignature = signIlyTokenPayload(expiresAtRaw, secret);
  const providedBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
}

