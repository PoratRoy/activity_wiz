import "server-only";
import { getEnv } from "@/lib/env";

export const GENERATION_WINDOW_MS = 30_000;

// `next dev` can't run our own Durable Object class (Wrangler's platform proxy only supports
// DOs from another worker), so development falls back to process memory. Preview and production
// always use the Durable Object.
const devLastHit = new Map<string, number>();

function devHit(key: string, windowMs: number) {
  const now = Date.now();
  const last = devLastHit.get(key) ?? 0;
  if (now - last < windowMs) return { ok: false, retryInMs: windowMs - (now - last) };
  devLastHit.set(key, now);
  return { ok: true, retryInMs: 0 };
}

/**
 * Records an attempt for `key` if the window has passed. Every admitted attempt counts,
 * including ones that later fail (R8).
 */
export async function hitRateLimit(key: string, windowMs = GENERATION_WINDOW_MS): Promise<{ ok: boolean; retryInSec: number }> {
  const res =
    process.env.NODE_ENV === "development"
      ? devHit(key, windowMs)
      : await getEnv().RATE_LIMITER.get(getEnv().RATE_LIMITER.idFromName(key)).hit(windowMs);
  return { ok: res.ok, retryInSec: Math.ceil(res.retryInMs / 1000) };
}
