"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { EditableActivity } from "@/components/EditableActivity/EditableActivity";
import { TopBar } from "@/components/TopBar/TopBar";
import { saveActivity } from "../actions";
import styles from "./activity.module.css";

/**
 * Deleting is done from the "הפעולות שלי" list. Once the big title scrolls under the pinned bar,
 * the bar takes over the activity's name (`data-collapsed`, animated in CSS).
 */
export function PersonalActivity({
  id,
  title,
  bodyMd,
  chips,
}: {
  id: string;
  title: string;
  bodyMd: string;
  chips: (string | null | undefined)[];
}) {
  const router = useRouter();
  const page = useRef<HTMLDivElement>(null);
  const mounted = useRef(true);
  const [name, setName] = useState(title);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const root = page.current;
    if (!root) return;
    let watched: Element | null = null;
    const io = new IntersectionObserver(
      ([entry]) => setCollapsed(!entry.isIntersecting && entry.boundingClientRect.top < entry.rootBounds!.top + 1),
      // Ignore the area behind the pinned top bar and action bar.
      { rootMargin: "-138px 0px 0px 0px" },
    );
    // The title is replaced when switching between reading and editing: watch whichever is shown.
    const watch = () => {
      const heading = root.querySelector("[data-activity-head] h1");
      if (heading === watched) return;
      if (watched) io.unobserve(watched);
      watched = heading;
      if (heading) io.observe(heading);
      else setCollapsed(false);
    };
    watch();
    const mo = new MutationObserver(watch);
    mo.observe(root, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <div ref={page} className={styles.page} data-collapsed={collapsed || undefined}>
      <TopBar
        back="/my"
        title={
          <span className={styles.barTitle}>
            <span className={styles.barLabel}>הפעולה</span>
            <span className={styles.barName} aria-hidden>
              {name}
            </span>
          </span>
        }
      />
      <EditableActivity
        initial={{ title, bodyMd }}
        chips={chips}
        onSave={async (c) => {
          setName(c.title);
          const ok = await saveActivity(id, c);
          // Saved on the way out: the page we went to (e.g. the list) may have rendered the old title.
          if (ok && !mounted.current) router.refresh();
          return ok;
        }}
      />
    </div>
  );
}
