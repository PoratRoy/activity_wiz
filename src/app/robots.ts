import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/create", "/activity", "/my", "/admin", "/api", "/dev"] },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
