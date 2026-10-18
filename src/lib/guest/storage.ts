"use client";

import type { Draft } from "@/lib/draft";
import type { ActivityInput, GroupInput } from "@/lib/validate";

// Browser storage helpers (docs/data-model.md "Not in D1"). Every access is guarded:
// storage can be unavailable (private mode, blocked site data).

const KEYS = {
  group: "aw.group",
  activityForm: "aw.activityForm",
  request: "aw.request",
} as const;

function read<T>(store: () => Storage, key: string): T | null {
  try {
    const raw = store().getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(store: () => Storage, key: string, value: unknown) {
  try {
    store().setItem(key, JSON.stringify(value));
  } catch {
    // Ignore: the flow still works for the current page.
  }
}

function remove(store: () => Storage, key: string) {
  try {
    store().removeItem(key);
  } catch {}
}

const local = () => window.localStorage;
const session = () => window.sessionStorage;

export const groupStore = {
  load: () => read<GroupInput>(local, KEYS.group),
  save: (g: GroupInput) => write(local, KEYS.group, g),
};

export const activityFormStore = {
  load: () => read<Partial<ActivityInput>>(session, KEYS.activityForm),
  save: (a: Partial<ActivityInput>) => write(session, KEYS.activityForm, a),
};

export type GenerationRequest = { group: GroupInput; activity: ActivityInput };

export const requestStore = {
  load: () => read<GenerationRequest>(session, KEYS.request),
  save: (r: GenerationRequest) => write(session, KEYS.request, r),
  clear: () => remove(session, KEYS.request),
};

export const draftStore = {
  load: () => read<Draft>(local, "aw.draft"),
  save: (d: Draft) => write(local, "aw.draft", d),
  clear: () => remove(local, "aw.draft"),
};
