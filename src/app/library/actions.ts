"use server";

import { getUserId } from "@/lib/auth/session";
import { countPublicActivityView, getPublicActivity, insertActivity } from "@/lib/db/queries";
import type { AddResult } from "@/lib/draft";
import { addBlocked } from "@/lib/personal-limits";
import { parseId } from "@/lib/slug";

/** "Save to my activities" (R20): a new, independent personal copy with all activity fields. */
export async function copyPublicActivity(publicId: string): Promise<AddResult> {
  const userId = await getUserId();
  if (!userId) return null;
  const src = await getPublicActivity(String(publicId));
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

/** One view of a public activity page; the browser sends it at most once a day per activity. */
export async function countView(publicId: string): Promise<void> {
  const id = parseId(String(publicId));
  if (id) await countPublicActivityView(id);
}
