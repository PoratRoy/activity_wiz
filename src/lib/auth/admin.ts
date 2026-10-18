import "server-only";
import { redirect } from "next/navigation";
import { getEnv } from "@/lib/env";
import { auth } from "./config";

/** Parses ADMIN_EMAILS (a JSON string array). Missing or invalid config means nobody is an admin. */
function adminEmails(): Set<string> {
  try {
    const parsed: unknown = JSON.parse(getEnv().ADMIN_EMAILS ?? "");
    if (!Array.isArray(parsed) || !parsed.every((e) => typeof e === "string")) return new Set();
    return new Set(parsed.map((e) => e.trim().toLowerCase()));
  } catch {
    return new Set();
  }
}

export function isAdmin(user: { email?: string | null; verified?: boolean } | null | undefined): boolean {
  if (!user?.email || !user.verified) return false;
  return adminEmails().has(user.email.trim().toLowerCase());
}

/** For admin pages and actions: returns the admin's user id, or redirects non-admins to "/". */
export async function requireAdmin(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id || !isAdmin(session.user)) redirect("/");
  return session.user.id;
}
