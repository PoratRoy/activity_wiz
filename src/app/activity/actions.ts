"use server";

import { DURATIONS, EQUIPMENT, GENERIC_TYPE_LABELS, NOTES_MAX, PLACES, SHABBAT, SUBJECT_MAX, TEAMS } from "@/data/options";
import { getUserId } from "@/lib/auth/session";
import { insertActivity } from "@/lib/db/queries";
import { BODY_MAX, TITLE_MAX, type Draft } from "@/lib/draft";

const str = (v: unknown) => (typeof v === "string" ? v : "");
const oneOfOrNull = (list: string[], v: unknown) => (list.includes(str(v)) ? str(v) : null);

/**
 * Saves the guest's current draft to the signed-in account (R13), whether the account is new or existing.
 * Returns the new activity id, or null if not signed in or the draft is unusable.
 */
export async function claimDraft(draft: Draft): Promise<{ id: string } | null> {
  const userId = await getUserId();
  if (!userId) return null;
  const title = str(draft?.title).trim().slice(0, TITLE_MAX);
  const bodyMd = str(draft?.bodyMd).slice(0, BODY_MAX);
  if (!title || !bodyMd.trim()) return null;
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
