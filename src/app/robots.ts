import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

// /create, /activity and /my stay crawlable on purpose: they carry `noindex`, and Google only sees
// that tag on pages it may fetch. Blocking them here would let linked URLs show up in results anyway.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/dev"] },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
