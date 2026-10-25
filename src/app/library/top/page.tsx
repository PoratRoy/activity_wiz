import type { Metadata } from "next";
import { Tag } from "lucide-react";
import { Fragment } from "react";
import { ActivityCard } from "@/components/ActivityCard/ActivityCard";
import { AdSlot } from "@/components/AdSlot/AdSlot";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { ForestPage } from "@/components/ForestPage/ForestPage";
import { Reveal } from "@/components/Transitions/Transitions";
import { MOVEMENTS, OPEN_GRAPH } from "@/data/seo";
import { TOP_ROW } from "@/data/topActivities";
import { listTopPublicActivities } from "@/lib/db/queries";
import { excerpt } from "@/lib/markdown/excerpt";
import { publicActivityPath } from "@/lib/slug";
import styles from "../library.module.css";
import { tagsFor } from "../tags";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "פעולות פופולריות לתנועות נוער",
  description: `הפעולות והמשחקים הנצפים ביותר במאגר הפעולות המוכנות למדריכי תנועות הנוער – ${MOVEMENTS}.`,
  alternates: { canonical: TOP_ROW.href },
  openGraph: { ...OPEN_GRAPH, url: TOP_ROW.href },
};

/** The most-viewed public activities from every category; each links to its page in its own category. */
export default async function TopActivitiesPage() {
  const activities = await listTopPublicActivities(TOP_ROW.size);
  return (
    <ForestPage title={TOP_ROW.title} fallback="/library" trail>
      <Reveal>
        {activities.length === 0 ? (
          <EmptyState text="עדיין אין פעולות פופולריות" />
        ) : (
          <ul className={`${styles.list} ${styles.rows}`}>
            {activities.map((a, i) => (
              <Fragment key={a.id}>
                <li>
                  <ActivityCard
                    href={publicActivityPath(a.category, a)}
                    title={a.title}
                    tags={[{ icon: <Tag size={13} aria-hidden />, label: a.category.title }, ...tagsFor(a)]}
                    subtitle={excerpt(a.bodyMd, 110)}
                  />
                </li>
                {i === 2 && (
                  <li>
                    <AdSlot />
                  </li>
                )}
              </Fragment>
            ))}
          </ul>
        )}
      </Reveal>
    </ForestPage>
  );
}
