"use client";

// What this browser remembers about the terms. The server's record (guest cookie or users.terms_accepted_at) is the
// one that counts; these keys only decide what to show, so blocked storage is harmless.

/** Set when the terms were accepted in this browser. The old blocking popup used the same key. */
const ACCEPTED_KEY = "aw.termsAccepted";
/** Set when the notice card was closed with «הבנתי». */
const NOTICE_KEY = "aw.termsNotice";

function has(key: string): boolean {
  try {
    return !!localStorage.getItem(key);
  } catch {
    return false;
  }
}

function set(key: string) {
  try {
    localStorage.setItem(key, new Date().toISOString());
  } catch {}
}

export const acceptedInThisBrowser = () => has(ACCEPTED_KEY);
export const rememberAccepted = () => set(ACCEPTED_KEY);
export const noticeDismissed = () => has(NOTICE_KEY);
export const dismissNotice = () => set(NOTICE_KEY);
