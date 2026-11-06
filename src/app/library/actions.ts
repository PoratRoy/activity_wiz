"use server";

import { getUserId } from "@/lib/auth/session";
import { countPublicActivityView, getPublicActivity, insertActivity } from "@/lib/db/queries";
import type { AddResult } from "@/lib/draft";
import { str } from "@/lib/input";
import { addBlocked } from "@/lib/personal-limits";
import { clientIp, hitRateLimit } from "@/lib/rate-limit";
import { parseId } from "@/lib/slug";

// One counted view per IP per activity per day, the same rule the browser keeps (ViewCounter), but enforced here.
const VIEW_WINDOW_MS = 24 * 60 * 60 * 1000;

/** "Save to my activities" (R20): a new, independent personal copy with all activity fields. */
export async function copyPublicActivity(publicId: string): Promise<AddResult> {
  const userId = await getUserId();
  if (!userId) return null;
  const src = await getPublicActivity(str(publicId));
  if (!src) return null;
  const blocked = await addBlocked(userId);
  if (blocked) return blocked === "limited" ? null : blocked;
  const id = await insertActivity(userId, {
    title: src.title,
    bodyMd: src.bodyMd,
    type: src.type,
    subject: src.subject,
    place: src.place,
    duration: src.duration,
    equipment: src.equipment,
    teams: src.teams,
    shabbat: src.shabbat,
    notes: src.notes,
  });
  return { id };
}

/** One view of a public activity page; counted at most once a day per activity and IP. */
export async function countView(publicId: string): Promise<void> {
  const id = parseId(str(publicId));
  if (!id) return;
  if (!(await hitRateLimit(`view:${await clientIp()}:${id}`, VIEW_WINDOW_MS)).ok) return;
  await countPublicActivityView(id);
}
