import "server-only";
import type { Viewer } from "@/components/AppShell/viewer";
import { getUser } from "@/lib/db/queries";
import type { GroupInput } from "@/lib/validate";
import { isAdmin } from "./admin";
import { auth } from "./config";

export async function getSessionUser() {
  const session = await auth();
  return session?.user?.id ? session.user : null;
}

export async function getUserId(): Promise<string | null> {
  return (await getSessionUser())?.id ?? null;
}

/** What the shell needs to render the avatar, admin link and tab lock. */
export async function getViewer(): Promise<Viewer> {
  const user = await getSessionUser();
  if (!user) return { signedIn: false };
  return { signedIn: true, name: user.name, image: user.image, isAdmin: isAdmin(user) };
}

/** The signed-in user's saved group, or null (guest or not filled yet). */
export async function getAccountGroup(): Promise<GroupInput | null> {
  const id = await getUserId();
  if (!id) return null;
  const u = await getUser(id);
  if (!u?.movement || !u.grade || !u.groupSize || !u.gender) return null;
  return { movement: u.movement, grade: u.grade, groupSize: u.groupSize, gender: u.gender };
}
