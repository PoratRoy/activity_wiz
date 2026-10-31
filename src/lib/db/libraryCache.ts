import "server-only";
import { cache } from "react";
import { getCategory, getPublicActivityWithCategory, listCategories, listPublicActivities, listTopPublicActivities } from "./queries";

// The public library as visitors see it, kept in this Worker instance's memory for a minute, so repeat visits skip D1.
// Each instance has its own copy: an admin edit clears the copy of the instance that handled it, and the others catch up
// within TTL_MS. Admin pages read D1 directly, so the admin always sees their own edits. Only finished results are
// stored: a pending D1 promise must not be awaited by another request (Workers can hang on that).

const TTL_MS = 60_000;
const MAX_ENTRIES = 500;

const store = new Map<string, { at: number; value: unknown }>();

function remember<A extends unknown[], R>(name: string, load: (...args: A) => Promise<R>): (...args: A) => Promise<R> {
  return cache(async (...args: A) => {
    const key = `${name}:${JSON.stringify(args)}`;
    const hit = store.get(key);
    if (hit && Date.now() - hit.at < TTL_MS) return hit.value as R;
    const value = await load(...args);
    if (store.size >= MAX_ENTRIES) store.clear();
    store.set(key, { at: Date.now(), value });
    return value;
  });
}

/** Drops every remembered library read in this instance; called after admin edits. */
export function forgetLibrary() {
  store.clear();
}

export const cachedListCategories = remember("categories", listCategories);
export const cachedGetCategory = remember("category", getCategory);
export const cachedListPublicActivities = remember("activities", listPublicActivities);
export const cachedListTopPublicActivities = remember("top", listTopPublicActivities);
export const cachedGetPublicActivityWithCategory = remember("activity", getPublicActivityWithCategory);
