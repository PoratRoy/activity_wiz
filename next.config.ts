import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { LEGACY_ACTIVITIES, LEGACY_CATEGORIES } from "./src/data/legacyRedirects";

// Content Security Policy. Next.js injects inline scripts and styles, so those need 'unsafe-inline'
// (no nonces: pages render per request without a middleware). Google avatars are the only remote
// images of our own. Google AdSense needs its script, frame and request hosts below; ad images come
// from many hosts, so img-src allows any https source.
const ADSENSE = [
  "https://pagead2.googlesyndication.com",
  "https://tpc.googlesyndication.com",
  "https://*.googlesyndication.com",
  "https://*.doubleclick.net",
  "https://*.googleadservices.com",
  "https://*.googletagservices.com",
  "https://*.adtrafficquality.google",
  "https://fundingchoicesmessages.google.com",
  "https://adservice.google.com",
  "https://adservice.google.co.il",
  "https://www.google.com",
  "https://www.gstatic.com",
].join(" ");

// Microsoft Clarity: the tag loads from www.clarity.ms, its script from scripts.clarity.ms, and it uploads
// recordings to *.clarity.ms. Its tracking pixels (c.clarity.ms, c.bing.com) are covered by img-src https:.
const CLARITY = ["https://www.clarity.ms", "https://*.clarity.ms"].join(" ");

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} ${ADSENSE} ${CLARITY}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${ADSENSE} ${CLARITY}`,
  `frame-src ${ADSENSE}`,
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://accounts.google.com",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // Everything renders dynamically per request; OpenNext does not document cacheComponents support.
  cacheComponents: false,
  // The dev badge sits on top of the "הפעולות שלי" tab in local development.
  devIndicators: false,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return legacyRedirects().map((r) => ({ ...r, permanent: true }));
  },
};

// The old Firebase app's URLs (docs/domain-migration.md). Rules match in order, so specific ones come first.
// Every old language had its own copy; the new site is Hebrew only, so other languages go to the home page.
const LANGS = "he|en|es|ar|fr|pt";
const OTHER_LANGS = "en|es|ar|fr|pt";
function legacyRedirects(): { source: string; destination: string }[] {
  const content = "/he/youth/content";
  return [
    // Library: activity → activity, category → category, anything else under content → library.
    { source: `${content}/popular`, destination: "/library/top" },
    ...Object.entries(LEGACY_ACTIVITIES).map(([old, destination]) => ({ source: `${content}/${old}`, destination })),
    ...Object.entries(LEGACY_CATEGORIES).map(([old, destination]) => ({ source: `${content}/${old}/:rest*`, destination })),
    { source: `${content}/:rest*`, destination: "/library" },
    // The youth app's other pages.
    { source: "/he/youth/faq", destination: "/faq" },
    { source: "/he/youth/my-activities/:rest*", destination: "/my" },
    { source: "/he/youth/:step(details|build|activity|addActivity)/:rest*", destination: "/create/group" },
    // Privacy policy lives in the terms page now.
    { source: "/privacy", destination: "/terms" },
    { source: `/:lang(${LANGS})/privacy`, destination: "/terms" },
    // Everything else from the old app: other Hebrew pages, the event / practice / words products, the
    // other languages, the language-less entry points and the old /content redirects.
    { source: "/he/:rest*", destination: "/" },
    { source: `/:lang(${OTHER_LANGS})/:rest*`, destination: "/" },
    { source: `/:lang(${OTHER_LANGS})`, destination: "/" },
    { source: "/:product(youth|event|practice|words|content|status)/:rest*", destination: "/" },
  ];
}

export default nextConfig;

// Exposes Cloudflare bindings (D1, Durable Objects) to `next dev` via getCloudflareContext().
initOpenNextCloudflareForDev();
