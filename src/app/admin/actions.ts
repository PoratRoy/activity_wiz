"use server";

import { CATEGORY_KEY_PATTERN } from "@/data/libraryImages";
import { AGES, DURATIONS, EQUIPMENT, GENERIC_TYPE_LABELS, NOTES_MAX, PLACES, SHABBAT, TEAMS } from "@/data/options";
import { requireAdmin } from "@/lib/auth/admin";
import {
  countPublicActivities,
  deleteCategory,
  deletePublicActivity,
  getCategory,
  insertCategory,
  insertPublicActivity,
  sendBroadcastMessage,
  categoryKeyTaken,
  setCategoryOrder,
  updateCategoryKey,
} from "@/lib/db/queries";
import { BODY_MAX, TITLE_MAX } from "@/lib/draft";
import { MESSAGE_LIMITS } from "@/lib/message/limits";

// Every action re-checks the admin allowlist on the server (R22); non-admins are redirected to "/".

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Error message for an invalid or duplicate English key, or null when it can be used. */
async function keyError(key: string, exceptId?: string): Promise<string | null> {
  if (!key) return "צריך שם באנגלית";
  if (!CATEGORY_KEY_PATTERN.test(key)) return "רק אותיות באנגלית, ספרות, - ו-_, ומתחיל באות";
  if (await categoryKeyTaken(key, exceptId)) return "השם באנגלית כבר בשימוש";
  return null;
}

/** `key` is the English name; it also picks the category's artwork (src/data/libraryImages.ts). */
export async function createCategory(title: string, key: string): Promise<{ id: string } | { error: string }> {
  await requireAdmin();
  const t = str(title).slice(0, TITLE_MAX);
  if (!t) return { error: "צריך שם לקטגוריה" };
  const k = str(key);
  const error = await keyError(k);
  if (error) return { error };
  return { id: await insertCategory(t, k) };
}

export async function setCategoryKey(id: string, key: string): Promise<{ ok: true } | { error: string }> {
  await requireAdmin();
  const k = str(key);
  const error = await keyError(k, str(id));
  if (error) return { error };
  return (await updateCategoryKey(str(id), k)) ? { ok: true } : { error: "הקטגוריה לא נמצאה" };
}

/** Deletes the category and (FK cascade) its public activities. Personal copies are unaffected (R23). */
export async function removeCategory(id: string): Promise<boolean> {
  await requireAdmin();
  await deleteCategory(str(id));
  return true;
}

/** Saves the category order shown on /admin and in the library. False when the list is stale. */
export async function reorderCategories(ids: string[]): Promise<boolean> {
  await requireAdmin();
  if (!Array.isArray(ids)) return false;
  return setCategoryOrder(ids.map(str));
}

export async function categoryActivityCount(id: string): Promise<number> {
  await requireAdmin();
  return countPublicActivities(str(id));
}

export type PublicActivityInput = {
  categoryId: string;
  title: string;
  bodyMd: string;
  type: string;
  place: string;
  duration: string;
  equipment: string;
  teams: string;
  shabbat: string;
  notes: string;
  age: string;
};

export type FieldErrors = Partial<Record<keyof PublicActivityInput, string>>;

function validate(a: PublicActivityInput): FieldErrors {
  const e: FieldErrors = {};
  if (!a.categoryId) e.categoryId = "יש לבחור קטגוריה";
  if (!a.title) e.title = "שדה חובה";
  else if (a.title.length > TITLE_MAX) e.title = `עד ${TITLE_MAX} תווים`;
  if (!a.bodyMd) e.bodyMd = "שדה חובה";
  else if (a.bodyMd.length > BODY_MAX) e.bodyMd = `עד ${BODY_MAX} תווים`;
  if (!(a.type in GENERIC_TYPE_LABELS)) e.type = "יש לבחור סוג";
  if (!PLACES.includes(a.place)) e.place = "יש לבחור מקום";
  if (!DURATIONS.includes(a.duration)) e.duration = "יש לבחור משך";
  if (a.equipment && !EQUIPMENT.includes(a.equipment)) e.equipment = "יש לבחור אפשרות";
  if (a.teams && !TEAMS.includes(a.teams)) e.teams = "יש לבחור אפשרות";
  if (a.shabbat && !SHABBAT.includes(a.shabbat)) e.shabbat = "יש לבחור אפשרות";
  if (a.notes.length > NOTES_MAX) e.notes = `עד ${NOTES_MAX} תווים`;
  if (!AGES.includes(a.age)) e.age = "יש לבחור גיל";
  return e;
}

/** Publishes a public activity (R24). Same shape as an AI activity; no AI involved. */
export async function createPublicActivity(input: PublicActivityInput): Promise<{ id: string; categoryId: string } | { errors: FieldErrors }> {
  await requireAdmin();
  const a: PublicActivityInput = {
    categoryId: str(input?.categoryId),
    title: str(input?.title),
    bodyMd: typeof input?.bodyMd === "string" ? input.bodyMd.replace(/\r\n/g, "\n").trim() : "",
    type: str(input?.type),
    place: str(input?.place),
    duration: str(input?.duration),
    equipment: str(input?.equipment),
    teams: str(input?.teams),
    shabbat: str(input?.shabbat),
    notes: str(input?.notes),
    age: str(input?.age),
  };
  const errors = validate(a);
  if (Object.keys(errors).length) return { errors };
  if (!(await getCategory(a.categoryId))) return { errors: { categoryId: "הקטגוריה לא קיימת" } };
  const id = await insertPublicActivity(a.categoryId, {
    title: a.title,
    bodyMd: a.bodyMd,
    type: a.type,
    // Public activities have no separate subject field; the title stands in for it.
    subject: a.title,
    place: a.place,
    duration: a.duration,
    equipment: a.equipment || null,
    teams: a.teams || null,
    shabbat: a.shabbat || null,
    notes: a.notes || null,
    age: a.age,
  });
  return { id, categoryId: a.categoryId };
}

export async function removePublicActivity(id: string): Promise<boolean> {
  await requireAdmin();
  await deletePublicActivity(str(id));
  return true;
}

/** Replaces the broadcast message; every signed-in user sees it once, at their next sign-in (docs/screens.md). */
export async function sendMessageToUsers(input: { title: string; body: string; withForm: boolean }): Promise<{ ok: true } | { error: string }> {
  await requireAdmin();
  const title = str(input?.title).slice(0, MESSAGE_LIMITS.title);
  const body = str(input?.body).replace(/\r\n?/g, "\n").slice(0, MESSAGE_LIMITS.body);
  if (!title) return { error: "צריך כותרת" };
  if (!body) return { error: "צריך תוכן להודעה" };
  await sendBroadcastMessage({ title, body, withForm: input?.withForm === true });
  return { ok: true };
}
