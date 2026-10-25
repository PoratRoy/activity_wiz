import { ViewTransition, type ReactNode } from "react";

// Page transitions run on React's <ViewTransition> (the browser's View Transitions API; browsers without it just
// switch instantly). The classes it names are animated in globals.css → "Page transitions".

/** Navigation type for a wait screen handing over to an identical one (generating → the activity's loading screen):
    the swap is invisible, so it doesn't cross-fade (two copies of the animation would show both frames). */
export const WAIT_HANDOFF = "wait-handoff";

/** A whole page: cross-fades with the page it replaces when the first URL segment changes (app/template.tsx). */
export function PageFade({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ [WAIT_HANDOFF]: "none", default: "page-in" }}
      exit={{ [WAIT_HANDOFF]: "none", default: "page-out" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}

/** A loading skeleton: fades out quickly when its page arrives. */
export function SkeletonExit({ children }: { children: ReactNode }) {
  return (
    <ViewTransition exit="skeleton-out" default="none">
      {children}
    </ViewTransition>
  );
}

/** A page's content: fades in over its skeleton once loaded (the skeleton has the same layout). */
export function Reveal({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="reveal-in" default="none">
      {children}
    </ViewTransition>
  );
}
