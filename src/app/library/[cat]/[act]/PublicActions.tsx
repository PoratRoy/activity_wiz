"use client";

import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ActionBar, ActionButton } from "@/components/ActionBar/ActionBar";
import { useViewer } from "@/components/AppShell/viewer";
import { useToast } from "@/components/Toast/Toast";
import { LIST_FULL_MESSAGE } from "@/lib/draft";
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
          icon={<Bookmark size={20} aria-hidden />}
          // Short so the three actions fit one row; the full name stays for screen readers and the toast.
          label={saving ? "שומרים…" : "שמירה"}
          ariaLabel="שמירה לפעולות שלי"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            const res = await copyPublicActivity(publicId).catch(() => null);
            if (!res || "error" in res) {
              setSaving(false);
              toast(res ? LIST_FULL_MESSAGE : "לא הצלחנו לשמור, נסו שוב");
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
