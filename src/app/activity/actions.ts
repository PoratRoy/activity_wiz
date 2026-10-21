"use server";

import { DURATIONS, EQUIPMENT, GENERIC_TYPE_LABELS, NOTES_MAX, PLACES, SHABBAT, SUBJECT_MAX, TEAMS } from "@/data/options";
import { getUserId } from "@/lib/auth/session";
import { deleteActivity, insertActivity, updateActivity } from "@/lib/db/queries";
import { BODY_MAX, TITLE_MAX, type AddResult, type Draft } from "@/lib/draft";
import { addBlocked } from "@/lib/personal-limits";
import { hitBurstLimit } from "@/lib/rate-limit";

const str = (v: unknown) => (typeof v === "string" ? v : "");
const oneOfOrNull = (list: string[], v: unknown) => (list.includes(str(v)) ? str(v) : null);

// Autosave runs at most every 2 seconds while typing; this only stops scripted floods.
const SAVES_PER_MINUTE = 60;

/**
 * Saves the guest's current draft to the signed-in account (R13), whether the account is new or existing.
 * Returns the new activity id, { error: "full" } at the cap, or null if not signed in or the draft is unusable.
 */
export async function claimDraft(draft: Draft): Promise<AddResult> {
  const userId = await getUserId();
  if (!userId) return null;
  const title = str(draft?.title).trim().slice(0, TITLE_MAX);
  const bodyMd = str(draft?.bodyMd).slice(0, BODY_MAX);
  if (!title || !bodyMd.trim()) return null;
  const blocked = await addBlocked(userId);
  if (blocked) return blocked === "limited" ? null : blocked;
  const id = await insertActivity(userId, {
    title,
    bodyMd,
    type: str(draft.type) in GENERIC_TYPE_LABELS ? str(draft.type) : null,
    subject: str(draft.subject).trim().slice(0, SUBJECT_MAX) || null,
    place: oneOfOrNull(PLACES, draft.place),
    duration: oneOfOrNull(DURATIONS, draft.duration),
    equipment: oneOfOrNull(EQUIPMENT, draft.equipment),
    teams: oneOfOrNull(TEAMS, draft.teams),
    shabbat: oneOfOrNull(SHABBAT, draft.shabbat),
    notes: str(draft.notes).trim().slice(0, NOTES_MAX) || null,
  });
  return { id };
}

/** Autosave of a personal activity (R15). Only the owner's row is touched; last write wins. */
export async function saveActivity(id: string, content: { title: string; bodyMd: string }): Promise<boolean> {
  const userId = await getUserId();
  if (!userId) return false;
  const title = str(content?.title).trim().slice(0, TITLE_MAX);
  const bodyMd = str(content?.bodyMd).slice(0, BODY_MAX);
  if (!title) return false;
  if (!(await hitBurstLimit(`save:${userId}`, SAVES_PER_MINUTE, 60_000)).ok) return false;
  return updateActivity(str(id), userId, { title, bodyMd });
}

/** Hard delete (R18). Only the owner's row is touched. */
export async function removeActivity(id: string): Promise<boolean> {
  const userId = await getUserId();
  if (!userId) return false;
  return deleteActivity(str(id), userId);
}
