"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button/Button";
import { TextArea, TextField } from "@/components/TextField/TextField";
import { useToast } from "@/components/Toast/Toast";
import styles from "../info.module.css";
import { sendContactMessage } from "./actions";
import { CONTACT_LIMITS } from "./limits";

export function ContactForm({ signedInEmail }: { signedInEmail: string | null }) {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState(signedInEmail ?? "");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const disabled = pending || !email.trim() || !name.trim() || !message.trim();

  const submit = async () => {
    setPending(true);
    setError("");
    const res = await sendContactMessage({ email, name, message, website }).catch(() => ({
      ok: false as const,
      error: "לא הצלחנו לשלוח, נסו שוב",
    }));
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    toast("ההודעה נשלחה בהצלחה!");
    router.push("/");
  };

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        if (!disabled) void submit();
      }}
    >
      <TextField
        id="contact-email"
        type="email"
        label="אימייל"
        dir="ltr"
        value={email}
        disabled={!!signedInEmail}
        autoComplete="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        id="contact-name"
        label="שם"
        value={name}
        maxLength={CONTACT_LIMITS.name}
        autoComplete="name"
        onChange={(e) => setName(e.target.value)}
      />
      <TextArea
        id="contact-message"
        label="הודעה"
        placeholder="מה תרצו לספר לנו?"
        value={message}
        maxLength={CONTACT_LIMITS.message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <p className={styles.counter}>
        {message.length}/{CONTACT_LIMITS.message}
      </p>
      <label className={styles.honeypot} aria-hidden>
        אתר
        <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </label>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={disabled}>
        {pending ? "שולחים…" : "שליחה"}
      </Button>
    </form>
  );
}
