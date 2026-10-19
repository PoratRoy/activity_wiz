import type { Metadata } from "next";
import Link from "next/link";
import { TopBar } from "@/components/TopBar/TopBar";
import { FAQ } from "@/data/faq";
import styles from "../info.module.css";

export const metadata: Metadata = {
  title: "שאלות נפוצות",
  description: "תשובות לשאלות נפוצות על ActivityWiz: יצירת פעולות לתנועות נוער בעזרת AI, מאגר פעולות מוכנות, שמירה ושיתוף.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "he",
    mainEntity: FAQ.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  return (
    <>
      <TopBar title="שאלות נפוצות" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <main className={styles.main}>
        <h1 className={styles.heading}>שאלות נפוצות</h1>
        <div className={styles.faq}>
          {FAQ.map(({ q, a }) => (
            <details key={q} className={styles.item}>
              <summary>{q}</summary>
              <p className={styles.answer}>{a}</p>
            </details>
          ))}
        </div>
        <p className={styles.lead}>
          לא מצאתם תשובה? <Link href="/contact" style={{ textDecoration: "underline" }}>כתבו לנו</Link>
        </p>
      </main>
    </>
  );
}
