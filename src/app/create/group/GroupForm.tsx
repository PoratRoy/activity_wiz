"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useViewer } from "@/components/AppShell/viewer";
import { Button } from "@/components/Button/Button";
import { ArrowLeft } from "lucide-react";
import styles from "./group.module.css";
import { PickerSheet } from "@/components/PickerSheet/PickerSheet";
import { TileGroup } from "@/components/Tile/Tile";
import { useToast } from "@/components/Toast/Toast";
import { asOptions, GENDERS, GRADES, GROUP_SIZES, MOVEMENTS } from "@/data/options";
import { groupStore } from "@/lib/guest/storage";
import { hasErrors, validateGroup, type GroupInput } from "@/lib/validate";
import { saveGroup } from "../actions";

const EMPTY: GroupInput = { movement: "", grade: "", groupSize: "", gender: "" };
const movementOptions = MOVEMENTS.map((m) => ({ value: m.key, label: m.label }));

export function GroupForm({ accountGroup }: { accountGroup: GroupInput | null }) {
  const router = useRouter();
  const toast = useToast();
  const { signedIn } = useViewer();
  const [group, setGroup] = useState<GroupInput>(accountGroup ?? EMPTY);
  const [pending, startTransition] = useTransition();

  // Account data wins; otherwise prefill from this browser.
  useEffect(() => {
    if (!accountGroup) {
      const local = groupStore.load();
      if (local) setGroup({ ...EMPTY, ...local });
    }
  }, [accountGroup]);

  const set = (field: keyof GroupInput) => (value: string) => setGroup((g) => ({ ...g, [field]: value }));
  const complete = !hasErrors(validateGroup(group));

  const onContinue = () => {
    if (!complete) return;
    groupStore.save(group);
    startTransition(async () => {
      if (signedIn) {
        const res = await saveGroup(group);
        if (!res.ok) {
          toast("לא הצלחנו לשמור, נסו שוב");
          return;
        }
      }
      router.push("/create/activity");
    });
  };

  return (
    <form className={styles.form} onSubmit={(e) => (e.preventDefault(), onContinue())}>
      <PickerSheet label="תנועה" placeholder="בחרו תנועה" options={movementOptions} value={group.movement} onChange={set("movement")} closeDelayMs={30} />
      <PickerSheet label="כיתה" placeholder="בחרו כיתה" options={asOptions(GRADES)} value={group.grade} onChange={set("grade")} closeDelayMs={30} />
      <PickerSheet label="מספר חניכים" placeholder="בחרו מספר חניכים" options={asOptions(GROUP_SIZES)} value={group.groupSize} onChange={set("groupSize")} closeDelayMs={30} />
      <TileGroup name="gender" label="הרכב" columns={3} options={asOptions(GENDERS)} value={group.gender} onChange={set("gender")} />
      <div className={styles.footer}>
        <Button type="submit" disabled={!complete || pending} icon={<ArrowLeft size={20} aria-hidden />}>
          {pending ? "שומרים…" : "המשך"}
        </Button>
      </div>
    </form>
  );
}
