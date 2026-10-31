import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ActivityView } from "@/components/ActivityView/ActivityView";
import { ActivityPage } from "@/components/ActivityPage/ActivityPage";
import { Reveal } from "@/components/Transitions/Transitions";
import { activityDetailChips, typeLabel } from "@/data/options";
import { OPEN_GRAPH } from "@/data/seo";
import { cachedGetPublicActivityWithCategory } from "@/lib/db/libraryCache";
import { excerpt } from "@/lib/markdown/excerpt";
import { getSiteUrl } from "@/lib/site";
import { categoryPath, parseId, publicActivityPath, sameSegment } from "@/lib/slug";
import { PublicActions } from "./PublicActions";
import { ViewCounter } from "./ViewCounter";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ cat: string; act: string }> };

async function load(catSeg: string, actSeg: string) {
  const actId = parseId(actSeg);
  const data = actId ? await cachedGetPublicActivityWithCategory(actId) : null;
  return data && data.category.id === parseId(catSeg) ? data : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cat, act } = await params;
  const data = await load(cat, act);
  if (!data) return {};
  const { activity, category } = data;
  const path = publicActivityPath(category, activity);
  const description = excerpt(activity.bodyMd, 155);
  return {
    title: `${activity.title} – פעולה לתנועות נוער`,
    description,
    alternates: { canonical: path },
    openGraph: { ...OPEN_GRAPH, type: "article", title: activity.title, description, url: path },
  };
}

export default async function PublicActivityPage({ params }: Props) {
  const { cat, act } = await params;
  const data = await load(cat, act);
  if (!data) notFound();
  const { activity, category } = data;
  const path = publicActivityPath(category, activity);
  const [, , catSlug, actSlug] = path.split("/");
  if (!sameSegment(cat, catSlug) || !sameSegment(act, actSlug)) permanentRedirect(path);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: activity.title,
    description: excerpt(activity.bodyMd, 155),
    inLanguage: "he",
    datePublished: new Date(activity.createdAt).toISOString(),
    articleSection: category.title,
    url: `${getSiteUrl()}${path}`,
    publisher: { "@type": "Organization", name: "ActivityWiz" },
  };

  return (
    <ActivityPage label={category.title} fallback={categoryPath(category)}>
      <script
        type="application/ld+json"
        // JSON.stringify output with "<" escaped cannot break out of the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ViewCounter publicId={activity.id} />
      <Reveal>
        <ActivityView
          title={activity.title}
          bodyMd={activity.bodyMd}
          chips={activityDetailChips(typeLabel(null, activity.type), activity.place, activity.duration, activity.age)}
          actions={<PublicActions publicId={activity.id} title={activity.title} bodyMd={activity.bodyMd} />}
        />
      </Reveal>
    </ActivityPage>
  );
}
