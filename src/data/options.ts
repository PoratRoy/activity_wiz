import movementsJson from "./movements.json";

// Exact form choices from docs/product.md ("Form choices"). Stored values are the Hebrew labels,
// except movement and type, which store their keys.

export type TypeKey = "content" | "pointOfView" | "survival" | "playTime";
export type Movement = { key: string; label: string; types: { key: TypeKey; label: string }[] };

export const MOVEMENTS = movementsJson as Movement[];

export const GRADES = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ז׳", "ח׳", "ט׳", "י׳", "י״א", "י״ב"].map((g) => `כיתה ${g}`);
export const GROUP_SIZES = ["1-5", "5-10", "10-20", "20-30", "30+"];
export const GENDERS = ["בנים", "בנות", "מעורב"];

export const PLACES = ["לא משנה", "במקום סגור", "במקום פתוח"];
export const DURATIONS = ["חצי שעה", "שעה", "שעה וחצי"];
export const DURATION_MINUTES: Record<string, number> = { "חצי שעה": 30, "שעה": 60, "שעה וחצי": 90 };

export const EQUIPMENT = ["לא משנה", "ללא ציוד"];
export const TEAMS = ["לא משנה", "עם חלוקה לקבוצות", "ללא חלוקה לקבוצות"];
export const SHABBAT = ["לא משנה", "מותאם לשומרי שבת"];

/** Generic type labels, used where no movement applies (admin form, chips on copies). */
export const GENERIC_TYPE_LABELS: Record<TypeKey, string> = {
  content: "פעולת תוכן",
  pointOfView: "נקודת מבט",
  survival: "הישרדות",
  playTime: "משחק",
};

export const SUBJECT_MAX = 21;
export const NOTES_MAX = 1000;

export function findMovement(key: string | null | undefined): Movement | undefined {
  return MOVEMENTS.find((m) => m.key === key);
}

/** Keeps `current` if the movement offers it, otherwise the movement's first type. */
export function resolveType(movementKey: string | null | undefined, current: string | null | undefined): TypeKey | null {
  const m = findMovement(movementKey);
  if (!m) return null;
  return m.types.find((t) => t.key === current)?.key ?? m.types[0].key;
}

export function typeLabel(movementKey: string | null | undefined, typeKey: string | null | undefined): string | null {
  if (!typeKey) return null;
  return (
    findMovement(movementKey)?.types.find((t) => t.key === typeKey)?.label ??
    GENERIC_TYPE_LABELS[typeKey as TypeKey] ??
    null
  );
}

/** Chips shown under an activity's title, e.g. "זמן: חצי שעה". Missing values are skipped. */
export function activityChips(type: string | null, place: string | null | undefined, duration: string | null | undefined): string[] {
  return [
    type ? `סוג: ${type}` : null,
    place ? `מקום: ${place}` : null,
    duration ? `זמן: ${duration}` : null,
  ].filter((c): c is string => !!c);
}

export const asOptions = (values: string[]) => values.map((v) => ({ value: v, label: v }));
