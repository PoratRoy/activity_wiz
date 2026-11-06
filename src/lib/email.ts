import "server-only";
import { getEnv } from "@/lib/env";

/** One line of text: control characters (newlines included) become spaces, runs of spaces collapse. */
export const oneLine = (v: unknown) => String(v ?? "").replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g, " ").replace(/\s+/g, " ").trim();
/** Multi-line text: keeps line breaks and tabs, drops other control characters. */
export const multiLine = (v: unknown) => String(v ?? "").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b-\u001f\u007f-\u009f]/g, "").trim();

/** Whether emails can be sent at all: the Resend key and both addresses are configured (wrangler.jsonc, secrets). */
export function canSendEmail(): boolean {
  const env = getEnv();
  const missing = (["RESEND_API_KEY", "CONTACT_FROM_EMAIL", "CONTACT_TO_EMAIL"] as const).filter((k) => !env[k]);
  if (missing.length === 0) return true;
  console.error(`sendEmail: not configured, missing ${missing.join(", ")}`);
  return false;
}

/** Sends a plain-text email to CONTACT_TO_EMAIL through Resend (docs/architecture.md). Returns false on failure. */
export async function sendEmail(p: { subject: string; text: string; replyTo: string }): Promise<boolean> {
  const env = getEnv();
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
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
