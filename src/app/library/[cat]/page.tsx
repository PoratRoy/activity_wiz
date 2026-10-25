import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Fragment } from "react";
import { ActivityCard } from "@/components/ActivityCard/ActivityCard";
import { AdSlot } from "@/components/AdSlot/AdSlot";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { ForestPage } from "@/components/ForestPage/ForestPage";
import { OPEN_GRAPH, categorySeo } from "@/data/seo";
import { getCategory, listPublicActivities } from "@/lib/db/queries";
import { excerpt } from "@/lib/markdown/excerpt";
import { categoryPath, parseId, publicActivityPath, sameSegment } from "@/lib/slug";
import styles from "../library.module.css";
import { tagsFor } from "../tags";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ cat: string }> };

async function load(segment: string) {
  const id = parseId(segment);
  return id ? getCategory(id) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await load((await params).cat);
  if (!category) return {};
  const { title, description } = categorySeo(category);
  return {
    title,
    description,
    alternates: { canonical: categoryPath(category) },
    openGraph: { ...OPEN_GRAPH, title, description, url: categoryPath(category) },
  };
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
    <ForestPage title={category.title} fallback="/library" trail>
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
