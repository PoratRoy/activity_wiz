import "server-only";
import { cache } from "react";
import type { Viewer } from "@/components/AppShell/viewer";
import { accountGroupOf, getUser } from "@/lib/db/queries";
import type { GroupInput } from "@/lib/validate";
import { isAdmin } from "./admin";
import { auth } from "./config";

/** Decrypts the session cookie once per server request; the layouts and the page share the result. */
export const getSessionUser = cache(async () => {
  const session = await auth();
  return session?.user?.id ? session.user : null;
});

export async function getUserId(): Promise<string | null> {
  return (await getSessionUser())?.id ?? null;
}

/** What the shell needs to render the avatar, admin link and tab lock. */
export async function getViewer(): Promise<Viewer> {
  const user = await getSessionUser();
  if (!user) return { signedIn: false };
  return { signedIn: true, name: user.name, image: user.image, isAdmin: isAdmin(user), checkMessage: user.checkMessage };
}

/** The signed-in user's saved group, or null (guest or not filled yet). Read from the session cookie; sessions from
    before the group was kept there fall back to D1 until the next saveGroup or sign-in. */
export async function getAccountGroup(): Promise<GroupInput | null> {
  const user = await getSessionUser();
  if (!user) return null;
  if (user.group !== undefined) return user.group;
  const u = await getUser(user.id);
  return u ? accountGroupOf(u) : null;
}
