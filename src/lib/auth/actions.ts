"use server";

import { signIn, signOut } from "./config";

/** Only same-site paths are allowed as the post-sign-in destination. */
function safePath(path: string | undefined): string {
  return path && path.startsWith("/") && !path.startsWith("//") ? path : "/";
}

export async function signInWithGoogle(redirectTo?: string) {
  await signIn("google", { redirectTo: safePath(redirectTo) });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
