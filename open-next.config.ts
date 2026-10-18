import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incremental cache: all pages render dynamically from D1 (see docs/architecture.md).
export default defineCloudflareConfig({});
