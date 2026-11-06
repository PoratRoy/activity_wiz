"use server";

import { DURATIONS, EQUIPMENT, GENERIC_TYPE_LABELS, NOTES_MAX, PLACES, SHABBAT, SUBJECT_MAX, TEAMS } from "@/data/options";
import { getUserId } from "@/lib/auth/session";
import { deleteActivity, insertActivity, updateActivity } from "@/lib/db/queries";
import { BODY_MAX, TITLE_MAX, type AddResult, type Draft } from "@/lib/draft";
import { oneOfOrNull, str, textOrNull, trimmed } from "@/lib/input";
import { addBlocked } from "@/lib/personal-limits";
import { hitBurstLimit } from "@/lib/rate-limit";

// Autosave runs at most every 2 seconds while typing; this only stops scripted floods.
const SAVES_PER_MINUTE = 60;
// Deleting is one tap plus a confirmation; this only stops scripted floods.
const DELETES_PER_MINUTE = 30;

/**
 * Saves the guest's current draft to the signed-in account (R13), whether the account is new or existing.
 * Returns the new activity id, { error: "full" } at the cap, or null if not signed in or the draft is unusable.
 */
export async function claimDraft(draft: Draft): Promise<AddResult> {
  const userId = await getUserId();
  if (!userId) return null;
  const title = trimmed(draft?.title).slice(0, TITLE_MAX);
  const bodyMd = str(draft?.bodyMd).slice(0, BODY_MAX);
  if (!title || !bodyMd.trim()) return null;
  const blocked = await addBlocked(userId);
  if (blocked) return blocked === "limited" ? null : blocked;
  const id = await insertActivity(userId, {
    title,
    bodyMd,
    type: str(draft.type) in GENERIC_TYPE_LABELS ? str(draft.type) : null,
    subject: textOrNull(draft.subject, SUBJECT_MAX),
    place: oneOfOrNull(PLACES, draft.place),
    duration: oneOfOrNull(DURATIONS, draft.duration),
    equipment: oneOfOrNull(EQUIPMENT, draft.equipment),
    teams: oneOfOrNull(TEAMS, draft.teams),
    shabbat: oneOfOrNull(SHABBAT, draft.shabbat),
    notes: textOrNull(draft.notes, NOTES_MAX),
  });
  return { id };
}

/** Autosave of a personal activity (R15). Only the owner's row is touched; last write wins. */
export async function saveActivity(id: string, content: { title: string; bodyMd: string }): Promise<boolean> {
  const userId = await getUserId();
  if (!userId) return false;
  const title = trimmed(content?.title).slice(0, TITLE_MAX);
  const bodyMd = str(content?.bodyMd).slice(0, BODY_MAX);
  if (!title) return false;
  if (!(await hitBurstLimit(`save:${userId}`, SAVES_PER_MINUTE, 60_000)).ok) return false;
  return updateActivity(str(id), userId, { title, bodyMd });
}

/** Hard delete (R18). Only the owner's row is touched. */
export async function removeActivity(id: string): Promise<boolean> {
  const userId = await getUserId();
  if (!userId) return false;
  if (!(await hitBurstLimit(`delete:${userId}`, DELETES_PER_MINUTE, 60_000)).ok) return false;
  return deleteActivity(str(id), userId);
}
