// Fixed public identifiers of the production site, in one place. Safe for client and server code.
// (The runtime origin used for canonicals and the sitemap is SITE_URL, see lib/site.ts.)

/** The production domain, used in shared and copied text so recipients always get the real site. */
export const PUBLIC_SITE_URL = "https://activitywiz.com";

/** Hosts where AdSense serves real ads (it only serves on the approved domain). */
export const AD_HOSTS = ["activitywiz.com", "www.activitywiz.com"];

/** The AdSense publisher ID; it must match public/ads.txt. */
export const ADSENSE_CLIENT = "ca-pub-9858822058074702";
