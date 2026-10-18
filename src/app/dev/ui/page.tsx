import type { Metadata } from "next";
import { TopBar } from "@/components/TopBar/TopBar";
import { UiGallery } from "./UiGallery";

// Temporary component gallery; removed in step 13.
export const metadata: Metadata = { title: "UI", robots: { index: false } };

export default function DevUiPage() {
  return (
    <>
      <TopBar title="רכיבים" back="/" />
      <UiGallery />
    </>
  );
}
