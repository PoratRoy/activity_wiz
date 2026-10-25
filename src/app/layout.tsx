import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import { AppShell } from "@/components/AppShell/AppShell";
import { OPEN_GRAPH, SHARE_IMAGE, SITE_DESCRIPTION } from "@/data/seo";
import { getViewer } from "@/lib/auth/session";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-rubik",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  return {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "ActivityWiz – פעולות לתנועות נוער",
    template: "%s | ActivityWiz",
  },
  description: SITE_DESCRIPTION,
  openGraph: OPEN_GRAPH,
  twitter: { card: "summary_large_image", images: [SHARE_IMAGE] },
  // Search Console and AdSense ownership checks, the same tokens the old app used.
  verification: { google: "c5cOp--x7TLt0QxwSteEmgFxy79wB98EUUo_GjtFWRA" },
  other: { "google-adsense-account": "ca-pub-9858822058074702" },
  };
}

export const viewport: Viewport = {
  themeColor: "#43AE36",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer();
  return (
    <html lang="he" dir="rtl" className={rubik.variable}>
      <body>
        <div className="app">
          <AppShell viewer={viewer}>{children}</AppShell>
        </div>
      </body>
    </html>
  );
}
