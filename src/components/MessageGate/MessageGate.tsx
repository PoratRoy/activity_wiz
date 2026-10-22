"use client";

import { useEffect, useRef, useState } from "react";
import { useViewer } from "@/components/AppShell/viewer";
import { Button } from "@/components/Button/Button";
import { Modal } from "@/components/Modal/Modal";
import { TERMS_ACCEPTED_EVENT, termsAccepted } from "@/components/TermsGate/TermsGate";
import { TextArea } from "@/components/TextField/TextField";
import { dismissMessage, getMessageToShow, sendMessageFeedback, type ShownMessage } from "@/lib/message/actions";
import { MESSAGE_LIMITS } from "@/lib/message/limits";
import styles from "./MessageGate.module.css";

/**
 * The admin's broadcast message (/admin/message), checked once after each sign-in and shown until the
 * user confirms, taps outside or sends feedback. Waits for the terms popup to be accepted first.
 */
export function MessageGate() {
  const { checkMessage } = useViewer();
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState<ShownMessage | null>(null);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [thanks, setThanks] = useState(false);
  // One server check per page load; the layout's viewer can stay stale until the next full load.
  const asked = useRef(false);

  useEffect(() => {
    if (termsAccepted()) return setReady(true);
    const onAccept = () => setReady(true);
    window.addEventListener(TERMS_ACCEPTED_EVENT, onAccept);
    return () => window.removeEventListener(TERMS_ACCEPTED_EVENT, onAccept);
  }, []);

  useEffect(() => {
    if (!checkMessage || !ready || asked.current) return;
    asked.current = true;
    getMessageToShow()
      .then(setMessage)
      .catch(() => {});
  }, [checkMessage, ready]);

  if (!message) return null;

  const close = () => {
    setMessage(null);
    if (!thanks) void dismissMessage(message.id).catch(() => {});
  };

  const send = async () => {
    setPending(true);
    setError("");
    const res = await sendMessageFeedback(message.id, feedback).catch(() => ({ ok: false as const, error: "לא הצלחנו לשלוח, נסו שוב" }));
    setPending(false);
    if (!res.ok) return setError(res.error);
    setThanks(true);
    setTimeout(() => setMessage(null), 1500);
  };

  return (
    <Modal open onClose={close} title={thanks ? "תודה!" : message.title}>
      {!thanks && (
        <>
          <p className={styles.body}>{message.body}</p>
          {message.withForm ? (
            <form
              className={styles.form}
              onSubmit={(e) => {
                e.preventDefault();
                if (!pending && feedback.trim()) void send();
              }}
            >
              <TextArea
                id="message-feedback"
                label="מה דעתכם?"
                value={feedback}
                maxLength={MESSAGE_LIMITS.feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              {error && <p className={styles.error}>{error}</p>}
              <Button type="submit" disabled={pending || !feedback.trim()}>
                {pending ? "שולחים…" : "שליחה"}
              </Button>
              <Button type="button" variant="secondary" disabled={pending} onClick={close}>
                סגירה
              </Button>
            </form>
          ) : (
            <Button onClick={close}>אישור</Button>
          )}
        </>
      )}
    </Modal>
  );
}
