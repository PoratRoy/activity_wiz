"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/Button/Button";
import { Oops } from "@/components/illustrations/Oops";
import { SignInGate } from "@/components/SignInGate/SignInGate";
import { LIST_FULL_MESSAGE, type GenerateResult } from "@/lib/draft";
import { draftStore, requestStore, type GenerationRequest } from "@/lib/guest/storage";
import { generateActivity } from "../actions";
import styles from "./Generating.module.css";

const AI_DISCLAIMER =
  "שימו לב: התוכן מבוסס בינה מלאכותית והוא בגדר הצעה בלבד – עברו על הפעולה, התאימו אותה לצרכים שלכם והבטיחו שהיא בטוחה ומתאימה לשטח.";

type View =
  | { kind: "loading" }
  | { kind: "refused" }
  | { kind: "busy" }
  | { kind: "error" }
  | { kind: "list_full" }
  | { kind: "rate_limited"; until: number }
  | { kind: "trial_expired" };

export function Generating() {
  const router = useRouter();
  const [view, setView] = useState<View>({ kind: "loading" });
  const [now, setNow] = useState(() => Date.now());
  const started = useRef(false);

  const run = useCallback(
    async (req: GenerationRequest) => {
      setView({ kind: "loading" });
      let res: GenerateResult;
      try {
        res = await generateActivity(req);
      } catch {
        setView({ kind: "error" });
        return;
      }
      if (res.status === "ok") {
        requestStore.clear();
        if ("id" in res) {
          router.replace(`/activity/${res.id}`);
        } else {
          draftStore.save(res.draft);
          router.replace("/activity/draft");
        }
        return;
      }
      if (res.status === "rate_limited") setView({ kind: "rate_limited", until: Date.now() + res.retryInSec * 1000 });
      else if (res.status === "invalid") router.replace("/create/activity");
      else setView({ kind: res.status });
    },
    [router],
  );

  // Start once (refs survive React Strict Mode's double effect in development).
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const req = requestStore.load();
    if (!req) router.replace("/");
    else void run(req);
  }, [router, run]);

  useEffect(() => {
    if (view.kind !== "rate_limited") return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [view.kind]);

  const retry = () => {
    const req = requestStore.load();
    if (req) void run(req);
    else router.replace("/");
  };

  if (view.kind === "loading") {
    return (
      <main className={styles.main} aria-busy="true">
        <Image className={styles.animation} src="/animations/generating.webp" width={500} height={320} alt="" unoptimized priority />
        <h2 className={styles.title}>אנחנו על זה…</h2>
        <div className={styles.bar} role="progressbar" aria-label="יוצרים את הפעולה">
          <div className={styles.fill} />
        </div>
        <p className={styles.notice}>{AI_DISCLAIMER}</p>
      </main>
    );
  }

  if (view.kind === "trial_expired") {
    return <SignInGate open blocking text={"הניסיון הסתיים 🙂\nהתחברו כדי להמשיך ליצור פעולות"} redirectTo="/create/activity" />;
  }

  const secondsLeft = view.kind === "rate_limited" ? Math.max(0, Math.ceil((view.until - now) / 1000)) : 0;
  const message = {
    refused: "הנושא הזה לא מתאים לפעולה עם חניכים. נסו נושא אחר 🙂",
    busy: "יש עומס כרגע, נסו שוב בעוד רגע",
    error: "משהו השתבש",
    list_full: LIST_FULL_MESSAGE,
    rate_limited: secondsLeft > 0 ? `רגע… אפשר ליצור פעולה חדשה בעוד ${secondsLeft} שניות` : "אפשר לנסות שוב",
  }[view.kind];

  return (
    <main className={styles.main}>
      <Oops />
      <h2 className={styles.title}>{message}</h2>
      <div className={styles.actions}>
        {view.kind === "refused" ? (
          <ButtonLink href="/create/activity">נושא אחר</ButtonLink>
        ) : view.kind === "list_full" ? (
          <ButtonLink href="/my">לפעולות שלי</ButtonLink>
        ) : (
          <Button onClick={retry} disabled={view.kind === "rate_limited" && secondsLeft > 0}>
            נסו שוב
          </Button>
        )}
        {view.kind !== "refused" && (
          <ButtonLink href="/create/activity" variant="secondary">
            חזרה
          </ButtonLink>
        )}
      </div>
    </main>
  );
}
