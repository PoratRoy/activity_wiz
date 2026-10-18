"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PlainActivity } from "@/components/PlainActivity/PlainActivity";
import { typeLabel } from "@/data/options";
import type { Draft } from "@/lib/draft";
import { draftStore } from "@/lib/guest/storage";

export function DraftView() {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);

  useEffect(() => {
    const d = draftStore.load();
    if (!d) router.replace("/");
    else setDraft(d);
  }, [router]);

  if (!draft) return null;
  return <PlainActivity title={draft.title} bodyMd={draft.bodyMd} chips={[typeLabel(null, draft.type), draft.place, draft.duration]} />;
}
