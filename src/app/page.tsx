import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
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
          <Image src="/brand/activity-wiz-fresh-green.svg" width={28} height={28} alt="" />
          <span dir="ltr">ActivityWiz</span>
        </Link>
        <AvatarMenu />
      </header>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="home-title">
          <div className={styles.intro}>
            <h1 id="home-title">פחות לתכנן.<br /><span className={styles.marker}>יותר להדריך.</span></h1>
            <p className={styles.pitch}>
              פעולה מוכנה בדקה,<br />מותאמת לגיל ולקבוצה שלכם.
            </p>
            <div className={styles.actions}>
              <ButtonLink href="/create/group" icon={<Sparkles size={22} aria-hidden />}>
                יצירת פעולה עם AI
              </ButtonLink>
              {!signedIn && <GoogleSignInButton />}
            </div>
            {/* <details> keeps the text in the server HTML for search engines while it stays folded. */}
            <details className={styles.about}>
              <summary>אודות</summary>
              <p>
                יצירת פעולות מותאמות אישית לתנועות הנוער בעזרת בינה מלאכותית. מתאים למדריכים שרוצים להעשיר את הפעילות החינוכית
                והחברתית.
              </p>
            </details>
          </div>
          <Image
            src="/illustrations/home-trail.webp"
            width={1200}
            height={800}
            sizes="(max-width: 480px) 100vw, 480px"
            unoptimized
            preload
            alt=""
            className={styles.landscape}
          />
        </section>

      </main>
    </div>
  );
}
