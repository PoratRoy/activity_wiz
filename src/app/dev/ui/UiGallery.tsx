"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import { AdSlot } from "@/components/AdSlot/AdSlot";
import { Button } from "@/components/Button/Button";
import { ChipRow } from "@/components/Chip/Chip";
import { Collapsible } from "@/components/Collapsible/Collapsible";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Campfire } from "@/components/illustrations/Campfire";
import { Mascot } from "@/components/illustrations/Mascot";
import { Oops } from "@/components/illustrations/Oops";
import { ConfirmModal } from "@/components/Modal/Modal";
import { PickerSheet } from "@/components/PickerSheet/PickerSheet";
import { TextArea, TextField } from "@/components/TextField/TextField";
import { TileGroup } from "@/components/Tile/Tile";
import { useToast } from "@/components/Toast/Toast";
import styles from "./UiGallery.module.css";

const grades = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ז׳", "ח׳", "ט׳", "י׳", "י״א", "י״ב"].map((g) => ({
  value: `כיתה ${g}`,
  label: `כיתה ${g}`,
}));

export function UiGallery() {
  const toast = useToast();
  const [grade, setGrade] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>("מעורב");
  const [place, setPlace] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  return (
    <main className={styles.main}>
      <section className={styles.row}>
        <Mascot variant="bounce" />
        <Campfire size={100} />
        <Oops size={80} />
      </section>

      <Button onClick={() => toast("הועתק!")}>יצירת פעולה עם AI</Button>
      <Button variant="secondary">התחברות עם Google</Button>
      <Button variant="accent" icon={<Sparkles size={18} />}>
        עוד אפשרויות
      </Button>
      <Button variant="danger" onClick={() => setConfirm(true)}>
        מחיקה
      </Button>
      <Button disabled>המשך</Button>

      <PickerSheet label="כיתה" placeholder="בחרו כיתה" options={grades} value={grade} onChange={setGrade} />
      <TileGroup
        name="gender"
        label="הרכב"
        columns={3}
        options={["בנים", "בנות", "מעורב"].map((v) => ({ value: v, label: v }))}
        value={gender}
        onChange={setGender}
      />
      <TextField label="נושא" placeholder="על מה הפעולה?" maxLength={21} endSlot={<Sparkles size={20} color="var(--yellow-dark)" />} />

      <Collapsible title="עוד אפשרויות">
        <TileGroup
          name="place"
          label="מקום"
          allowClear
          options={["לא משנה", "במקום סגור", "במקום פתוח"].map((v) => ({ value: v, label: v }))}
          value={place}
          onChange={setPlace}
        />
        <TextArea label="הערות" placeholder="משהו שחשוב שנדע?" />
      </Collapsible>

      <ChipRow items={["פעולת תוכן", "במקום פתוח", "שעה"]} />
      <EmptyState text="עוד אין פעולות" action={<Button block={false}>יצירת פעולה</Button>} />
      <AdSlot />

      <ConfirmModal
        open={confirm}
        title="למחוק את הפעולה?"
        message="אי אפשר לבטל את זה."
        onConfirm={() => {
          setConfirm(false);
          toast("הפעולה נמחקה");
        }}
        onCancel={() => setConfirm(false)}
      />
    </main>
  );
}
