"use client";

import { SignInGate } from "@/components/SignInGate/SignInGate";
import { TopBar } from "@/components/TopBar/TopBar";

export function TrialGate() {
  return (
    <>
      <TopBar title="יצירת פעולה" />
      <SignInGate open reason="trial" />
    </>
  );
}
