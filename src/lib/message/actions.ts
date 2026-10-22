"use server";

import { unstable_update } from "@/lib/auth/config";
import { getSessionUser } from "@/lib/auth/session";
import { getBroadcastMessage, getUnseenBroadcastMessage, markBroadcastMessageSeen } from "@/lib/db/queries";
import { canSendEmail, multiLine, oneLine, sendEmail } from "@/lib/email";
import { hitRateLimit } from "@/lib/rate-limit";
import { MESSAGE_LIMITS } from "./limits";

export type ShownMessage = { id: string; title: string; body: string; withForm: boolean };

/** Ends this sign-in's message check, so the shell stops asking until the next sign-in. */
async function endCheck() {
  await unstable_update({ user: { checkMessage: false } });
}

/** Called once after sign-in: the current message if this user hasn't dismissed it, else null (and the check ends). */
export async function getMessageToShow(): Promise<ShownMessage | null> {
  const user = await getSessionUser();
  if (!user?.checkMessage) return null;
  const m = await getUnseenBroadcastMessage(user.id);
  if (!m) {
    await endCheck();
    return null;
  }
  return { id: m.id, title: m.title, body: m.body, withForm: m.withForm };
}

/** Confirm, tap outside or Escape: the user won't see this message again. */
export async function dismissMessage(messageId: string): Promise<void> {
  const user = await getSessionUser();
  if (!user || typeof messageId !== "string") return;
  await markBroadcastMessageSeen(user.id, messageId);
  await endCheck();
}

/** Emails the user's reply to the contact address, then dismisses the message. */
export async function sendMessageFeedback(messageId: string, feedback: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "צריך להתחבר" };
  const text = multiLine(feedback).slice(0, MESSAGE_LIMITS.feedback);
  if (!text) return { ok: false, error: "צריך לכתוב משהו" };
  const message = await getBroadcastMessage();
  if (!message || message.id !== messageId || !message.withForm) return { ok: false, error: "ההודעה כבר לא פעילה" };

  if (!canSendEmail()) return { ok: false, error: "שליחה לא זמינה כרגע, נסו שוב מאוחר יותר" };
  const limit = await hitRateLimit(`feedback:${user.id}`, 60_000);
  if (!limit.ok) return { ok: false, error: `אפשר לשלוח שוב בעוד ${limit.retryInSec} שניות` };

  const sent = await sendEmail({
    replyTo: user.email,
    subject: `ActivityWiz – משוב על: ${message.title}`,
    text: `שם: ${oneLine(user.name) || "-"}\nאימייל: ${user.email}\nהודעה: ${message.title}\n\n${text}`,
  });
  if (!sent) return { ok: false, error: "לא הצלחנו לשלוח, נסו שוב" };
  await markBroadcastMessageSeen(user.id, messageId);
  await endCheck();
  return { ok: true };
}
