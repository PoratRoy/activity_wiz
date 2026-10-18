import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import { AppShell } from "@/components/AppShell/AppShell";
import { getViewer } from "@/lib/auth/session";
import "./globals.css";

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-rubik",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ActivityWiz – פעולות לתנועות נוער",
    template: "%s | ActivityWiz",
  },
  description: "יוצרים פעולה מוכנה לתנועת הנוער בדקה, בעזרת AI, ומאגר פעולות מוכנות למדריכים.",
  openGraph: { locale: "he_IL", siteName: "ActivityWiz", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#58CC02",
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
