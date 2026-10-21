import "server-only";
import { headers } from "next/headers";
import { getEnv } from "@/lib/env";

export const GENERATION_WINDOW_MS = 30_000;

type Res = { ok: boolean; retryInMs: number };

// `next dev` can't run our own Durable Object class (Wrangler's platform proxy only supports
// DOs from another worker), so development falls back to process memory. Preview and production
// always use the Durable Object.
const devLastHit = new Map<string, number>();
const devWindows = new Map<string, { start: number; n: number }>();

function devHit(key: string, windowMs: number): Res {
  const now = Date.now();
  const last = devLastHit.get(key) ?? 0;
  if (now - last < windowMs) return { ok: false, retryInMs: windowMs - (now - last) };
  devLastHit.set(key, now);
  return { ok: true, retryInMs: 0 };
}

function devCount(key: string, max: number, windowMs: number): Res {
  const now = Date.now();
  const w = devWindows.get(key);
  const current = w && now - w.start < windowMs ? w : { start: now, n: 0 };
  if (current.n >= max) return { ok: false, retryInMs: windowMs - (now - current.start) };
  devWindows.set(key, { start: current.start, n: current.n + 1 });
  return { ok: true, retryInMs: 0 };
}

const limiter = (key: string) => getEnv().RATE_LIMITER.get(getEnv().RATE_LIMITER.idFromName(key));
const toResult = (res: Res) => ({ ok: res.ok, retryInSec: Math.ceil(res.retryInMs / 1000) });

/**
 * Records an attempt for `key` if the window has passed. Every admitted attempt counts,
 * including ones that later fail (R8).
 */
export async function hitRateLimit(key: string, windowMs = GENERATION_WINDOW_MS): Promise<{ ok: boolean; retryInSec: number }> {
  return toResult(process.env.NODE_ENV === "development" ? devHit(key, windowMs) : await limiter(key).hit(windowMs));
}

/** Admits at most `max` calls for `key` per `windowMs`. For bursts of cheap calls (saves, copies, attempts). */
export async function hitBurstLimit(key: string, max: number, windowMs: number): Promise<{ ok: boolean; retryInSec: number }> {
  return toResult(process.env.NODE_ENV === "development" ? devCount(key, max, windowMs) : await limiter(key).count(max, windowMs));
}

/** The caller's IP as Cloudflare reports it. Only Cloudflare sets this header, so it can't be spoofed. */
export async function clientIp(): Promise<string> {
  return (await headers()).get("cf-connecting-ip") ?? "unknown";
}
