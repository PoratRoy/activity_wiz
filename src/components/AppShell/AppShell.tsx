import type { ReactNode } from "react";
import { AdBar } from "@/components/AdSlot/AdBar";
import { BottomNav } from "@/components/BottomNav/BottomNav";
import { MessageGate } from "@/components/MessageGate/MessageGate";
import { TermsGate } from "@/components/TermsGate/TermsGate";
import { ToastHost } from "@/components/Toast/Toast";
import { NavigationTracker } from "./history";
import { ViewerProvider, type Viewer } from "./viewer";
import { AppViewport } from "./AppViewport";

/** Wraps every page: content + ad bar + fixed bottom tabs + toasts. Pages render their own TopBar. */
export function AppShell({ viewer, children }: { viewer: Viewer; children: ReactNode }) {
  return (
    <ViewerProvider viewer={viewer}>
      <NavigationTracker />
      <ToastHost>
        <AppViewport>{children}</AppViewport>
        <AdBar />
        <BottomNav />
        <TermsGate />
        <MessageGate />
      </ToastHost>
    </ViewerProvider>
  );
}
