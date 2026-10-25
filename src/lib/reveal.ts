"use client";

// The result reveal: an activity that was just generated (or saved after sign-in) opens with its title block settling
// in line by line. The screen before it marks the next activity page; the page takes the mark once. While a saved
// activity loads, its loading screen peeks at the mark to keep showing that wait instead of a skeleton.

const KEY = "aw.reveal";
/** A mark older than this is from a page that never opened (an error, the user left), not for this one. */
const MAX_AGE_MS = 20_000;

/** Which wait the activity follows. */
export type RevealFrom = "generating" | "saving";

export function markReveal(from: RevealFrom) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ at: Date.now(), from }));
  } catch {}
}

function read(): RevealFrom | null {
  try {
    const mark = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as { at?: number; from?: RevealFrom } | null;
    return mark?.at && mark.from && Date.now() - mark.at < MAX_AGE_MS ? mark.from : null;
  } catch {
    return null;
  }
}

/** The pending reveal, left in place for the page itself. */
export function peekReveal(): RevealFrom | null {
  return read();
}

/** True once, for the activity page that follows markReveal(). */
export function takeReveal(): boolean {
  const from = read();
  try {
    sessionStorage.removeItem(KEY);
  } catch {}
  return from !== null;
}
