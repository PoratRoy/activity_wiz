import "server-only";
import { cookies } from "next/headers";
import { newId } from "@/lib/db/client";
import { getEnv } from "@/lib/env";

// Signed guest cookie: `base64url(JSON payload).base64url(HMAC-SHA256)` (docs/architecture.md "Guest identity").

export const GUEST_COOKIE = "aw_guest";
export const TRIAL_MS = 72 * 60 * 60 * 1000;
const MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

/** `trialStart` is set at the guest's first generation (R1). */
export type Guest = { id: string; trialStart?: number };

const enc = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string): Uint8Array<ArrayBuffer> {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function hmacKey(): Promise<CryptoKey> {
  const secret = getEnv().GUEST_COOKIE_SECRET;
  if (!secret) throw new Error("GUEST_COOKIE_SECRET is not set");
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function encodeGuest(guest: Guest): Promise<string> {
  const payload = b64url(enc.encode(JSON.stringify(guest)));
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", await hmacKey(), enc.encode(payload)));
  return `${payload}.${b64url(sig)}`;
}

export async function decodeGuest(value: string | undefined): Promise<Guest | null> {
  if (!value) return null;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return null;
  try {
    const ok = await crypto.subtle.verify("HMAC", await hmacKey(), fromB64url(sig), enc.encode(payload));
    if (!ok) return null;
    const g = JSON.parse(new TextDecoder().decode(fromB64url(payload))) as Guest;
    if (typeof g.id !== "string" || (g.trialStart !== undefined && typeof g.trialStart !== "number")) return null;
    return g;
  } catch {
    return null;
  }
}

/** Reads the guest cookie (works in Server Components). Null if missing or tampered with. */
export async function readGuest(): Promise<Guest | null> {
  return decodeGuest((await cookies()).get(GUEST_COOKIE)?.value);
}

/** Writes the guest cookie. Only callable from Server Actions and Route Handlers. */
export async function writeGuest(guest: Guest): Promise<void> {
  (await cookies()).set(GUEST_COOKIE, await encodeGuest(guest), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

/** Existing guest, or a new one written to the cookie. Server Actions only. */
export async function ensureGuest(): Promise<Guest> {
  const existing = await readGuest();
  if (existing) return existing;
  const guest: Guest = { id: newId() };
  await writeGuest(guest);
  return guest;
}

export function isTrialExpired(guest: Guest | null, now = Date.now()): boolean {
  return !!guest?.trialStart && now - guest.trialStart > TRIAL_MS;
}
