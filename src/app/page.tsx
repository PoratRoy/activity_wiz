import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/Button/Button";
import { Campfire } from "@/components/illustrations/Campfire";
import { Mascot } from "@/components/illustrations/Mascot";
import { TopBar } from "@/components/TopBar/TopBar";
import { getViewer } from "@/lib/auth/session";
import { getSiteUrl } from "@/lib/site";
import { GoogleSignInButton } from "./GoogleSignInButton";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: { absolute: "ActivityWiz – פעולות לתנועות נוער בעזרת AI" },
  description:
    "יוצרים פעולה מוכנה לתנועת הנוער בדקה: בוחרים קבוצה, נושא ומשך, ומקבלים פעולה מלאה בעברית. למדריכים בצופים, בני עקיבא, השומר הצעיר ועוד.",
  alternates: { canonical: "/" },
};

const STEPS = [
  { n: "1", title: "מספרים על הקבוצה", text: "תנועה, כיתה וגודל הקבוצה" },
  { n: "2", title: "בוחרים נושא", text: "סוג הפעולה, מקום ומשך" },
  { n: "3", title: "מקבלים פעולה מוכנה", text: "לקרוא, לערוך ולשלוח בוואטסאפ" },
];

export default async function HomePage() {
  const { signedIn } = await getViewer();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ActivityWiz",
    url: getSiteUrl(),
    inLanguage: "he",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description: "יצירת פעולות לתנועות נוער בעזרת בינה מלאכותית, ומאגר פעולות מוכנות למדריכים.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "ILS" },
  };

  return (
    <>
      <TopBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.art} aria-hidden>
            <Campfire size={96} />
            <Mascot size={120} />
          </div>
          <h1 className={styles.name}>ActivityWiz</h1>
          <p className={styles.pitch}>פעולה מוכנה לשבט בדקה</p>
          <p className={styles.sub}>יוצרים פעולות לתנועות נוער בעזרת AI, מותאמות לקבוצה שלכם.</p>
        </section>

        <div className={styles.actions}>
          {!signedIn && <GoogleSignInButton />}
          <ButtonLink href="/create/group" icon={<Sparkles size={20} aria-hidden />}>
            יצירת פעולה עם AI
          </ButtonLink>
        </div>

        <ol className={styles.steps} aria-label="איך זה עובד">
          {STEPS.map((s) => (
            <li key={s.n} className={styles.step}>
              <span className={styles.stepNum} aria-hidden>
                {s.n}
              </span>
              <span>
                <strong className={styles.stepTitle}>{s.title}</strong>
                <span className={styles.stepText}>{s.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
