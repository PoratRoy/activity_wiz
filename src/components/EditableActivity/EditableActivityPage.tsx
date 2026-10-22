"use client";

import { useState, type ComponentProps } from "react";
import { ActivityPage } from "@/components/ActivityPage/ActivityPage";
import { EditableActivity } from "./EditableActivity";

/**
 * The page of an activity the user can edit: their saved activity or a guest draft. Both share the
 * forest masthead of ActivityPage, and the pinned bar follows title edits.
 */
export function EditableActivityPage({ fallback, onSave, ...props }: ComponentProps<typeof EditableActivity> & { fallback: string }) {
  const [name, setName] = useState(props.initial.title);

  return (
    <ActivityPage label="הפעולה" fallback={fallback} name={name}>
      <EditableActivity
        {...props}
        onSave={(c) => {
          setName(c.title);
          return onSave(c);
        }}
      />
    </ActivityPage>
  );
}
