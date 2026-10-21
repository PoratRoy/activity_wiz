import { DurableObject } from "cloudflare:workers";

/**
 * One instance per key (`u:{userId}`, `g:{guestId}`, `ip:…`). A Durable Object handles its calls one
 * at a time, so read-then-write here is atomic per key (docs/ai.md "Rate limiter Durable Object").
 */
export class RateLimiter extends DurableObject {
  /** At most one admitted call per window. */
  async hit(windowMs: number): Promise<{ ok: boolean; retryInMs: number }> {
    const now = Date.now();
    const last = (await this.ctx.storage.get<number>("lastAt")) ?? 0;
    if (now - last < windowMs) return { ok: false, retryInMs: windowMs - (now - last) };
    await this.ctx.storage.put("lastAt", now);
    return { ok: true, retryInMs: 0 };
  }

  /** At most `max` admitted calls per fixed window. */
  async count(max: number, windowMs: number): Promise<{ ok: boolean; retryInMs: number }> {
    const now = Date.now();
    const w = (await this.ctx.storage.get<{ start: number; n: number }>("window")) ?? { start: 0, n: 0 };
    const current = now - w.start < windowMs ? w : { start: now, n: 0 };
    if (current.n >= max) return { ok: false, retryInMs: windowMs - (now - current.start) };
    await this.ctx.storage.put("window", { start: current.start, n: current.n + 1 });
    return { ok: true, retryInMs: 0 };
  }
}
