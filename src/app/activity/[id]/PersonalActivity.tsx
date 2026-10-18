"use client";

import { useRouter } from "next/navigation";
import { EditableActivity } from "@/components/EditableActivity/EditableActivity";
import { useToast } from "@/components/Toast/Toast";
import { removeActivity, saveActivity } from "../actions";

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
  const toast = useToast();
  return (
    <EditableActivity
      initial={{ title, bodyMd }}
      chips={chips}
      onSave={(c) => saveActivity(id, c)}
      onDelete={async () => {
        const ok = await removeActivity(id);
        if (!ok) {
          toast("לא הצלחנו למחוק, נסו שוב");
          return false;
        }
        toast("הפעולה נמחקה");
        router.replace("/my");
        return true;
      }}
    />
  );
}
