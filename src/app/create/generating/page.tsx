import type { Metadata } from "next";
import { Generating } from "./Generating";

export const metadata: Metadata = { title: "יוצרים פעולה", robots: { index: false } };

// The loading view is a full-screen moment with no top bar; Generating adds one for error views.
export default function GeneratingPage() {
  return <Generating />;
}
