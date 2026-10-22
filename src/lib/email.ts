import "server-only";
import { getEnv } from "@/lib/env";

/** One line of text: control characters (newlines included) become spaces, runs of spaces collapse. */
export const oneLine = (v: unknown) => String(v ?? "").replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g, " ").replace(/\s+/g, " ").trim();
/** Multi-line text: keeps line breaks and tabs, drops other control characters. */
export const multiLine = (v: unknown) => String(v ?? "").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b-\u001f\u007f-\u009f]/g, "").trim();

/** Whether emails can be sent at all (RESEND_API_KEY is set). */
export function canSendEmail(): boolean {
  if (getEnv().RESEND_API_KEY) return true;
  console.error("sendEmail: RESEND_API_KEY is not set");
  return false;
}

/** Sends a plain-text email to CONTACT_TO_EMAIL through Resend (docs/architecture.md). Returns false on failure. */
export async function sendEmail(p: { subject: string; text: string; replyTo: string }): Promise<boolean> {
  const env = getEnv();
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL || "ActivityWiz <onboarding@resend.dev>",
      to: [env.CONTACT_TO_EMAIL || "porat.roy@gmail.com"],
      reply_to: p.replyTo,
      subject: p.subject,
      text: p.text,
    }),
  }).catch((e: unknown) => {
    console.error("sendEmail: network error", e);
    return null;
  });
  if (!res?.ok) {
    console.error("sendEmail: Resend error", res?.status, await res?.text().catch(() => ""));
    return false;
  }
  return true;
}
