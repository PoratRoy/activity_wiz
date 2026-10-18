import {
  DURATIONS,
  EQUIPMENT,
  findMovement,
  GENDERS,
  GRADES,
  GROUP_SIZES,
  NOTES_MAX,
  PLACES,
  SHABBAT,
  SUBJECT_MAX,
  TEAMS,
} from "@/data/options";

// Shared by client forms and server actions. Server actions always re-validate.

export type GroupInput = { movement: string; grade: string; groupSize: string; gender: string };

export type ActivityInput = {
  type: string;
  subject: string;
  place: string;
  duration: string;
  equipment: string;
  teams: string;
  shabbat: string;
  notes: string;
};

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const ZERO_WIDTH = /[​-‏‪-‮⁠-⁤﻿]/g;

/** Comparison copy only: NFKC, zero-width chars stripped, lowercase. */
function normalize(text: string): string {
  return text.normalize("NFKC").replace(ZERO_WIDTH, "").toLowerCase();
}

/** True for URLs and bare domains ("x.com", "www.x", "http://"), including spaced-out "x . com". */
export function containsLink(text: string): boolean {
  const t = normalize(text);
  if (/(https?:|ftp:|\/\/|www\s*\.)/.test(t)) return true;
  return /[a-z0-9-]\s*\.\s*(com|net|org|io|co|il|ly|me|app|dev|xyz|info|biz|gg|tv|ru|uk|us|link|site|online|club|top)\b/.test(t);
}

function freeText(value: string, max: number, required: boolean): string | undefined {
  const v = value.trim();
  if (required && v.length === 0) return "שדה חובה";
  if ([...v].length > max) return `עד ${max} תווים`;
  if (containsLink(v)) return "בלי קישורים, רק טקסט";
  return undefined;
}

const oneOf = (list: string[], value: string, optional = false) =>
  (optional && value === "") || list.includes(value) ? undefined : "יש לבחור אפשרות";

export function validateGroup(g: GroupInput): FieldErrors<GroupInput> {
  const errors: FieldErrors<GroupInput> = {};
  if (!findMovement(g.movement)) errors.movement = "יש לבחור תנועה";
  if (oneOf(GRADES, g.grade)) errors.grade = "יש לבחור כיתה";
  if (oneOf(GROUP_SIZES, g.groupSize)) errors.groupSize = "יש לבחור גודל קבוצה";
  if (oneOf(GENDERS, g.gender)) errors.gender = "יש לבחור הרכב";
  return errors;
}

export function validateActivity(a: ActivityInput, movementKey: string): FieldErrors<ActivityInput> {
  const errors: FieldErrors<ActivityInput> = {};
  const movement = findMovement(movementKey);
  if (!movement?.types.some((t) => t.key === a.type)) errors.type = "יש לבחור סוג";
  const subject = freeText(a.subject, SUBJECT_MAX, true);
  if (subject) errors.subject = subject;
  if (oneOf(PLACES, a.place)) errors.place = "יש לבחור מקום";
  if (oneOf(DURATIONS, a.duration)) errors.duration = "יש לבחור משך";
  if (oneOf(EQUIPMENT, a.equipment, true)) errors.equipment = "יש לבחור אפשרות";
  if (oneOf(TEAMS, a.teams, true)) errors.teams = "יש לבחור אפשרות";
  if (oneOf(SHABBAT, a.shabbat, true)) errors.shabbat = "יש לבחור אפשרות";
  const notes = freeText(a.notes, NOTES_MAX, false);
  if (notes) errors.notes = notes;
  return errors;
}

export const hasErrors = (e: object) => Object.keys(e).length > 0;
