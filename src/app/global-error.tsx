"use client";

import { useEffect } from "react";

const REDIRECT_MS = 5000;

/**
 * An error in the root layout itself. It replaces the whole document, so it carries its own <html>, styles and a
 * full page load to "/" (the app's router and CSS may be what broke).
 */
export default function GlobalError({ error }: { error: unknown }) {
  useEffect(() => {
    console.error(error);
    const t = setTimeout(() => window.location.replace("/"), REDIRECT_MS);
    return () => clearTimeout(t);
  }, [error]);

  return (
    <html lang="he" dir="rtl">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
          textAlign: "center",
          background: "#e7efdf",
          color: "#255b46",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <title>משהו השתבש | ActivityWiz</title>
        <h1 style={{ margin: 0, fontSize: 26 }}>משהו השתבש</h1>
        <p style={{ margin: 0, color: "#4a5a50" }}>מחזירים אתכם למסך הבית בעוד רגע…</p>
        <a
          href="/"
          style={{ padding: "12px 28px", borderRadius: 999, background: "#32765b", color: "#fff", textDecoration: "none", fontWeight: 700 }}
        >
          למסך הבית
        </a>
      </body>
    </html>
  );
}
