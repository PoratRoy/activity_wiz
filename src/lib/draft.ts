export const TITLE_MAX = 120;
export const BODY_MAX = 20_000;
/** Most activities one account can keep in "my activities". */
export const MAX_PERSONAL_ACTIVITIES = 200;
/** Shown while generating, and appended to the end of every generated activity's body. */
export const AI_DISCLAIMER =
  "שימו לב: התוכן מבוסס בינה מלאכותית והוא בגדר הצעה בלבד – עברו על הפעולה, התאימו אותה לצרכים שלכם והבטיחו שהיא בטוחה ומתאימה לשטח.";
export const LIST_FULL_MESSAGE = `הגעתם ל-${MAX_PERSONAL_ACTIVITIES} פעולות שמורות. מחקו פעולות ישנות כדי לשמור חדשות`;

// The guest's generated activity, kept in localStorage['aw.draft'] (docs/data-model.md).
export type Draft = {
  title: string;
  bodyMd: string;
  type: string;
  subject: string;
  place: string;
  duration: string | null; // null for games (playTime has no duration)
  equipment: string | null;
  teams: string | null;
  shabbat: string | null;
  notes: string | null;
  createdAt: number;
};

/** Result of adding to "my activities": the new id, "full" at the cap, or null on any other failure. */
export type AddResult = { id: string } | { error: "full" } | null;

export type GenerateResult =
  | { status: "ok"; id: string }
  | { status: "ok"; draft: Draft }
  | { status: "rate_limited"; retryInSec: number }
  | { status: "trial_expired" | "invalid" | "refused" | "busy" | "error" | "list_full" };
