"use client";

import { useEffect } from "react";
import { countView } from "../../actions";

const KEY = "aw.viewed";
const DAY = 24 * 60 * 60 * 1000;

/** True when this browser counted the activity in the last day; otherwise remembers it now. Old entries are dropped. */
function seenToday(id: string): boolean {
  try {
    const now = Date.now();
    const seen = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, number>;
    const recent = Object.fromEntries(Object.entries(seen).filter(([, at]) => now - at < DAY));
    if (recent[id]) return true;
    localStorage.setItem(KEY, JSON.stringify({ ...recent, [id]: now }));
    return false;
  } catch {
    return false;
  }
}

/** Counts one view of a public activity after the page opens (direct links too; bots without JS don't count). */
export function ViewCounter({ publicId }: { publicId: string }) {
  useEffect(() => {
    if (!seenToday(publicId)) void countView(publicId).catch(() => {});
  }, [publicId]);
  return null;
}
