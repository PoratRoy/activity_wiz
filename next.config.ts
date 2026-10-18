import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Everything renders dynamically per request; OpenNext does not document cacheComponents support.
  cacheComponents: false,
};

export default nextConfig;

// Exposes Cloudflare bindings (D1, Durable Objects) to `next dev` via getCloudflareContext().
initOpenNextCloudflareForDev();
