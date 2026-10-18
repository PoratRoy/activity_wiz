import type { MetadataRoute } from "next";
import { listAllPublicActivityRefs, listCategories } from "@/lib/db/queries";
import { getSiteUrl } from "@/lib/site";
import { categoryPath, publicActivityPath } from "@/lib/slug";

export const dynamic = "force-dynamic";

/** Home, library, every category and every public activity, read from D1 on each request. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [categories, activities] = await Promise.all([listCategories(), listAllPublicActivityRefs()]);
  const byId = new Map(categories.map((c) => [c.id, c]));
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/library`, changeFrequency: "daily", priority: 0.9 },
    ...categories.map((c) => ({ url: `${base}${categoryPath(c)}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...activities.flatMap((a) => {
      const c = byId.get(a.categoryId);
      return c ? [{ url: `${base}${publicActivityPath(c, a)}`, lastModified: new Date(a.createdAt), priority: 0.7 }] : [];
    }),
  ];
}
