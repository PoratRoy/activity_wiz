"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition as transition, useEffect, useRef, useState, useTransition } from "react";
import { EditableActivityPage } from "@/components/EditableActivity/EditableActivityPage";
import { ActivitySkeleton } from "@/components/Skeleton/Skeleton";
import { appMounted } from "@/components/AppShell/history";
import { useViewer } from "@/components/AppShell/viewer";
import { useToast } from "@/components/Toast/Toast";
import { activityDetailChips, typeLabel } from "@/data/options";
import { signInWithGoogle } from "@/lib/auth/actions";
import { LIST_FULL_MESSAGE, type Draft } from "@/lib/draft";
import { draftStore, groupStore } from "@/lib/guest/storage";
import { markReveal } from "@/lib/reveal";
import { claimDraft } from "../actions";
import styles from "./DraftView.module.css";

export function DraftView() {
  const router = useRouter();
  const toast = useToast();
  const params = useSearchParams();
  const { signedIn } = useViewer();
  // Opened from within the app (just generated): the draft is read in the first render, so the page arrives whole. On a
  // fresh load it's read after hydration (the server can't see browser storage), with the skeleton until then.
  const [draft, setDraft] = useState<Draft | null>(() => (appMounted() ? draftStore.load() : null));
  const [movement, setMovement] = useState<string | null>(() => (appMounted() ? (groupStore.load()?.movement ?? null) : null));
  const [claiming, setClaiming] = useState(false);
  const [pending, startTransition] = useTransition();
  const claimStarted = useRef(false);

  useEffect(() => {
    const d = draftStore.load();
    if (!d) {
      router.replace("/");
      return;
    }
    if (draft) return;
    // In a transition, so the skeleton cross-fades into the activity (see components/Transitions).
    transition(() => {
      setDraft(d);
      setMovement(groupStore.load()?.movement ?? null);
    });
    // Only on mount: `draft` is checked for the first render's read, later edits don't reload it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Back from Google sign-in with ?claim=1: save the draft to the account and open it (R13).
  useEffect(() => {
    if (!draft || !signedIn || params.get("claim") !== "1" || claimStarted.current) return;
    claimStarted.current = true;
    setClaiming(true);
    claimDraft(draft)
      .then((res) => {
        if (res && "error" in res) {
          setClaiming(false);
          toast(LIST_FULL_MESSAGE);
          router.replace("/activity/draft");
          return;
        }
        if (!res) throw new Error("claim failed");
        draftStore.clear();
        toast("נשמר לפעולות שלי");
        markReveal();
        router.replace(`/activity/${res.id}`);
      })
      .catch(() => {
        setClaiming(false);
        toast("לא הצלחנו לשמור, נסו שוב");
        router.replace("/activity/draft");
      });
  }, [draft, signedIn, params, router, toast]);

  // Back from sign-in to save: show the saving screen from the first render, so the top bar never flashes.
  if (claiming || (signedIn && params.get("claim") === "1")) {
    return (
      <main className={styles.saving} aria-busy="true">
        <Image className={styles.animation} src="/animations/generating.webp" width={500} height={320} alt="" unoptimized priority />
        <div className={styles.bar} role="progressbar" aria-label="שומרים את הפעולה">
          <div className={styles.fill} />
        </div>
        <p className={styles.savingText}>שומרים את הפעולה…</p>
      </main>
    );
  }

  // The draft is read from this browser after mounting: until then, the page's empty frame.
  if (!draft) return <ActivitySkeleton label="הפעולה" fallback="/create/activity" />;

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
    <EditableActivityPage
      fallback="/create/activity"
      initial={{ title: draft.title, bodyMd: draft.bodyMd }}
      chips={activityDetailChips(typeLabel(movement, draft.type), draft.place, draft.duration)}
      before={banner}
      onSave={async (c) => {
        // Guest edits stay in this browser until sign-in (R15).
        const latest = { ...(draftStore.load() ?? draft), ...c };
        draftStore.save(latest);
        setDraft(latest);
        return true;
      }}
    />
  );
}
