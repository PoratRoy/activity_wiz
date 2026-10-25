import type { ReactNode } from "react";
import { PageFade } from "@/components/Transitions/Transitions";

/** Remounts when the next URL segment changes, so moving deeper within this section cross-fades too. */
export default function Template({ children }: { children: ReactNode }) {
  return <PageFade>{children}</PageFade>;
}
