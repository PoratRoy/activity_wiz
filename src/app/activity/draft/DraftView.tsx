"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { ActionBar } from "@/components/ActionBar/ActionBar";
import { ActivityView } from "@/components/ActivityView/ActivityView";
import { useViewer } from "@/components/AppShell/viewer";
import { Mascot } from "@/components/illustrations/Mascot";
import { useToast } from "@/components/Toast/Toast";
import { typeLabel } from "@/data/options";
import { signInWithGoogle } from "@/lib/auth/actions";
import type { Draft } from "@/lib/draft";
import { draftStore, groupStore } from "@/lib/guest/storage";
import { claimDraft } from "../actions";
import styles from "./DraftView.module.css";

export function DraftView() {
  const router = useRouter();
  const toast = useToast();
  const params = useSearchParams();
  const { signedIn } = useViewer();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [movement, setMovement] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [pending, startTransition] = useTransition();
  const claimStarted = useRef(false);

  useEffect(() => {
    const d = draftStore.load();
    if (!d) {
      router.replace("/");
      return;
    }
    setDraft(d);
    setMovement(groupStore.load()?.movement ?? null);
  }, [router]);

  // Back from Google sign-in with ?claim=1: save the draft to the account and open it (R13).
  useEffect(() => {
    if (!draft || !signedIn || params.get("claim") !== "1" || claimStarted.current) return;
    claimStarted.current = true;
    setClaiming(true);
    claimDraft(draft)
      .then((res) => {
        if (!res) throw new Error("claim failed");
        draftStore.clear();
        toast("נשמר לפעולות שלי");
        router.replace(`/activity/${res.id}`);
      })
      .catch(() => {
        setClaiming(false);
        toast("לא הצלחנו לשמור, נסו שוב");
        router.replace("/activity/draft");
      });
  }, [draft, signedIn, params, router, toast]);

  if (!draft) return null;
  if (claiming) {
    return (
      <div className={styles.claiming}>
        <Mascot size={100} variant="bounce" />
        <p>שומרים את הפעולה…</p>
      </div>
    );
  }

  const banner = signedIn ? (
    // Signed in without ?claim (e.g. came back later): offer an explicit save.
    <div className={styles.banner}>
      <span>הפעולה עוד לא שמורה</span>
      <button type="button" className={styles.bannerButton} onClick={() => router.replace("/activity/draft?claim=1")}>
        שמירה לפעולות שלי
      </button>
    </div>
  ) : (
    <div className={styles.banner}>
      <span>רוצים לשמור את הפעולה?</span>
      <button
        type="button"
        className={styles.bannerButton}
        disabled={pending}
        onClick={() => startTransition(() => signInWithGoogle("/activity/draft?claim=1"))}
      >
        {pending ? "מעבירים…" : "התחברו עם Google"}
      </button>
    </div>
  );

  return (
    <>
      <ActivityView
        title={draft.title}
        bodyMd={draft.bodyMd}
        chips={[typeLabel(movement, draft.type), draft.place, draft.duration]}
        before={banner}
      />
      <ActionBar title={draft.title} bodyMd={draft.bodyMd} />
    </>
  );
}
