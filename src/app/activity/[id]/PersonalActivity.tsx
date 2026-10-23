"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import type { ChipItem } from "@/components/Chip/Chip";
import { EditableActivityPage } from "@/components/EditableActivity/EditableActivityPage";
import { saveActivity } from "../actions";

/** Deleting is done from the "הפעולות שלי" list. */
export function PersonalActivity({ id, title, bodyMd, chips }: { id: string; title: string; bodyMd: string; chips: ChipItem[] }) {
  const router = useRouter();
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <EditableActivityPage
      fallback="/my"
      initial={{ title, bodyMd }}
      chips={chips}
      onSave={async (c) => {
        const ok = await saveActivity(id, c);
        // Saved on the way out: the page we went to (e.g. the list) may have rendered the old title.
        if (ok && !mounted.current) router.refresh();
        return ok;
      }}
    />
  );
}
