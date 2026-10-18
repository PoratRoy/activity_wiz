import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Everything renders dynamically per request; OpenNext does not document cacheComponents support.
  cacheComponents: false,
  // The dev badge sits on top of the "הפעולות שלי" tab in local development.
  devIndicators: false,
};

export default nextConfig;

// Exposes Cloudflare bindings (D1, Durable Objects) to `next dev` via getCloudflareContext().
initOpenNextCloudflareForDev();
