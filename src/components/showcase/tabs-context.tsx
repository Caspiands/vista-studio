"use client";

import * as React from "react";
import { isModuleKey, type ModuleKey } from "@/lib/modules-shared";

export type TabKey = "overview" | ModuleKey;

interface TabsContextValue {
  active: TabKey;
  setActive: (tab: TabKey) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);
const TAB_EVENT = "vista-tab-change";

export function useTabs() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("useTabs must be used inside <TabsProvider>");
  return ctx;
}

function tabFromHash(): TabKey {
  const hash = window.location.hash.replace(/^#/, "");
  return isModuleKey(hash) ? hash : "overview";
}

function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  window.addEventListener(TAB_EVENT, callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener(TAB_EVENT, callback);
  };
}

export function TabsProvider({ children }: { children: React.ReactNode }) {
  // The active tab lives in the URL hash (as in the original document) so links and reloads keep their place.
  const active = React.useSyncExternalStore(subscribe, tabFromHash, () => "overview" as TabKey);

  const setActive = React.useCallback((tab: TabKey) => {
    const url = tab === "overview" ? window.location.pathname : `#${tab}`;
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new Event(TAB_EVENT));
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const value = React.useMemo(() => ({ active, setActive }), [active, setActive]);
  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}
