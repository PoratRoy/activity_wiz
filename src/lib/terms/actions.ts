"use server";

import { getUserId } from "@/lib/auth/session";
import { ensureGuest, writeGuest } from "@/lib/guest/cookie";

/**
 * Records that the visitor accepted the terms (docs/product.md R0). Signed-in users accepted when they signed in
 * (users.terms_accepted_at), so only guests need a record: the time goes into their signed guest cookie, which the
 * server checks before every generation and which lasts a year.
 */
export async function acceptTerms(): Promise<boolean> {
  if (await getUserId()) return true;
  const guest = await ensureGuest();
  if (!guest.termsAt) await writeGuest({ ...guest, termsAt: Date.now() });
  return true;
}
