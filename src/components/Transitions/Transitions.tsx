import { ViewTransition, type ReactNode } from "react";

// Page transitions run on React's <ViewTransition> (the browser's View Transitions API; browsers without it just
// switch instantly). The classes it names are animated in globals.css → "Page transitions".

/** A whole page: cross-fades with the page it replaces when the first URL segment changes (app/template.tsx). */
export function PageFade({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
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
