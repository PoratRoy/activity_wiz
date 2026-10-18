"use client";

import { BookmarkPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ActionBar, ActionButton } from "@/components/ActionBar/ActionBar";
import { useViewer } from "@/components/AppShell/viewer";
import { useToast } from "@/components/Toast/Toast";
import { copyPublicActivity } from "../../actions";

/** Copy + share for everyone; "save to my activities" for signed-in users (R20). */
export function PublicActions({ publicId, title, bodyMd }: { publicId: string; title: string; bodyMd: string }) {
  const { signedIn } = useViewer();
  const router = useRouter();
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  return (
    <ActionBar title={title} bodyMd={bodyMd}>
      {signedIn && (
        <ActionButton
          icon={<BookmarkPlus size={20} aria-hidden />}
          label={saving ? "שומרים…" : "שמירה לפעולות שלי"}
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            const res = await copyPublicActivity(publicId).catch(() => null);
            if (!res) {
              setSaving(false);
              toast("לא הצלחנו לשמור, נסו שוב");
              return;
            }
            toast("נשמר לפעולות שלי");
            router.push(`/activity/${res.id}`);
          }}
        />
      )}
    </ActionBar>
  );
}
