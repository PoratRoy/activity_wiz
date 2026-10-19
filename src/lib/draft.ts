export const TITLE_MAX = 120;
export const BODY_MAX = 20_000;

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

export type GenerateResult =
  | { status: "ok"; id: string }
  | { status: "ok"; draft: Draft }
  | { status: "rate_limited"; retryInSec: number }
  | { status: "trial_expired" | "invalid" | "refused" | "busy" | "error" };
