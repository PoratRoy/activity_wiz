"use server";

import { headers } from "next/headers";
import { getSessionUser } from "@/lib/auth/session";
import { getEnv } from "@/lib/env";
import { hitRateLimit } from "@/lib/rate-limit";
import { CONTACT_LIMITS } from "./limits";

export type ContactResult = { ok: true } | { ok: false; error: string };

// One address, no display name or list: no spaces, quotes, brackets, commas or semicolons; a letter TLD.
const EMAIL = /^[^\s@"<>(),;:\\]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i;
const EMAIL_MAX = 254;

/** One line of text: control characters (newlines included) become spaces, runs of spaces collapse. */
const oneLine = (v: unknown) => String(v ?? "").replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g, " ").replace(/\s+/g, " ").trim();
/** Multi-line text: keeps line breaks and tabs, drops other control characters. */
const multiLine = (v: unknown) => String(v ?? "").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b-\u001f\u007f-\u009f]/g, "").trim();

/** Sends a contact message to CONTACT_TO_EMAIL through Resend (docs/architecture.md). */
export async function sendContactMessage(input: { email: string; name: string; message: string; website?: string }): Promise<ContactResult> {
  // Honeypot: real users never see or fill this field.
  if (input?.website) return { ok: true };

  const user = await getSessionUser();
  const email = oneLine(user?.email ?? input?.email);
  const name = oneLine(input?.name).slice(0, CONTACT_LIMITS.name);
  const message = multiLine(input?.message).slice(0, CONTACT_LIMITS.message);
  if (email.length > EMAIL_MAX || !EMAIL.test(email)) return { ok: false, error: "כתובת האימייל לא תקינה" };
  if (!name) return { ok: false, error: "צריך למלא שם" };
  if (!message) return { ok: false, error: "צריך לכתוב הודעה" };

  const env = getEnv();
  if (!env.RESEND_API_KEY) {
    console.error("sendContactMessage: RESEND_API_KEY is not set");
    return { ok: false, error: "שליחת הודעות לא זמינה כרגע, נסו שוב מאוחר יותר" };
  }

  const h = await headers();
  const ip = h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = await hitRateLimit(`contact:${ip}`, 60_000);
  if (!limit.ok) return { ok: false, error: `אפשר לשלוח הודעה נוספת בעוד ${limit.retryInSec} שניות` };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL || "ActivityWiz <onboarding@resend.dev>",
      to: [env.CONTACT_TO_EMAIL || "porat.roy@gmail.com"],
      reply_to: email,
      subject: `ActivityWiz – הודעה חדשה מ${name}`,
      text: `שם: ${name}\nאימייל: ${email}\nמשתמש רשום: ${user ? "כן" : "לא"}\n\n${message}`,
    }),
  }).catch((e: unknown) => {
    console.error("sendContactMessage: network error", e);
    return null;
  });
  if (!res?.ok) {
    console.error("sendContactMessage: Resend error", res?.status, await res?.text().catch(() => ""));
    return { ok: false, error: "לא הצלחנו לשלוח, נסו שוב" };
  }
  return { ok: true };
}
