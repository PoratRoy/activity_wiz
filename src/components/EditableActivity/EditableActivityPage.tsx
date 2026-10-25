"use client";

import { useEffect, useLayoutEffect, useState, type ComponentProps } from "react";
import { ActivityPage } from "@/components/ActivityPage/ActivityPage";
import { Reveal } from "@/components/Transitions/Transitions";
import { takeReveal } from "@/lib/reveal";
import { EditableActivity } from "./EditableActivity";

/** The page of an activity the user can edit: their saved activity or a guest draft, in ActivityPage's forest masthead. */
export function EditableActivityPage({ fallback, ...props }: ComponentProps<typeof EditableActivity> & { fallback: string }) {
  // Just generated or saved: open with the result reveal. Read before the first paint, and dropped once it has played,
  // so switching to edit and back doesn't replay it.
  const [reveal, setReveal] = useState(false);
  useLayoutEffect(() => {
    if (takeReveal()) setReveal(true);
  }, []);
  useEffect(() => {
    if (!reveal) return;
    const t = setTimeout(() => setReveal(false), 1500);
    return () => clearTimeout(t);
  }, [reveal]);

  return (
    <ActivityPage label="הפעולה" fallback={fallback} reveal={reveal}>
      <Reveal>
        <EditableActivity {...props} />
      </Reveal>
    </ActivityPage>
  );
}
