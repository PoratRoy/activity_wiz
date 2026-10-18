import { DurableObject } from "cloudflare:workers";

/**
 * One instance per key (`u:{userId}` or `g:{guestId}`). A Durable Object handles its calls one at a
 * time, so read-then-write here is atomic per key (docs/ai.md "Rate limiter Durable Object").
 */
export class RateLimiter extends DurableObject {
  async hit(windowMs: number): Promise<{ ok: boolean; retryInMs: number }> {
    const now = Date.now();
    const last = (await this.ctx.storage.get<number>("lastAt")) ?? 0;
    if (now - last < windowMs) return { ok: false, retryInMs: windowMs - (now - last) };
    await this.ctx.storage.put("lastAt", now);
    return { ok: true, retryInMs: 0 };
  }
}
