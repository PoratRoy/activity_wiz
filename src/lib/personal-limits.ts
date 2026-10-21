import "server-only";
import { countActivities } from "@/lib/db/queries";
import { MAX_PERSONAL_ACTIVITIES } from "@/lib/draft";
import { hitBurstLimit } from "@/lib/rate-limit";

const ADDS_PER_MINUTE = 10;

/**
 * Guards every copy or claim into "my activities": a burst limit per user and the per-account cap.
 * Null when the insert may go ahead.
 */
export async function addBlocked(userId: string): Promise<{ error: "full" } | "limited" | null> {
  if (!(await hitBurstLimit(`add:${userId}`, ADDS_PER_MINUTE, 60_000)).ok) return "limited";
  if ((await countActivities(userId)) >= MAX_PERSONAL_ACTIVITIES) return { error: "full" };
  return null;
}
