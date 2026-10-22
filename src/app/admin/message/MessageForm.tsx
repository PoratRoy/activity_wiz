"use client";

import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button/Button";
import { Modal } from "@/components/Modal/Modal";
import { Switch } from "@/components/Switch/Switch";
import { TextArea, TextField } from "@/components/TextField/TextField";
import { useToast } from "@/components/Toast/Toast";
import { MESSAGE_LIMITS } from "@/lib/message/limits";
import { sendMessageToUsers } from "../actions";
import styles from "../admin.module.css";

type Message = { title: string; body: string; withForm: boolean };

/** Starts from the current message; sending replaces it and shows it again to every signed-in user. */
export function MessageForm({ initial }: { initial: Message | null }) {
  const router = useRouter();
  const toast = useToast();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [withForm, setWithForm] = useState(initial?.withForm ?? false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const send = async () => {
    setPending(true);
    const res = await sendMessageToUsers({ title, body, withForm }).catch(() => ({ error: "השליחה נכשלה, נסו שוב" }));
    setPending(false);
    setConfirming(false);
    if ("error" in res) return setError(res.error);
    setError("");
    toast("ההודעה נשלחה");
    router.refresh();
  };

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        setConfirming(true);
      }}
    >
      <TextField id="message-title" label="כותרת" value={title} maxLength={MESSAGE_LIMITS.title} onChange={(e) => setTitle(e.target.value)} />
      <TextArea id="message-body" label="תוכן ההודעה" value={body} maxLength={MESSAGE_LIMITS.body} onChange={(e) => setBody(e.target.value)} />
      <Switch id="message-with-form" label="עם טופס משוב" checked={withForm} onChange={setWithForm} />
      {error && <p className={styles.error}>{error}</p>}
      <Button type="submit" icon={<Send size={18} aria-hidden />} disabled={pending || !title.trim() || !body.trim()}>
        שליחה לכל המשתמשים
      </Button>

      <Modal open={confirming} onClose={() => !pending && setConfirming(false)} title="לשלוח לכל המשתמשים?">
        <p className={styles.note}>כל משתמש מחובר יראה את ההודעה פעם אחת, בהתחברות הבאה שלו, גם אם כבר ראה את ההודעה הקודמת.</p>
        <div className={styles.stack}>
          <Button disabled={pending} onClick={() => void send()}>
            {pending ? "שולחים…" : "שליחה"}
          </Button>
          <Button variant="secondary" disabled={pending} onClick={() => setConfirming(false)}>
            ביטול
          </Button>
        </div>
      </Modal>
    </form>
  );
}
