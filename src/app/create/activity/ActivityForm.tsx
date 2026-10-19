"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Collapsible } from "@/components/Collapsible/Collapsible";
import { SubjectField } from "@/components/SubjectField/SubjectField";
import { TextArea } from "@/components/TextField/TextField";
import { TileGroup } from "@/components/Tile/Tile";
import { asOptions, DURATIONS, EQUIPMENT, findMovement, NOTES_MAX, PLACES, resolveType, SHABBAT, TEAMS, type TypeKey } from "@/data/options";
import { activityFormStore, groupStore, requestStore } from "@/lib/guest/storage";
import { hasErrors, validateActivity, validateGroup, type ActivityInput, type GroupInput } from "@/lib/validate";
import styles from "./activity.module.css";

const EMPTY: ActivityInput = {
  type: "",
  subject: "",
  place: "",
  duration: "",
  equipment: "",
  teams: "",
  shabbat: "",
  notes: "",
};

export function ActivityForm({ accountGroup }: { accountGroup: GroupInput | null }) {
  const router = useRouter();
  const [group, setGroup] = useState<GroupInput | null>(accountGroup);
  const [form, setForm] = useState<ActivityInput>(EMPTY);
  const [ready, setReady] = useState(false);
  const [touched, setTouched] = useState(false);

  // Load the group (account first, then this browser) and any in-progress values.
  useEffect(() => {
    const g = accountGroup ?? groupStore.load();
    if (!g || hasErrors(validateGroup(g))) {
      router.replace("/create/group");
      return;
    }
    const saved = activityFormStore.load() ?? {};
    setGroup(g);
    setForm({ ...EMPTY, ...saved, type: resolveType(g.movement, saved.type) ?? "" });
    setReady(true);
  }, [accountGroup, router]);

  // Keep values across back/forward navigation within the tab.
  useEffect(() => {
    if (ready) activityFormStore.save(form);
  }, [form, ready]);

  if (!ready || !group) return null;

  const movement = findMovement(group.movement)!;
  const errors = validateActivity(form, group.movement);
  const set = (field: keyof ActivityInput) => (value: string) => setForm((f) => ({ ...f, [field]: value }));
  const isGame = form.type === "playTime";
  const show = (field: keyof ActivityInput) => (touched || form[field] !== "") && errors[field];

  const onSubmit = () => {
    setTouched(true);
    if (hasErrors(errors)) return;
    const duration = isGame ? "" : form.duration;
    requestStore.save({ group, activity: { ...form, duration, subject: form.subject.trim(), notes: form.notes.trim() } });
    router.push("/create/generating");
  };

  return (
    <form className={styles.form} onSubmit={(e) => (e.preventDefault(), onSubmit())}>
      <TileGroup
        name="type"
        label="סוג"
        options={movement.types.map((t) => ({ value: t.key, label: t.label }))}
        value={form.type}
        onChange={set("type")}
      />

      <SubjectField value={form.subject} onChange={set("subject")} type={(form.type || null) as TypeKey | null} />
      {show("subject") && <p className={styles.error}>{errors.subject}</p>}

      <TileGroup name="place" label="מקום" columns={3} options={asOptions(PLACES)} value={form.place} onChange={set("place")} />
      {touched && errors.place && <p className={styles.error}>{errors.place}</p>}

      {!isGame && (
        <>
          <TileGroup name="duration" label="משך" columns={3} options={asOptions(DURATIONS)} value={form.duration} onChange={set("duration")} />
          {touched && errors.duration && <p className={styles.error}>{errors.duration}</p>}
        </>
      )}

      <div className={styles.more}>
        <Collapsible title="עוד אפשרויות">
          <TileGroup name="equipment" label="ציוד" allowClear options={asOptions(EQUIPMENT)} value={form.equipment} onChange={set("equipment")} />
          <TileGroup name="teams" label="חלוקה לקבוצות" allowClear options={asOptions(TEAMS)} value={form.teams} onChange={set("teams")} />
          <TileGroup name="shabbat" label="שבת" allowClear options={asOptions(SHABBAT)} value={form.shabbat} onChange={set("shabbat")} />
          <TextArea
            id="notes"
            label="הערות"
            placeholder="משהו שחשוב שנדע?"
            maxLength={NOTES_MAX}
            value={form.notes}
            onChange={(e) => set("notes")(e.target.value)}
          />
          {show("notes") && <p className={styles.error}>{errors.notes}</p>}
        </Collapsible>
      </div>

      <div className={styles.footer}>
        <Button type="submit" icon={<Sparkles size={20} aria-hidden />}>
          יצירת הפעולה
        </Button>
      </div>
    </form>
  );
}
