"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ActivityPage } from "@/components/ActivityPage/ActivityPage";
import type { ChipItem } from "@/components/Chip/Chip";
import { EditableActivity } from "@/components/EditableActivity/EditableActivity";
import { saveActivity } from "../actions";

/** Deleting is done from the "הפעולות שלי" list. */
export function PersonalActivity({ id, title, bodyMd, chips }: { id: string; title: string; bodyMd: string; chips: ChipItem[] }) {
  const router = useRouter();
  const mounted = useRef(true);
  const [name, setName] = useState(title);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <ActivityPage label="הפעולה" fallback="/my" name={name}>
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
    </ActivityPage>
  );
}
