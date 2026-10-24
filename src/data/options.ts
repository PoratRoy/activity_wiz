import type { ChipItem } from "@/components/Chip/Chip";
import movementsJson from "./movements.json";

// Exact form choices from docs/product.md ("Form choices"). Stored values are the Hebrew labels,
// except movement and type, which store their keys.

export type TypeKey = "content" | "pointOfView" | "survival" | "playTime";
/** groupTerm: what the movement calls its group (used in the prompt). */
export type Movement = { key: string; label: string; groupTerm: string; types: { key: TypeKey; label: string }[] };

export const MOVEMENTS = movementsJson as Movement[];

export const GRADES = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ז׳", "ח׳", "ט׳", "י׳", "י״א", "י״ב"].map((g) => `כיתה ${g}`);
export const GROUP_SIZES = ["1-5", "5-10", "10-20", "20-30", "30+"];
export const GENDERS = ["בנים", "בנות", "מעורב"];

export const PLACES = ["במקום סגור", "במקום פתוח", "לא משנה"];
export const DURATIONS = ["חצי שעה", "שעה", "שעה וחצי"];
export const DURATION_MINUTES: Record<string, number> = { "חצי שעה": 30, "שעה": 60, "שעה וחצי": 90 };
/** Upper bound of each group-size range, for prompt rules that depend on the number of participants. */
export const GROUP_SIZE_MAX: Record<string, number> = { "1-5": 5, "5-10": 10, "10-20": 20, "20-30": 30, "30+": 35 };

export const EQUIPMENT = ["לא משנה", "ללא ציוד"];
/** Which ages a library activity fits. Public activities only: saving a copy doesn't carry it. */
export const AGES = ["לא משנה", "שכבה צעירה", "שכבה בוגרת"];
export const ANY_AGE = "לא משנה";
export const TEAMS = ["לא משנה", "עם חלוקה לקבוצות", "ללא חלוקה לקבוצות"];
export const SHABBAT = ["לא משנה", "מותאם לשומרי שבת"];
/** Values the create form's switches store when on; off stores "" (no preference). */
export const NO_EQUIPMENT = "ללא ציוד";
export const NO_TEAMS = "ללא חלוקה לקבוצות";
export const SHABBAT_OBSERVANT = "מותאם לשומרי שבת";

/** Generic type labels, used where no movement applies (admin form, chips on copies). */
export const GENERIC_TYPE_LABELS: Record<TypeKey, string> = {
  content: "פעולה",
  pointOfView: "פעולת דיון",
  survival: "מיומנות שטח",
  playTime: "משחק",
};

export const SUBJECT_MAX = 21;
/** Notes are limited by words; NOTES_MAX is only a hard character cap (about 200 long Hebrew words). */
export const NOTES_MAX_WORDS = 200;
export const NOTES_MAX = 1500;

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

/** A "no preference" answer says nothing about the activity, so it never becomes a chip. */
const NO_PREFERENCE = "לא משנה";
export const shown = (v: string | null | undefined) => (v && v !== NO_PREFERENCE ? v : null);

/** Type, place, length and (library only) age as bare values, each tagged with its kind so a page can show an icon
 * instead of a label. Missing and "לא משנה" values are left empty, and ChipRow skips them. */
export function activityDetailChips(
  type: string | null,
  place: string | null | undefined,
  duration: string | null | undefined,
  age?: string | null,
): ChipItem[] {
  return [
    { label: shown(type) ?? "", kind: "type" },
    { label: shown(place) ?? "", kind: "place" },
    { label: shown(duration) ?? "", kind: "duration" },
    { label: shown(age) ?? "", kind: "age" },
  ];
}

export const asOptions = (values: string[]) => values.map((v) => ({ value: v, label: v }));
