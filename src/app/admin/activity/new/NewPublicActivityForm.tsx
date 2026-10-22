"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import viewStyles from "@/components/ActivityView/ActivityView.module.css";
import { Button } from "@/components/Button/Button";
import { Collapsible } from "@/components/Collapsible/Collapsible";
import { PickerSheet } from "@/components/PickerSheet/PickerSheet";
import { TextArea, TextField } from "@/components/TextField/TextField";
import { TileGroup, type TileOption } from "@/components/Tile/Tile";
import { useToast } from "@/components/Toast/Toast";
import { AGES, ANY_AGE, asOptions, DURATIONS, EQUIPMENT, GENERIC_TYPE_LABELS, NOTES_MAX, PLACES, SHABBAT, TEAMS } from "@/data/options";
import { TITLE_MAX } from "@/lib/draft";
import { renderMarkdown } from "@/lib/markdown/render";
import { createPublicActivity, type FieldErrors, type PublicActivityInput } from "../../actions";
import styles from "../../admin.module.css";

const TYPE_OPTIONS = Object.entries(GENERIC_TYPE_LABELS).map(([value, label]) => ({ value, label }));

export function NewPublicActivityForm({ categories, initialCategory }: { categories: TileOption[]; initialCategory: string }) {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState<PublicActivityInput>({
    categoryId: initialCategory,
    title: "",
    bodyMd: "",
    type: "content",
    place: "",
    duration: "",
    equipment: "",
    teams: "",
    shabbat: "",
    notes: "",
    age: ANY_AGE,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const set = (k: keyof PublicActivityInput) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    // Clear a field's error as soon as it is edited.
    setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e));
  };
  const err = (k: keyof PublicActivityInput) => errors[k] && <p className={styles.error}>{errors[k]}</p>;

  const publish = async () => {
    setPending(true);
    const res = await createPublicActivity(form).catch(() => ({ errors: { title: "הפרסום נכשל, נסו שוב" } as FieldErrors }));
    setPending(false);
    if ("errors" in res) {
      setErrors(res.errors);
      toast("יש שדות שצריך לתקן");
      return;
    }
    toast("פורסם");
    router.push(`/admin/category/${res.categoryId}`);
  };

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        void publish();
      }}
    >
      <PickerSheet label="קטגוריה" placeholder="בחרו קטגוריה" options={categories} value={form.categoryId} onChange={set("categoryId")} />
      {err("categoryId")}
      <TextField id="title" label="כותרת" value={form.title} maxLength={TITLE_MAX} onChange={(e) => set("title")(e.target.value)} />
      {err("title")}
      <TileGroup name="type" label="סוג" options={TYPE_OPTIONS} value={form.type} onChange={set("type")} />
      {err("type")}
      <TileGroup name="place" label="מקום" columns={3} options={asOptions(PLACES)} value={form.place} onChange={set("place")} />
      {err("place")}
      <TileGroup name="duration" label="משך" columns={3} options={asOptions(DURATIONS)} value={form.duration} onChange={set("duration")} />
      {err("duration")}
      <TileGroup name="age" label="גיל" options={asOptions(AGES)} value={form.age} onChange={set("age")} />
      {err("age")}
      <Collapsible title="עוד אפשרויות">
        <TileGroup name="equipment" label="ציוד" allowClear options={asOptions(EQUIPMENT)} value={form.equipment} onChange={set("equipment")} />
        <TileGroup name="teams" label="חלוקה לקבוצות" allowClear options={asOptions(TEAMS)} value={form.teams} onChange={set("teams")} />
        <TileGroup name="shabbat" label="שבת" allowClear options={asOptions(SHABBAT)} value={form.shabbat} onChange={set("shabbat")} />
        <TextArea id="notes" label="הערות" maxLength={NOTES_MAX} value={form.notes} onChange={(e) => set("notes")(e.target.value)} />
      </Collapsible>
      <TextArea
        id="body"
        label="תוכן הפעולה (Markdown)"
        placeholder={"## מהלך הפעולה\n### 1. פתיחה (10 דק׳)\n..."}
        className={styles.bodyInput}
        value={form.bodyMd}
        onChange={(e) => set("bodyMd")(e.target.value)}
      />
      {err("bodyMd")}
      {form.bodyMd.trim() && (
        <div>
          <p className={styles.previewLabel}>תצוגה מקדימה</p>
          {/* renderMarkdown escapes raw HTML (except <u>) and drops links/images. */}
          <div className={`${styles.preview} ${viewStyles.body}`} dangerouslySetInnerHTML={{ __html: renderMarkdown(form.bodyMd) }} />
        </div>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "מפרסמים…" : "פרסום"}
      </Button>
    </form>
  );
}
