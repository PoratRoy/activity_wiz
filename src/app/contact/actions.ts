"use server";

import { headers } from "next/headers";
import { getSessionUser } from "@/lib/auth/session";
import { getEnv } from "@/lib/env";
import { hitRateLimit } from "@/lib/rate-limit";
import { CONTACT_LIMITS } from "./limits";

export type ContactResult = { ok: true } | { ok: false; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Sends a contact message to CONTACT_TO_EMAIL through Resend (docs/architecture.md). */
export async function sendContactMessage(input: { email: string; name: string; message: string; website?: string }): Promise<ContactResult> {
  // Honeypot: real users never see or fill this field.
  if (input?.website) return { ok: true };

  const user = await getSessionUser();
  const email = (user?.email ?? String(input?.email ?? "")).trim().slice(0, 200);
  const name = String(input?.name ?? "").trim().slice(0, CONTACT_LIMITS.name);
  const message = String(input?.message ?? "").trim().slice(0, CONTACT_LIMITS.message);
  if (!EMAIL.test(email)) return { ok: false, error: "כתובת האימייל לא תקינה" };
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
