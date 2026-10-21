import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Clock, GraduationCap, MapPin } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { ActivityCard, type CardTag } from "@/components/ActivityCard/ActivityCard";
import { AdSlot } from "@/components/AdSlot/AdSlot";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { ForestPage } from "@/components/ForestPage/ForestPage";
import { shown } from "@/data/options";
import { getCategory, listPublicActivities } from "@/lib/db/queries";
import { excerpt } from "@/lib/markdown/excerpt";
import { categoryPath, parseId, publicActivityPath, sameSegment } from "@/lib/slug";
import styles from "../library.module.css";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ cat: string }> };

async function load(segment: string) {
  const id = parseId(segment);
  return id ? getCategory(id) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await load((await params).cat);
  if (!category) return {};
  return {
    title: `${category.title} – פעולות לתנועות נוער`,
    description: `פעולות ומשחקים מוכנים בנושא ${category.title} למדריכים בתנועות הנוער.`,
    alternates: { canonical: categoryPath(category) },
    openGraph: { title: category.title, url: categoryPath(category) },
  };
}

/** Place, time and age with the activity page's icons; "לא משנה" values are left out. */
function tagsFor(a: { place: string; duration: string; age: string }): CardTag[] {
  const tag = (icon: ReactNode, value: string) => {
    const label = shown(value);
    return label ? [{ icon, label }] : [];
  };
  return [
    ...tag(<MapPin size={13} aria-hidden />, a.place),
    ...tag(<Clock size={13} aria-hidden />, a.duration),
    ...tag(<GraduationCap size={13} aria-hidden />, a.age),
  ];
}

export default async function CategoryPage({ params }: Props) {
  const segment = (await params).cat;
  const category = await load(segment);
  if (!category) notFound();
  if (!sameSegment(segment, categoryPath(category).split("/").pop()!)) {
    permanentRedirect(categoryPath(category));
  }
  const activities = await listPublicActivities(category.id);

  return (
    <ForestPage title={category.title} fallback="/library">
      {activities.length === 0 ? (
        <EmptyState text="אין עדיין פעולות בקטגוריה" />
      ) : (
        <ul className={`${styles.list} ${styles.rows}`}>
          {activities.map((a, i) => (
            <Fragment key={a.id}>
              <li>
                <ActivityCard
                  href={publicActivityPath(category, a)}
                  title={a.title}
                  tags={tagsFor(a)}
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
    </ForestPage>
  );
}
