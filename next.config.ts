import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

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

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} ${ADSENSE}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${ADSENSE}`,
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
};

export default nextConfig;

// Exposes Cloudflare bindings (D1, Durable Objects) to `next dev` via getCloudflareContext().
initOpenNextCloudflareForDev();
