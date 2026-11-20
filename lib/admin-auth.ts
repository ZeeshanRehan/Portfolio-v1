// — Admin auth (server only)
// One password, stored in the ADMIN_PASSWORD env var on Vercel.
// Logging in sets an httpOnly cookie holding an HMAC signature, so it can't be faked
// without knowing the secret.

import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "zr_admin";
const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

function getSecret(): string | null {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    return null;
  }
  return secret;
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) {
    return false;
  }
  return timingSafeEqual(bufferA, bufferB);
}

export function checkPassword(attempt: string): boolean {
  const realPassword = process.env.ADMIN_PASSWORD;
  if (!realPassword) {
    return false;
  }
  return safeEqual(attempt, realPassword);
}

// cookie value looks like: "<expiresAtMs>.<signature>"
function createToken(): string | null {
  const secret = getSecret();
  if (!secret) {
    return null;
  }
  const expiresAt = Date.now() + THIRTY_DAYS_IN_SECONDS * 1000;
  const payload = "admin:" + expiresAt;
  return expiresAt + "." + sign(payload, secret);
}

function isValidToken(token: string | undefined): boolean {
  if (!token) {
    return false;
  }
  const secret = getSecret();
  if (!secret) {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return false;
  }

  const expiresAt = Number(parts[0]);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) {
    return false;
  }

  const expected = sign("admin:" + expiresAt, secret);
  return safeEqual(parts[1], expected);
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return isValidToken(token);
}

export async function startSession(): Promise<boolean> {
  const token = createToken();
  if (!token) {
    return false;
  }
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS_IN_SECONDS,
  });
  return true;
}

export async function endSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}
