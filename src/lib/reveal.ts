"use client";

// The result reveal: an activity that was just generated (or saved after sign-in) opens with its title block settling
// in line by line. The screen before it marks the next activity page; that page takes the mark once.

const KEY = "aw.reveal";
/** A mark older than this is from a page that never opened (an error, the user left), not for this one. */
const MAX_AGE_MS = 20_000;

export function markReveal() {
  try {
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {}
}

/** True once, for the activity page that follows markReveal(). */
export function takeReveal(): boolean {
  try {
    const at = Number(sessionStorage.getItem(KEY));
    sessionStorage.removeItem(KEY);
    return at > 0 && Date.now() - at < MAX_AGE_MS;
  } catch {
    return false;
  }
}
