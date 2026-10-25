"use client";

import type { ComponentProps } from "react";
import { ActivityPage } from "@/components/ActivityPage/ActivityPage";
import { Reveal } from "@/components/Transitions/Transitions";
import { EditableActivity } from "./EditableActivity";

/** The page of an activity the user can edit: their saved activity or a guest draft, in ActivityPage's forest masthead. */
export function EditableActivityPage({ fallback, ...props }: ComponentProps<typeof EditableActivity> & { fallback: string }) {
  return (
    <ActivityPage label="הפעולה" fallback={fallback}>
      <Reveal>
        <EditableActivity {...props} />
      </Reveal>
    </ActivityPage>
  );
}
