import type { ReactNode } from "react";
import { getUserId } from "@/lib/auth/session";
import { isTrialExpired, readGuest } from "@/lib/guest/cookie";
import { TrialGate } from "./TrialGate";

/** Every /create page: a guest whose 3-day trial is over sees the blocking sign-in popup (R3). */
export default async function CreateLayout({ children }: { children: ReactNode }) {
  if (!(await getUserId()) && isTrialExpired(await readGuest())) {
    return <TrialGate />;
  }
  return children;
}
