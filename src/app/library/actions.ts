"use server";

import { getUserId } from "@/lib/auth/session";
import { getPublicActivity, insertActivity } from "@/lib/db/queries";

/** "Save to my activities" (R20): a new, independent personal copy with all activity fields. */
export async function copyPublicActivity(publicId: string): Promise<{ id: string } | null> {
  const userId = await getUserId();
  if (!userId) return null;
  const src = await getPublicActivity(String(publicId));
  if (!src) return null;
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
