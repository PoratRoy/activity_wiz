import type { Metadata } from "next";
import { TopBar } from "@/components/TopBar/TopBar";
import { getSessionUser } from "@/lib/auth/session";
import styles from "../info.module.css";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "צרו קשר",
  description: "לכל הצעה, בקשה או בעיה – דברו עם צוות ActivityWiz.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const user = await getSessionUser();
  return (
    <>
      <TopBar title="צרו קשר" />
      <main className={styles.main}>
        <h1 className={styles.heading}>מה תרצו לספר לנו?</h1>
        <p className={styles.lead}>לכל הצעה, בקשה או בעיה, דברו איתנו!</p>
        <ContactForm signedInEmail={user?.email ?? null} />
      </main>
    </>
  );
}
