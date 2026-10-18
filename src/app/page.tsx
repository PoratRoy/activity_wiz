import type { Metadata } from "next";
import { Sparkles, Trees } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/Button/Button";
import { AvatarMenu } from "@/components/AvatarMenu/AvatarMenu";
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
    <div className={styles.home}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="ActivityWiz — בית">
          <Trees size={30} strokeWidth={1.8} aria-hidden />
          <span dir="ltr">ActivityWiz</span>
        </Link>
        <AvatarMenu />
      </header>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="home-title">
          <div className={styles.intro}>
            <h1 id="home-title">בונים פעולה?</h1>
            <p className={styles.subtitle}>מותאם, פשוט ומהיר</p>
            <p className={styles.pitch}>פעולה מוכנה לשבט בדקה</p>
            <div className={styles.actions}>
              <ButtonLink href="/create/group" icon={<Sparkles size={22} aria-hidden />}>
                יצירת פעולה עם AI
              </ButtonLink>
              {!signedIn && <GoogleSignInButton />}
            </div>
          </div>
          <Image
            src="/illustrations/home-woodland.webp"
            width={960}
            height={640}
            sizes="(max-width: 480px) 100vw, 480px"
            unoptimized
            preload
            alt=""
            className={styles.landscape}
          />
        </section>

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
        <div className={styles.adArea}>
          <div className={styles.adSlot} role="region" aria-label="פרסומת">פרסומת</div>
        </div>
      </main>
    </div>
  );
}
