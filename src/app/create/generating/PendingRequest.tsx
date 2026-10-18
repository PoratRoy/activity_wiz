"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChipRow } from "@/components/Chip/Chip";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Mascot } from "@/components/illustrations/Mascot";
import { findMovement, typeLabel } from "@/data/options";
import { requestStore, type GenerationRequest } from "@/lib/guest/storage";

/** Temporary (step 8 replaces it): confirms the create flow hands over a complete request. */
export function PendingRequest() {
  const router = useRouter();
  const [req, setReq] = useState<GenerationRequest | null>(null);

  useEffect(() => {
    const r = requestStore.load();
    if (!r) router.replace("/");
    else setReq(r);
  }, [router]);

  if (!req) return null;
  const { group, activity } = req;
  return (
    <EmptyState
      illustration={<Mascot size={100} variant="bounce" />}
      text="יצירה עם AI תגיע בשלב הבא 🙂"
      action={
        <ChipRow
          items={[
            findMovement(group.movement)?.label,
            group.grade,
            typeLabel(group.movement, activity.type),
            activity.subject,
            activity.place,
            activity.duration,
          ]}
        />
      }
    />
  );
}
