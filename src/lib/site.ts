import "server-only";
import { getEnv } from "@/lib/env";

/** Absolute site origin for canonicals, Open Graph and the sitemap (runtime `SITE_URL`). */
export function getSiteUrl(): string {
  return (getEnv().SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
}
