"use client";

import { EditableActivity } from "@/components/EditableActivity/EditableActivity";
import { saveActivity } from "../actions";

/** Deleting is done from the "הפעולות שלי" list. */
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
  return <EditableActivity initial={{ title, bodyMd }} chips={chips} onSave={(c) => saveActivity(id, c)} />;
}
