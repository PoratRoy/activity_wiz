import type { Metadata } from "next";
import { TopBar } from "@/components/TopBar/TopBar";
import { TermsText } from "@/components/TermsGate/TermsText";
import { TERMS_TITLE } from "@/data/terms";
import styles from "../info.module.css";

export const metadata: Metadata = {
  title: TERMS_TITLE,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <TopBar title="תנאי שירות" />
      <main className={styles.main}>
        <h1 className={styles.heading}>{TERMS_TITLE}</h1>
        <TermsText />
      </main>
    </>
  );
}
