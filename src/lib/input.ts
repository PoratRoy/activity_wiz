import type { ActivityInput, GroupInput } from "@/lib/validate";

// Turning untrusted Server Action arguments into typed values, shared by every action. A Server Action can be called
// with any JSON, so nothing here assumes the shape: missing or non-string values become "". Validation (is the value
// allowed?) stays in lib/validate.ts; this only guarantees the types.

/** The value if it is a string, else "". */
export const str = (v: unknown): string => (typeof v === "string" ? v : "");

/** `str`, trimmed. */
export const trimmed = (v: unknown): string => str(v).trim();

/** The value when it is one of `list`, else null. */
export const oneOfOrNull = (list: readonly string[], v: unknown): string | null => (list.includes(str(v)) ? str(v) : null);

/** Trimmed text cut to `max` characters, or null when empty. */
export const textOrNull = (v: unknown, max: number): string | null => trimmed(v).slice(0, max) || null;

const field = (obj: unknown, key: string): unknown => (obj && typeof obj === "object" ? (obj as Record<string, unknown>)[key] : undefined);

export function toGroupInput(v: unknown): GroupInput {
  return {
    movement: str(field(v, "movement")),
    grade: str(field(v, "grade")),
    groupSize: str(field(v, "groupSize")),
    gender: str(field(v, "gender")),
  };
}

/** Games (playTime) have no duration, so it is always "" for them. */
export function toActivityInput(v: unknown): ActivityInput {
  const type = str(field(v, "type"));
  return {
    type,
    subject: str(field(v, "subject")),
    place: str(field(v, "place")),
    duration: type === "playTime" ? "" : str(field(v, "duration")),
    equipment: str(field(v, "equipment")),
    teams: str(field(v, "teams")),
    shabbat: str(field(v, "shabbat")),
    notes: str(field(v, "notes")),
  };
}
