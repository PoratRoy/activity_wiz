import type { ReactNode } from "react";
import { BottomNav } from "@/components/BottomNav/BottomNav";
import { ToastHost } from "@/components/Toast/Toast";
import { NavigationTracker } from "./history";
import { ViewerProvider, type Viewer } from "./viewer";
import styles from "./AppShell.module.css";

/** Wraps every page: content + fixed bottom tabs + toasts. Pages render their own TopBar. */
export function AppShell({ viewer, children }: { viewer: Viewer; children: ReactNode }) {
  return (
    <ViewerProvider viewer={viewer}>
      <NavigationTracker />
      <ToastHost>
        <div className={styles.content}>{children}</div>
        <BottomNav />
      </ToastHost>
    </ViewerProvider>
  );
}
