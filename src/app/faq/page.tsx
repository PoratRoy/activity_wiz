import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FaqAccordion } from "./FaqAccordion";
import { TopBar } from "@/components/TopBar/TopBar";
import { FAQ } from "@/data/faq";
import styles from "./faq.module.css";

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
    <div className={styles.page}>
      <div className={styles.masthead}>
        <TopBar title="שאלות נפוצות" tone="forest" />
        <Image className={styles.illustration} src="/illustrations/faq-conversation.webp" width={300} height={200} alt="" unoptimized />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <main className={styles.main}>
        <FaqAccordion />
        <p className={styles.contact}>
          לא מצאתם תשובה? <Link href="/contact">כתבו לנו</Link>
        </p>
      </main>
    </div>
  );
}
