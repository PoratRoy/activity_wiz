"use server";

import { isLibraryImage } from "@/data/libraryImages";
import { DURATIONS, EQUIPMENT, GENERIC_TYPE_LABELS, NOTES_MAX, PLACES, SHABBAT, TEAMS } from "@/data/options";
import { requireAdmin } from "@/lib/auth/admin";
import {
  countPublicActivities,
  deleteCategory,
  deletePublicActivity,
  getCategory,
  insertCategory,
  insertPublicActivity,
  setCategoryOrder,
  updateCategoryImage,
} from "@/lib/db/queries";
import { BODY_MAX, TITLE_MAX } from "@/lib/draft";

// Every action re-checks the admin allowlist on the server (R22); non-admins are redirected to "/".

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const ADMIN_SUBJECT_MAX = 60;

/** `image` is a name from LIBRARY_IMAGES, or null for the shared default. */
export async function createCategory(title: string, image: string | null): Promise<{ id: string } | { error: string }> {
  await requireAdmin();
  const t = str(title).slice(0, TITLE_MAX);
  if (!t) return { error: "צריך שם לקטגוריה" };
  return { id: await insertCategory(t, isLibraryImage(image) ? image : null) };
}

export async function setCategoryImage(id: string, image: string | null): Promise<boolean> {
  await requireAdmin();
  if (image !== null && !isLibraryImage(image)) return false;
  return updateCategoryImage(str(id), image);
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
  subject: string;
  place: string;
  duration: string;
  equipment: string;
  teams: string;
  shabbat: string;
  notes: string;
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
  if (!a.subject) e.subject = "שדה חובה";
  else if (a.subject.length > ADMIN_SUBJECT_MAX) e.subject = `עד ${ADMIN_SUBJECT_MAX} תווים`;
  if (!PLACES.includes(a.place)) e.place = "יש לבחור מקום";
  if (!DURATIONS.includes(a.duration)) e.duration = "יש לבחור משך";
  if (a.equipment && !EQUIPMENT.includes(a.equipment)) e.equipment = "יש לבחור אפשרות";
  if (a.teams && !TEAMS.includes(a.teams)) e.teams = "יש לבחור אפשרות";
  if (a.shabbat && !SHABBAT.includes(a.shabbat)) e.shabbat = "יש לבחור אפשרות";
  if (a.notes.length > NOTES_MAX) e.notes = `עד ${NOTES_MAX} תווים`;
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
    subject: str(input?.subject),
    place: str(input?.place),
    duration: str(input?.duration),
    equipment: str(input?.equipment),
    teams: str(input?.teams),
    shabbat: str(input?.shabbat),
    notes: str(input?.notes),
  };
  const errors = validate(a);
  if (Object.keys(errors).length) return { errors };
  if (!(await getCategory(a.categoryId))) return { errors: { categoryId: "הקטגוריה לא קיימת" } };
  const id = await insertPublicActivity(a.categoryId, {
    title: a.title,
    bodyMd: a.bodyMd,
    type: a.type,
    subject: a.subject,
    place: a.place,
    duration: a.duration,
    equipment: a.equipment || null,
    teams: a.teams || null,
    shabbat: a.shabbat || null,
    notes: a.notes || null,
  });
  return { id, categoryId: a.categoryId };
}

export async function removePublicActivity(id: string): Promise<boolean> {
  await requireAdmin();
  await deletePublicActivity(str(id));
  return true;
}
