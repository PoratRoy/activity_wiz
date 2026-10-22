import type { Metadata } from "next";
import { formatDate } from "@/components/ActivityCard/ActivityCard";
import { ForestPage } from "@/components/ForestPage/ForestPage";
import { requireAdmin } from "@/lib/auth/admin";
import { broadcastMessageStats, getBroadcastMessage } from "@/lib/db/queries";
import styles from "../admin.module.css";
import { MessageForm } from "./MessageForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "הודעה למשתמשים", robots: { index: false } };

export default async function AdminMessagePage() {
  await requireAdmin();
  const message = await getBroadcastMessage();
  const stats = message ? await broadcastMessageStats(message.id) : null;
  return (
    <ForestPage title="הודעה למשתמשים" fallback="/admin">
      <div className={styles.stack}>
        <p className={styles.note}>
          {message && stats
            ? `נשלחה ב-${formatDate(message.sentAt)} · ראו אותה ${stats.seen} מתוך ${stats.total} משתמשים`
            : "עדיין לא נשלחה הודעה"}
        </p>
        <MessageForm initial={message && { title: message.title, body: message.body, withForm: message.withForm }} />
      </div>
    </ForestPage>
  );
}
