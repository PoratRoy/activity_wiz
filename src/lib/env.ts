import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/** Cloudflare bindings and secrets for the current request. Server-only. */
export function getEnv(): CloudflareEnv {
  return getCloudflareContext().env;
}
