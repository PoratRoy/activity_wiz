import type { MetadataRoute } from "next";
import { TOP_ROW } from "@/data/topActivities";
import { listAllPublicActivityRefs, listCategories } from "@/lib/db/queries";
import { getSiteUrl } from "@/lib/site";
import { categoryPath, publicActivityPath } from "@/lib/slug";

export const dynamic = "force-dynamic";

/** Home, library, the «הכי פופולרי» page, every category and every public activity, read from D1 on each request. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [categories, activities] = await Promise.all([listCategories(), listAllPublicActivityRefs()]);
  const byId = new Map(categories.map((c) => [c.id, c]));
  // A list page changes when an activity is added to it, so its date is its newest activity's.
  const newest = new Map<string, number>();
  for (const a of activities) newest.set(a.categoryId, Math.max(newest.get(a.categoryId) ?? 0, a.createdAt));
  const latest = Math.max(0, ...newest.values());
  const lastModified = (time: number | undefined) => (time ? new Date(time) : undefined);
  return [
    { url: `${base}/`, lastModified: lastModified(latest), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/library`, lastModified: lastModified(latest), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}${TOP_ROW.href}`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.2 },
    ...categories.map((c) => ({
      url: `${base}${categoryPath(c)}`,
      lastModified: lastModified(newest.get(c.id)),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...activities.flatMap((a) => {
      const c = byId.get(a.categoryId);
      return c ? [{ url: `${base}${publicActivityPath(c, a)}`, lastModified: new Date(a.createdAt), priority: 0.7 }] : [];
    }),
  ];
}
