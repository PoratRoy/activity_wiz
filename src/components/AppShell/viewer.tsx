"use client";

import { createContext, useContext, type ReactNode } from "react";

export type Viewer = {
  signedIn: boolean;
  name?: string | null;
  image?: string | null;
  isAdmin?: boolean;
  /** Accepted the terms: signed in, or a guest whose cookie records it. */
  termsAccepted: boolean;
  /** Just signed in: look for an unseen broadcast message. */
  checkMessage?: boolean;
};

const ViewerContext = createContext<Viewer>({ signedIn: false, termsAccepted: false });

/** Who is looking at the page. Filled from the Auth.js session in step 4. */
export function useViewer() {
  return useContext(ViewerContext);
}

export function ViewerProvider({ viewer, children }: { viewer: Viewer; children: ReactNode }) {
  return <ViewerContext.Provider value={viewer}>{children}</ViewerContext.Provider>;
}
