import type { ReactNode } from "react";
import { PageFade } from "@/components/Transitions/Transitions";

/** Remounts when the first URL segment changes (switching tabs), so those pages cross-fade. */
export default function Template({ children }: { children: ReactNode }) {
  return <PageFade>{children}</PageFade>;
}
