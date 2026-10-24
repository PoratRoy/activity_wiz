"use server";

import { generateWithGemini } from "@/lib/ai/gemini";
import { getAccountGroup, getUserId } from "@/lib/auth/session";
import { countActivities, insertActivity, updateGroup } from "@/lib/db/queries";
import { AI_DISCLAIMER, BODY_MAX, MAX_PERSONAL_ACTIVITIES, TITLE_MAX, type GenerateResult } from "@/lib/draft";
import { ensureGuest, isTrialExpired, writeGuest, type Guest } from "@/lib/guest/cookie";
import { clientIp, hitBurstLimit, hitRateLimit } from "@/lib/rate-limit";
import { hasErrors, removeLinks, validateActivity, validateGroup, type ActivityInput, type GroupInput } from "@/lib/validate";
import { buildGeneration } from "@/prompts/build";

/** Saves the signed-in user's one group. Guests keep it in localStorage only. */
export async function saveGroup(group: GroupInput): Promise<{ ok: boolean }> {
  const userId = await getUserId();
  if (!userId) return { ok: true };
  const clean: GroupInput = {
    movement: String(group.movement),
    grade: String(group.grade),
    groupSize: String(group.groupSize),
    gender: String(group.gender),
  };
  if (hasErrors(validateGroup(clean))) return { ok: false };
  await updateGroup(userId, clean);
  return { ok: true };
}

// Generation attempts per IP per minute, valid or not. A whole branch can share one IP, so this is
// a flood guard; the 30-second window per user or guest is the real limit.
const IP_ATTEMPTS_PER_MINUTE = 20;

const orNull = (v: string) => (v.trim() === "" ? null : v.trim());

/**
 * Generates one activity (docs/ai.md "Flow"). Registered users get a saved row; guests get a draft
 * that the client keeps in localStorage.
 */
export async function generateActivity(input: { group: GroupInput; activity: ActivityInput }): Promise<GenerateResult> {
  // 0. Cheap per-IP guard before any other work, so invalid or cookieless floods are throttled too.
  const ipLimit = await hitBurstLimit(`ip:gen:${await clientIp()}`, IP_ATTEMPTS_PER_MINUTE, 60_000);
  if (!ipLimit.ok) return { status: "rate_limited", retryInSec: ipLimit.retryInSec };

  // 1. Identify the caller.
  const userId = await getUserId();
  let guest: Guest | null = null;
  let group: GroupInput;
  if (userId) {
    group = (await getAccountGroup()) ?? pickGroup(input.group);
  } else {
    guest = await ensureGuest();
    // 2. Trial check (R3).
    if (isTrialExpired(guest)) return { status: "trial_expired" };
    group = pickGroup(input.group);
  }

  // 3. Validate.
  const activity = pickActivity(input.activity);
  if (hasErrors(validateGroup(group)) || hasErrors(validateActivity(activity, group.movement))) {
    return { status: "invalid" };
  }

  // The saved list is capped; don't spend a Gemini call that can't be stored.
  if (userId && (await countActivities(userId)) >= MAX_PERSONAL_ACTIVITIES) return { status: "list_full" };

  // 4. Rate limit: every admitted attempt counts (R7, R8).
  const limit = await hitRateLimit(userId ? `u:${userId}` : `g:${guest!.id}`);
  if (!limit.ok) return { status: "rate_limited", retryInSec: limit.retryInSec };

  // 5. The guest's 3-day trial starts at the first generation (R1).
  if (guest && !guest.trialStart) await writeGuest({ ...guest, trialStart: Date.now() });

  // 6-7. One Gemini call.
  const generation = buildGeneration(group, activity);
  const outcome = await generateWithGemini(generation);
  if (outcome.kind === "refused") return { status: "refused" };
  if (outcome.kind === "busy") return { status: "busy" };
  if (outcome.kind === "error") {
    console.error("generateActivity failed:", outcome.reason);
    return { status: "error" };
  }
  const result = generation.parse(outcome.json);
  if (!result) {
    console.error("generateActivity failed: schema mismatch");
    return { status: "error" };
  }

  // 8. Never trust the model's output: no links, one-line title, both within the stored limits.
  const title = removeLinks(result.title).replace(/\s+/g, " ").trim().slice(0, TITLE_MAX);
  // Room is kept for the AI disclaimer, which ends every generated body.
  const generated = removeLinks(result.bodyMd).slice(0, BODY_MAX - AI_DISCLAIMER.length - 2).trim();
  if (!title || !generated) {
    console.error("generateActivity failed: empty after cleaning");
    return { status: "error" };
  }
  const bodyMd = `${generated}\n\n${AI_DISCLAIMER}`;

  // 9. Persist.
  const content = {
    title,
    bodyMd,
    type: activity.type,
    subject: activity.subject.trim(),
    place: activity.place,
    duration: activity.type === "playTime" ? null : activity.duration,
    equipment: orNull(activity.equipment),
    teams: orNull(activity.teams),
    shabbat: orNull(activity.shabbat),
    notes: orNull(activity.notes),
  };
  if (userId) return { status: "ok", id: await insertActivity(userId, content) };
  return { status: "ok", draft: { ...content, createdAt: Date.now() } };
}

function pickGroup(g: GroupInput): GroupInput {
  return { movement: String(g?.movement ?? ""), grade: String(g?.grade ?? ""), groupSize: String(g?.groupSize ?? ""), gender: String(g?.gender ?? "") };
}

function pickActivity(a: ActivityInput): ActivityInput {
  const s = (v: unknown) => (typeof v === "string" ? v : "");
  return {
    type: s(a?.type),
    subject: s(a?.subject),
    place: s(a?.place),
    duration: a?.type === "playTime" ? "" : s(a?.duration),
    equipment: s(a?.equipment),
    teams: s(a?.teams),
    shabbat: s(a?.shabbat),
    notes: s(a?.notes),
  };
}
