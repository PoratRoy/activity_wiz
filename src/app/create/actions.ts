"use server";

import { getUserId } from "@/lib/auth/session";
import { updateGroup } from "@/lib/db/queries";
import { hasErrors, validateGroup, type GroupInput } from "@/lib/validate";

/** Saves the signed-in user's one group. Guests keep it in localStorage only. */
export async function saveGroup(group: GroupInput): Promise<{ ok: boolean }> {
  const userId = await getUserId();
  if (!userId) return { ok: true };
  const clean: GroupInput = {
    movement: String(group.movement),
    grade: String(group.grade),
    groupSize: String(group.groupSize),
    gender: String(group.gender),
  };
  if (hasErrors(validateGroup(clean))) return { ok: false };
  await updateGroup(userId, clean);
  return { ok: true };
}
