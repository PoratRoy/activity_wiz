import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { preload } from "react-dom";
import { ButtonLink } from "@/components/Button/Button";
import { AvatarMenu } from "@/components/AvatarMenu/AvatarMenu";
import { OPEN_GRAPH, SITE_DESCRIPTION } from "@/data/seo";
import { getSiteUrl } from "@/lib/site";
import { HeaderSignIn } from "./HeaderSignIn";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: { absolute: "ActivityWiz – פעולות לתנועות נוער בעזרת AI" },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { ...OPEN_GRAPH, url: "/" },
};

// The scene is pre-exported at three widths (Cloudflare has no image optimizer); the browser
// picks one for the app column, which is never wider than 480px.
const SCENE = "/illustrations/home-trail-tall";
const SCENE_SRCSET = `${SCENE}-480.webp 480w, ${SCENE}-720.webp 720w, ${SCENE}-941.webp 941w`;
const SCENE_SIZES = "(max-width: 480px) 100vw, 480px";

export default function HomePage() {
  // The scene is the largest element on screen, so fetch it alongside the HTML.
  preload(`${SCENE}-720.webp`, { as: "image", imageSrcSet: SCENE_SRCSET, imageSizes: SCENE_SIZES, fetchPriority: "high" });
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ActivityWiz",
    url: getSiteUrl(),
    inLanguage: "he",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description: SITE_DESCRIPTION,
    offers: { "@type": "Offer", price: "0", priceCurrency: "ILS" },
  };

  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="ActivityWiz — בית">
          <Image src="/brand/activity-wiz-fresh-green.svg" width={28} height={28} alt="" />
          <span dir="ltr">ActivityWiz</span>
        </Link>
        <div className={styles.account}>
          <HeaderSignIn />
          <AvatarMenu />
        </div>
      </header>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>פחות לתכנן.<br /><span className={styles.marker}>יותר להדריך.</span></h1>
          <p className={styles.pitch}>
            פעולה מוכנה בדקה,<br />מותאמת לגיל ולקבוצה שלכם.
          </p>
        </div>
        <div className={styles.scene}>
          {/* A plain <img>: next/image can't build a srcset for pre-sized static files without a client-side loader. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${SCENE}-720.webp`}
            srcSet={SCENE_SRCSET}
            sizes={SCENE_SIZES}
            width={941}
            height={1672}
            alt=""
            fetchPriority="high"
            decoding="async"
            className={styles.landscape}
          />
          <div className={styles.action}>
            <ButtonLink href="/create/group" variant="accent" icon={<Sparkles size={22} aria-hidden />}>
              יצירת פעולה עם AI
            </ButtonLink>
          </div>
        </div>
      </main>
    </div>
  );
}
