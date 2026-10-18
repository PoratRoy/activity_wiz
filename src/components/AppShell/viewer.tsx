"use client";

import { createContext, useContext, type ReactNode } from "react";

export type Viewer = {
  signedIn: boolean;
  name?: string | null;
  image?: string | null;
  isAdmin?: boolean;
};

const ViewerContext = createContext<Viewer>({ signedIn: false });

/** Who is looking at the page. Filled from the Auth.js session in step 4. */
export function useViewer() {
  return useContext(ViewerContext);
}

export function ViewerProvider({ viewer, children }: { viewer: Viewer; children: ReactNode }) {
  return <ViewerContext.Provider value={viewer}>{children}</ViewerContext.Provider>;
}
